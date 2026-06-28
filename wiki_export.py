import json
import shutil
import time
import webbrowser
from pathlib import Path

import cache


_REPO_ROOT = Path(__file__).resolve().parent


def export_wiki_data(output_dir: str) -> dict:
    output_path = Path(output_dir).expanduser()
    output_path.mkdir(parents=True, exist_ok=True)

    posts = cache.cache_get_all()
    data_path = output_path / "data.json"
    data_path.write_text(
        json.dumps({"generated_at": int(time.time()), "posts": posts}),
        encoding="utf-8",
    )

    return {"count": len(posts), "path": str(data_path)}


def build_wiki(
    output_dir: str = "~/.cache/reel-watcher/wiki",
    open_browser: bool = True,
) -> str:
    dist_dir = _REPO_ROOT / "wiki" / "dist"
    if not dist_dir.exists():
        raise RuntimeError(
            "Prebuilt wiki app not found. Build it first with: "
            "cd wiki && npm ci && npm run build"
        )

    output_path = Path(output_dir).expanduser().resolve()
    shutil.copytree(dist_dir, output_path, dirs_exist_ok=True)
    export_wiki_data(str(output_path))

    if open_browser:
        try:
            webbrowser.open((output_path / "index.html").as_uri())
        except Exception:
            pass

    return str(output_path)
