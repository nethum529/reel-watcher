import glob
import os
import shutil
import subprocess
import sys
import tempfile

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("reel-watcher")

_BROWSER_CANDIDATES = ["chrome", "chromium", "firefox", "edge", "opera", "safari"]

def _detect_browser() -> str | None:
    executables = {
        "chrome": ["google-chrome", "google-chrome-stable", "chrome"],
        "chromium": ["chromium", "chromium-browser"],
        "firefox": ["firefox", "firefox-esr"],
        "edge": ["microsoft-edge", "msedge"],
        "opera": ["opera"],
        "safari": ["safari"],
    }
    for browser, bins in executables.items():
        if any(shutil.which(b) for b in bins):
            return browser
    return None

_BROWSER = _detect_browser()

def _ytdlp(*args: str) -> list[str]:
    cmd = [sys.executable, "-m", "yt_dlp"]
    if _BROWSER:
        cmd += ["--cookies-from-browser", _BROWSER]
    return cmd + list(args)


def _clean_srt(content: str) -> str:
    lines = content.split("\n")
    text_lines = []
    skip_timestamp = False
    for line in lines:
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

    # YouTube rolling captions: each new block overlaps with the end of the previous.
    # Fix by detecting when the current word starts a sequence already at the tail of our result.
    words = " ".join(text_lines).split()
    result = []
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


@mcp.tool()
def get_transcript(url: str, lang: str = "en") -> str:
    """Get spoken-word transcript from a YouTube, YouTube Shorts, TikTok, or Instagram Reels URL."""
    with tempfile.TemporaryDirectory() as tmp:
        out_template = os.path.join(tmp, "%(id)s.%(ext)s")

        # Fast path: caption extraction (YouTube / Shorts with auto-captions)
        subprocess.run(
            _ytdlp(
                "--write-auto-sub",
                "--sub-lang", lang,
                "--skip-download",
                "--convert-subs", "srt",
                "--output", out_template,
                url,
            ),
            capture_output=True,
            text=True,
        )

        srt_files = glob.glob(os.path.join(tmp, "*.srt"))
        if srt_files:
            return _clean_srt(open(srt_files[0]).read())

        # Fallback: download audio then transcribe with Whisper
        audio_template = os.path.join(tmp, "audio.%(ext)s")
        result = subprocess.run(
            _ytdlp(
                "-x",
                "--audio-format", "mp3",
                "--output", audio_template,
                url,
            ),
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            raise RuntimeError(f"yt-dlp failed: {result.stderr[:400]}")

        audio_files = glob.glob(os.path.join(tmp, "audio.*"))
        if not audio_files:
            raise RuntimeError("Audio download produced no file")

        from faster_whisper import WhisperModel

        model = WhisperModel("base", device="cpu", compute_type="int8")
        segments, _ = model.transcribe(audio_files[0], language=lang)
        text = " ".join(s.text.strip() for s in segments)
        return text or "[no speech detected]"


def _list_videos_from_page(url: str) -> list[str]:
    """Return individual video URLs from a page (profile, playlist, or saved collection)."""
    # Instagram saved collections aren't supported by yt-dlp — use scrapling + cookies
    if "instagram.com" in url and "/saved/" in url:
        return _list_instagram_collection(url)

    result = subprocess.run(
        _ytdlp("--flat-playlist", "--print", "webpage_url", url),
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Failed to list videos: {result.stderr[:400]}")
    return [u.strip() for u in result.stdout.strip().splitlines() if u.strip()]


_SCRAPLING_PYTHON = os.path.expanduser("~/.venvs/scrapling/bin/python")

_SCRAPLING_SCRIPT = '''
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
    """Enumerate posts in an Instagram saved collection using scrapling + Firefox cookies."""
    import json as _json

    cookie_file = _find_firefox_cookies()
    script = _SCRAPLING_SCRIPT.format(cookie_file=cookie_file, url=url)

    result = subprocess.run(
        [_SCRAPLING_PYTHON, "-c", script],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"scrapling failed: {result.stderr[:400]}")

    return _json.loads(result.stdout.strip())


def _find_firefox_cookies() -> str:
    import glob as _glob
    patterns = [
        os.path.expanduser("~/.config/mozilla/firefox/*/cookies.sqlite"),
        os.path.expanduser("~/.mozilla/firefox/*/cookies.sqlite"),
    ]
    for pattern in patterns:
        matches = _glob.glob(pattern)
        if matches:
            return matches[0]
    raise RuntimeError("Could not find Firefox cookie file")


@mcp.tool()
def get_transcripts_from_page(url: str, lang: str = "en") -> list:
    """Get transcripts from all videos on an Instagram saved folder, profile, or playlist URL."""
    urls = _list_videos_from_page(url)
    if not urls:
        raise RuntimeError("No videos found at that URL")

    transcripts = []
    for video_url in urls:
        try:
            transcript = get_transcript(video_url, lang=lang)
        except Exception as e:
            transcript = f"[error: {e}]"
        transcripts.append({"url": video_url, "transcript": transcript})

    return transcripts


def main():
    mcp.run()


if __name__ == "__main__":
    main()
