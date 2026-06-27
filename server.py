import glob
import os
import subprocess
import tempfile

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("reel-watcher")


def _clean_srt(content: str) -> str:
    lines = content.split("\n")
    result = []
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
        result.append(line)
    return " ".join(result)


@mcp.tool()
def get_transcript(url: str, lang: str = "en") -> str:
    """Get spoken-word transcript from a YouTube, YouTube Shorts, TikTok, or Instagram Reels URL."""
    with tempfile.TemporaryDirectory() as tmp:
        out_template = os.path.join(tmp, "%(id)s.%(ext)s")

        # Fast path: caption extraction (YouTube / Shorts with auto-captions)
        subprocess.run(
            [
                "yt-dlp",
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
                "yt-dlp",
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
