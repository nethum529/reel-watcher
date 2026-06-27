import glob
import io
import os
import shutil
import subprocess
import sys
import tempfile

import ctranslate2
import requests as _requests
from mcp.server.fastmcp import FastMCP

# Inject CUDA 12 compat symlinks into library path so ctranslate2 finds libcublas.so.12
# even on systems that only ship CUDA 13 (symlinks live in ~/.local/lib/cuda-compat)
_CUDA_COMPAT = os.path.expanduser("~/.local/lib/cuda-compat")
if os.path.isdir(_CUDA_COMPAT):
    os.environ["LD_LIBRARY_PATH"] = _CUDA_COMPAT + ":" + os.environ.get("LD_LIBRARY_PATH", "")

mcp = FastMCP("reel-watcher")

# GPU detection — ctranslate2 (used by faster-whisper) sees the GPU directly
_DEVICE = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
_COMPUTE_TYPE = "float16" if _DEVICE == "cuda" else "int8"
_WHISPER_MODEL = "small" if _DEVICE == "cuda" else "base"

_SCRAPLING_PYTHON = os.path.expanduser("~/.venvs/scrapling/bin/python")


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
    for pattern in [
        os.path.expanduser("~/.config/mozilla/firefox/*/cookies.sqlite"),
        os.path.expanduser("~/.mozilla/firefox/*/cookies.sqlite"),
    ]:
        matches = glob.glob(pattern)
        if matches:
            return matches[0]
    raise RuntimeError("Could not find Firefox cookie file")


# --- SRT cleaning -----------------------------------------------------------

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

    # YouTube rolling captions repeat phrases across overlapping blocks
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


# --- Caption ----------------------------------------------------------------

def _get_caption(url: str) -> str:
    result = subprocess.run(
        _ytdlp("--print", "description", url),
        capture_output=True, text=True,
    )
    return result.stdout.strip() if result.returncode == 0 else ""


# --- Video transcript -------------------------------------------------------

def _get_video_transcript(url: str, lang: str, tmp: str) -> tuple[str, bool]:
    """Returns (transcript_text, hit_no_video_error).
    hit_no_video_error=True signals an image carousel — caller should try OCR."""
    out_template = os.path.join(tmp, "%(id)s.%(ext)s")

    # Fast path: caption/subtitle extraction
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

    # Fallback: audio download + Whisper
    audio_template = os.path.join(tmp, "audio.%(ext)s")
    result = subprocess.run(
        _ytdlp("-x", "--audio-format", "mp3", "--output", audio_template, url),
        capture_output=True, text=True,
    )

    if result.returncode != 0:
        no_video = "No video formats found" in result.stderr
        return "", no_video

    audio_files = glob.glob(os.path.join(tmp, "audio.*"))
    if not audio_files:
        return "", False

    from faster_whisper import WhisperModel
    model = WhisperModel(_WHISPER_MODEL, device=_DEVICE, compute_type=_COMPUTE_TYPE)
    segments, _ = model.transcribe(audio_files[0], language=lang)
    return " ".join(s.text.strip() for s in segments), False


# --- Carousel image OCR -----------------------------------------------------

_SCRAPLING_IMAGES_SCRIPT = '''
import json, browser_cookie3
from scrapling.fetchers import DynamicFetcher

cookie_file = {cookie_file!r}
raw = list(browser_cookie3.firefox(cookie_file=cookie_file, domain_name="instagram.com"))
cookies = [{{"name": c.name, "value": c.value, "domain": ".instagram.com", "path": "/"}} for c in raw]

page = DynamicFetcher.fetch({url!r}, headless=True, network_idle=True, cookies=cookies, timeout=20000)

imgs = page.css('img[src*="t51.82787-15"]::attr(src)').getall()
print(json.dumps(list(dict.fromkeys(imgs))))
'''


def _get_carousel_image_urls(url: str) -> list[str]:
    cookie_file = _find_firefox_cookies()
    script = _SCRAPLING_IMAGES_SCRIPT.format(cookie_file=cookie_file, url=url)
    result = subprocess.run(
        [_SCRAPLING_PYTHON, "-c", script],
        capture_output=True, text=True,
    )
    if result.returncode != 0 or not result.stdout.strip():
        return []
    import json as _json
    return _json.loads(result.stdout.strip())


def _preprocess_for_ocr(img):
    """Normalise contrast so tesseract handles dark-background slides better."""
    from PIL import ImageFilter, ImageOps
    img = img.convert("L")
    img = ImageOps.autocontrast(img)
    img = img.filter(ImageFilter.SHARPEN)
    return img


def _ocr_images(image_urls: list[str]) -> str:
    import pytesseract
    from PIL import Image

    texts: list[str] = []
    headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"}
    for img_url in image_urls:
        try:
            resp = _requests.get(img_url, headers=headers, timeout=10)
            img = Image.open(io.BytesIO(resp.content)).convert("RGB")
            processed = _preprocess_for_ocr(img)
            text = pytesseract.image_to_string(processed, config="--psm 6").strip()
            if text:
                texts.append(text)
        except Exception:
            continue
    return "\n\n---\n\n".join(texts)


# --- Instagram saved collection listing ------------------------------------

_SCRAPLING_COLLECTION_SCRIPT = '''
import json, browser_cookie3
from scrapling.fetchers import DynamicFetcher

cookie_file = {cookie_file!r}
raw = list(browser_cookie3.firefox(cookie_file=cookie_file, domain_name="instagram.com"))
cookies = [{{"name": c.name, "value": c.value, "domain": ".instagram.com", "path": "/"}} for c in raw]
page = DynamicFetcher.fetch({url!r}, headless=True, network_idle=True, cookies=cookies, timeout=20000)
links = page.css('a[href*="/p/"]::attr(href)').getall()
links += page.css('a[href*="/reel/"]::attr(href)').getall()
seen, result = set(), []
for link in links:
    full = "https://www.instagram.com" + link if link.startswith("/") else link
    if full not in seen:
        seen.add(full)
        result.append(full)
print(json.dumps(result))
'''


def _list_instagram_collection(url: str) -> list[str]:
    import json as _json
    cookie_file = _find_firefox_cookies()
    script = _SCRAPLING_COLLECTION_SCRIPT.format(cookie_file=cookie_file, url=url)
    result = subprocess.run(
        [_SCRAPLING_PYTHON, "-c", script],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"scrapling failed: {result.stderr[:400]}")
    return _json.loads(result.stdout.strip())


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


# --- MCP tools --------------------------------------------------------------

@mcp.tool()
def get_transcript(url: str, lang: str = "en") -> str:
    """Get all text content from a video, image carousel, or post URL.
    Returns caption + transcript (videos) or caption + slide OCR text (carousels)."""
    parts: list[str] = []

    caption = _get_caption(url)
    if caption:
        parts.append(f"[Caption]\n{caption}")

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

    return "\n\n".join(parts) or "[no content extracted]"


@mcp.tool()
def get_transcripts_from_page(url: str, lang: str = "en") -> list:
    """Get all text content from every post in an Instagram saved folder, profile, or playlist."""
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


def main():
    mcp.run()


if __name__ == "__main__":
    main()
