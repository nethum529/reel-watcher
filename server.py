import os
import sys

# LD_LIBRARY_PATH must be present when the process starts — os.environ changes
# after startup don't affect the dynamic linker's search path cache.
# If the CUDA 13-only compat dir exists and we haven't restarted yet, re-exec
# ourselves with the correct env so ctranslate2 can find libcublas.so.12.
#
# To set up the compat dir on a CUDA 13-only system:
#   mkdir -p ~/.local/lib/cuda-compat
#   ln -sf /opt/cuda/lib64/libcublas.so.13   ~/.local/lib/cuda-compat/libcublas.so.12
#   ln -sf /opt/cuda/lib64/libcublasLt.so.13 ~/.local/lib/cuda-compat/libcublasLt.so.12
#   ln -sf /opt/cuda/lib64/libcudart.so.13   ~/.local/lib/cuda-compat/libcudart.so.12
_CUDA_COMPAT = os.path.expanduser("~/.local/lib/cuda-compat")
if os.path.isdir(_CUDA_COMPAT) and "__REEL_WATCHER_RESTARTED" not in os.environ:
    _env = {
        **os.environ,
        "LD_LIBRARY_PATH": _CUDA_COMPAT + ":" + os.environ.get("LD_LIBRARY_PATH", ""),
        "__REEL_WATCHER_RESTARTED": "1",
    }
    os.execve(sys.executable, [sys.executable] + sys.argv, _env)

import glob
import io
import shutil
import subprocess
import tempfile

import ctranslate2
import requests as _requests
from mcp.server.fastmcp import FastMCP

import cache
import search
import tagging
import wiki_export

mcp = FastMCP("reel-watcher")

_DEVICE = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
_COMPUTE_TYPE = "float16" if _DEVICE == "cuda" else "int8"
_WHISPER_MODEL = "small" if _DEVICE == "cuda" else "base"


# ---------------------------------------------------------------------------
# Browser / cookie helpers
# ---------------------------------------------------------------------------

def _detect_browser() -> str | None:
    candidates = {
        "chrome": ["google-chrome", "google-chrome-stable", "chrome"],
        "chromium": ["chromium", "chromium-browser"],
        "firefox": ["firefox", "firefox-esr"],
        "edge": ["microsoft-edge", "msedge"],
    }
    for browser, bins in candidates.items():
        if any(shutil.which(b) for b in bins):
            return browser
    return None


_BROWSER = _detect_browser()


def _ytdlp(*args: str) -> list[str]:
    cmd = [sys.executable, "-m", "yt_dlp"]
    if _BROWSER:
        cmd += ["--cookies-from-browser", _BROWSER]
    return cmd + list(args)


def _find_firefox_cookies() -> str:
    """Return path to the Firefox cookies.sqlite, searching common locations."""
    patterns = [
        "~/.config/mozilla/firefox/*/cookies.sqlite",   # Linux
        "~/.mozilla/firefox/*/cookies.sqlite",           # Linux (alt)
        "~/Library/Application Support/Firefox/Profiles/*/cookies.sqlite",  # macOS
    ]
    for pattern in patterns:
        matches = glob.glob(os.path.expanduser(pattern))
        if matches:
            return matches[0]
    raise RuntimeError(
        "Could not find Firefox cookie file. "
        "Make sure Firefox is installed and you have logged into Instagram in it."
    )


def _instagram_cookies() -> list[dict]:
    """Load Instagram cookies from the user's Firefox profile."""
    import browser_cookie3
    cookie_file = _find_firefox_cookies()
    raw = list(browser_cookie3.firefox(cookie_file=cookie_file, domain_name="instagram.com"))
    return [
        {"name": c.name, "value": c.value, "domain": ".instagram.com", "path": "/"}
        for c in raw
    ]


# ---------------------------------------------------------------------------
# SRT cleaning
# ---------------------------------------------------------------------------

def _clean_srt(content: str) -> str:
    text_lines = []
    skip_timestamp = False
    for line in content.split("\n"):
        line = line.strip()
        if not line:
            continue
        if line.isdigit():
            skip_timestamp = True
            continue
        if skip_timestamp and "-->" in line:
            skip_timestamp = False
            continue
        text_lines.append(line)

    # YouTube rolling captions repeat phrases across overlapping blocks —
    # skip any word sequence already present at the tail of our result.
    words = " ".join(text_lines).split()
    result: list[str] = []
    i = 0
    while i < len(words):
        if result:
            skipped = False
            for overlap in range(min(20, len(result), len(words) - i), 1, -1):
                if result[-overlap:] == words[i:i + overlap]:
                    i += overlap
                    skipped = True
                    break
            if not skipped:
                result.append(words[i])
                i += 1
        else:
            result.append(words[i])
            i += 1
    return " ".join(result)


# ---------------------------------------------------------------------------
# Caption
# ---------------------------------------------------------------------------

def _get_caption(url: str) -> str:
    result = subprocess.run(
        _ytdlp("--print", "description", url),
        capture_output=True, text=True,
    )
    return result.stdout.strip() if result.returncode == 0 else ""


# ---------------------------------------------------------------------------
# Video transcript
# ---------------------------------------------------------------------------

def _get_video_transcript(url: str, lang: str, tmp: str) -> tuple[str, bool]:
    """Returns (transcript, is_image_carousel).
    is_image_carousel=True means yt-dlp found no video — caller should try OCR."""
    out_template = os.path.join(tmp, "%(id)s.%(ext)s")

    subprocess.run(
        _ytdlp(
            "--write-auto-sub", "--sub-lang", lang,
            "--skip-download", "--convert-subs", "srt",
            "--output", out_template, url,
        ),
        capture_output=True, text=True,
    )

    srt_files = glob.glob(os.path.join(tmp, "*.srt"))
    if srt_files:
        return _clean_srt(open(srt_files[0]).read()), False

    audio_template = os.path.join(tmp, "audio.%(ext)s")
    result = subprocess.run(
        _ytdlp("-x", "--audio-format", "mp3", "--output", audio_template, url),
        capture_output=True, text=True,
    )

    if result.returncode != 0:
        return "", "No video formats found" in result.stderr

    audio_files = glob.glob(os.path.join(tmp, "audio.*"))
    if not audio_files:
        return "", False

    from faster_whisper import WhisperModel
    model = WhisperModel(_WHISPER_MODEL, device=_DEVICE, compute_type=_COMPUTE_TYPE)
    segments, _ = model.transcribe(audio_files[0], language=lang)
    return " ".join(s.text.strip() for s in segments), False


# ---------------------------------------------------------------------------
# Carousel image OCR
# ---------------------------------------------------------------------------

def _get_carousel_image_urls(url: str) -> list[str]:
    from scrapling.fetchers import DynamicFetcher
    cookies = _instagram_cookies()
    page = DynamicFetcher.fetch(url, headless=True, network_idle=True, cookies=cookies, timeout=20000)
    imgs = page.css('img[src*="t51.82787-15"]::attr(src)').getall()
    return list(dict.fromkeys(imgs))


def _preprocess_for_ocr(img):
    from PIL import ImageFilter, ImageOps
    img = img.convert("L")
    img = ImageOps.autocontrast(img)
    img = img.filter(ImageFilter.SHARPEN)
    return img


def _ocr_images(image_urls: list[str]) -> str:
    import pytesseract
    from PIL import Image

    headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"}
    texts: list[str] = []
    for img_url in image_urls:
        try:
            resp = _requests.get(img_url, headers=headers, timeout=10)
            img = Image.open(io.BytesIO(resp.content)).convert("RGB")
            text = pytesseract.image_to_string(_preprocess_for_ocr(img), config="--psm 6").strip()
            if text:
                texts.append(text)
        except Exception:
            continue
    return "\n\n---\n\n".join(texts)


# ---------------------------------------------------------------------------
# Instagram saved collection listing
# ---------------------------------------------------------------------------

def _list_instagram_collection(url: str) -> list[str]:
    from scrapling.fetchers import DynamicFetcher
    cookies = _instagram_cookies()
    page = DynamicFetcher.fetch(url, headless=True, network_idle=True, cookies=cookies, timeout=20000)
    links = page.css('a[href*="/p/"]::attr(href)').getall()
    links += page.css('a[href*="/reel/"]::attr(href)').getall()
    seen: set[str] = set()
    result: list[str] = []
    for link in links:
        full = "https://www.instagram.com" + link if link.startswith("/") else link
        if full not in seen:
            seen.add(full)
            result.append(full)
    return result


def _list_videos_from_page(url: str) -> list[str]:
    if "instagram.com" in url and "/saved/" in url:
        return _list_instagram_collection(url)
    result = subprocess.run(
        _ytdlp("--flat-playlist", "--print", "webpage_url", url),
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Failed to list videos: {result.stderr[:400]}")
    return [u.strip() for u in result.stdout.strip().splitlines() if u.strip()]


# ---------------------------------------------------------------------------
# MCP tools
# ---------------------------------------------------------------------------

def _source_from_url(url: str) -> str:
    if "instagram.com" in url:
        return "instagram"
    if "tiktok.com" in url:
        return "tiktok"
    if "youtube.com" in url or "youtu.be" in url:
        return "youtube"
    return ""


@mcp.tool()
def get_transcript(url: str, lang: str = "en") -> str:
    """Get all text content from a short-form video or image carousel URL.

    Returns a structured string containing any combination of:
    - [Caption]: the post caption written by the creator
    - [Transcript]: speech-to-text from video audio (GPU-accelerated via Whisper)
    - [Slides]: OCR text from image carousel slides

    Supports YouTube, YouTube Shorts, TikTok, Instagram Reels, and Instagram carousels.
    """
    hit = cache.cache_get(url)
    if hit:
        return hit["content"]

    parts: list[str] = []

    caption = _get_caption(url)
    if caption:
        parts.append(f"[Caption]\n{caption}")

    ocr_text = ""
    with tempfile.TemporaryDirectory() as tmp:
        transcript, is_carousel = _get_video_transcript(url, lang, tmp)

    if transcript and transcript.strip() != "[no speech detected]":
        parts.append(f"[Transcript]\n{transcript}")
    elif is_carousel:
        image_urls = _get_carousel_image_urls(url)
        if image_urls:
            ocr_text = _ocr_images(image_urls)
            if ocr_text:
                parts.append(f"[Slides]\n{ocr_text}")

    content = "\n\n".join(parts) or "[no content extracted]"
    if content != "[no content extracted]":
        tags = tagging.auto_tag(content)
        cache.cache_set(
            url,
            content=content,
            caption=caption,
            transcript=transcript,
            slides=ocr_text,
            source=_source_from_url(url),
            tags=tags,
        )

    return content


@mcp.tool()
def get_transcripts_from_page(url: str, lang: str = "en") -> list:
    """Get all text content from every post in an Instagram saved folder, profile, or playlist.

    Pass an Instagram saved collection URL, a profile/reels page, or any yt-dlp-supported
    playlist URL. Returns a list of {url, content} dicts.
    """
    urls = _list_videos_from_page(url)
    if not urls:
        raise RuntimeError("No videos found at that URL")

    results = []
    for video_url in urls:
        try:
            content = get_transcript(video_url, lang=lang)
        except Exception as e:
            content = f"[error: {e}]"
        results.append({"url": video_url, "content": content})

    return results


@mcp.tool()
def search_cache(query: str, limit: int = 20) -> list:
    """Search cached transcript content and return matching posts."""
    return search.search_cache(query, limit)


@mcp.tool()
def build_wiki(
    output_dir: str = "~/.cache/reel-watcher/wiki",
    open_browser: bool = True,
) -> str:
    """Build the cached transcript wiki and optionally open it in a browser."""
    return wiki_export.build_wiki(output_dir, open_browser)


def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
