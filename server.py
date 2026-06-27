import glob
import os
import subprocess
import sys
import tempfile

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("reel-watcher")


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
            [
                sys.executable, "-m", "yt_dlp",
                "--write-auto-sub",
                "--sub-lang", lang,
                "--skip-download",
                "--convert-subs", "srt",
                "--output", out_template,
                url,
            ],
            capture_output=True,
            text=True,
        )

        srt_files = glob.glob(os.path.join(tmp, "*.srt"))
        if srt_files:
            return _clean_srt(open(srt_files[0]).read())

        # Fallback: download audio then transcribe with Whisper
        audio_template = os.path.join(tmp, "audio.%(ext)s")
        result = subprocess.run(
            [
                sys.executable, "-m", "yt_dlp",
                "-x",
                "--audio-format", "mp3",
                "--output", audio_template,
                url,
            ],
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


def main():
    mcp.run()


if __name__ == "__main__":
    main()
