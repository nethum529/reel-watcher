```
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │
├─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┤
│                                                                │
│              r e e l  ─  w a t c h e r                        │
│         paste a link. get the text. no config.                 │
│                                                                │
├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┤
│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
```

![Python](https://img.shields.io/badge/python-3.10%2B-blue?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square) ![MCP](https://img.shields.io/badge/MCP-server-purple?style=flat-square) ![GPU](https://img.shields.io/badge/Whisper-GPU%20accelerated-orange?style=flat-square)

> **Give your AI agent eyes (and ears) for short-form video.** Paste a URL, get text back.

An MCP server that reads YouTube, TikTok, Instagram Reels, carousels, and saved collections — no API keys, no logins to manage, no copy-pasting. It figures out the fastest path to text and takes it.

---

## How it works

```
                        ┌─────────────────────────────────────┐
                        │           paste any URL             │
                        └──────────────┬──────────────────────┘
                                       │
                                       ▼
                          ┌────────────────────────┐
                          │  captions available?   │  ◄── YouTube / Shorts
                          └────────┬──────┬────────┘
                                yes│      │no
                                   │      ▼
                                   │  ┌──────────────────────────────┐
                                   │  │  yt-dlp → audio download     │  ◄── TikTok / Reels
                                   │  └──────────────┬───────────────┘
                                   │                 │
                                   │                 ▼
                                   │  ┌──────────────────────────────┐
                                   │  │  Whisper (GPU if available)  │
                                   │  └──────────────┬───────────────┘
                                   │                 │
                                   │        no video? (carousel)
                                   │                 ▼
                                   │  ┌──────────────────────────────┐
                                   │  │  Scrapling + Firefox cookies │  ◄── image carousels
                                   │  │  → tesseract OCR             │
                                   │  └──────────────┬───────────────┘
                                   │                 │
                                   └────────┬────────┘
                                            ▼
                               ┌────────────────────────┐
                               │  [Caption]             │
                               │  [Transcript]          │
                               │  [Slides]              │
                               └────────────────────────┘
```

---

## What you get

```
$ get_transcript("https://www.instagram.com/p/DZ4_iqYN_vD/")

[Caption]
28 qualified meetings with business owners every month

[Transcript]
I'm using Claude and cold email to give my life meaning, you know,
and that's not an easy thing to do. I'm getting more meetings booked
than I can imagine. It's the same process I use at a consulting firm
that I was working at as a 22-year-old on a six-figure salary...
```

For saved collections:
```
$ get_transcripts_from_page("https://www.instagram.com/user/saved/my-list/123456/")

[
  { "url": "https://instagram.com/p/ABC", "content": "[Caption]\n...\n\n[Transcript]\n..." },
  { "url": "https://instagram.com/p/DEF", "content": "[Caption]\n...\n\n[Slides]\n..." },
  ...
]
```

---

## Platform support

| Platform | Needs cookies | Method | Tool |
|---|---|---|---|
| YouTube | no | caption extraction | `get_transcript` |
| YouTube Shorts | no | caption extraction | `get_transcript` |
| TikTok | no (public) | yt-dlp + Whisper | `get_transcript` |
| Instagram Reels | yes | yt-dlp + Whisper | `get_transcript` |
| Instagram Carousels | yes | Scrapling + OCR | `get_transcript` |
| Instagram Saved Collections | yes | Scrapling + enumeration | `get_transcripts_from_page` |

Cookies are read automatically from your Firefox profile. No exporting, no pasting.

---

## Install

**1. Clone and install**
```bash
git clone https://github.com/nethum529/reel-watcher
cd reel-watcher
pip install -e ".[all]"
```

**2. Install the headless browser** (needed for Instagram saved collections)
```bash
python -m playwright install chromium
```

**3. Install tesseract** (needed for image carousel OCR)
```bash
# Ubuntu / Debian
sudo apt install tesseract-ocr

# macOS
brew install tesseract
```

**4. Log into Instagram in Firefox** — the server reads your existing session automatically.

---

## Use with Claude Code (MCP)

**Register the server:**
```bash
claude mcp add reel-watcher python /path/to/reel-watcher/server.py
```

**Then just talk to Claude:**

```
you:    summarize this reel for me: https://www.instagram.com/p/DZ4_iqYN_vD/
claude: [calls get_transcript]
        This is a cold email pitch by someone claiming to book 28 qualified
        meetings/month using Claude to automate outreach. Classic lead magnet
        funnel — free framework dropped in comments, paid service upsell.

you:    read everything in my claude-code saved folder and tell me what's trending
claude: [calls get_transcripts_from_page with saved collection URL]
        Across 30 posts I'm seeing three clusters: (1) AI coding tools...
```

---

## Auto-detection

On startup the server figures out your setup without any config:

- **GPU** — checks for CUDA via ctranslate2, uses `float16` on GPU and `int8` on CPU
- **Browser** — tries Chrome, Chromium, Firefox, Edge in order
- **Firefox profile** — searches standard locations on Linux and macOS
- **Whisper model** — `small` on GPU, `base` on CPU

---

## System requirements

- Python 3.10+
- Firefox (logged into Instagram)
- `tesseract` CLI
- NVIDIA GPU optional — CPU works, just slower (~1× realtime for Whisper)

---

<details>
<summary>🔧 CUDA 13 compatibility (only needed if you're on CUDA 13 with no CUDA 12 libs)</summary>

`ctranslate2` is built against CUDA 12 and looks for `libcublas.so.12`. If your system only has CUDA 13, create symlinks once:

```bash
mkdir -p ~/.local/lib/cuda-compat
ln -sf /opt/cuda/lib64/libcublas.so.13   ~/.local/lib/cuda-compat/libcublas.so.12
ln -sf /opt/cuda/lib64/libcublasLt.so.13 ~/.local/lib/cuda-compat/libcublasLt.so.12
ln -sf /opt/cuda/lib64/libcudart.so.13   ~/.local/lib/cuda-compat/libcudart.so.12
```

The server detects this directory on startup and re-execs itself with the correct `LD_LIBRARY_PATH` automatically.

</details>

---

## Known limitations

- **Music / silent videos** — Whisper returns garbage or nothing. Nothing to be done.
- **Carousel OCR** — tesseract handles clean text slides fine, struggles with dark backgrounds and decorative fonts. Good enough for info-content, not for design posts.
- **Private TikTok** — needs `--cookies-from-browser` support; public TikTok works without auth.
- **Instagram rate limits** — hammering a large collection fast can get your session flagged. The sequential processing helps here.
