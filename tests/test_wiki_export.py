import json
from pathlib import Path

import cache
import wiki_export


def test_export_wiki_data_writes_cache_posts(monkeypatch, tmp_path):
    db_path = tmp_path / "transcripts.db"
    output_dir = tmp_path / "out"
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(db_path))

    cache.cache_set(
        "https://example.com/one",
        id="one",
        source="instagram",
        caption="caption one",
        transcript="transcript one",
        slides="slides one",
        content="content one",
        creator="creator one",
        posted_at="2026-06-27",
        view_count=100,
        tags=["alpha", "beta"],
    )
    cache.cache_set(
        "https://example.com/two",
        id="two",
        source="tiktok",
        caption="caption two",
        transcript="transcript two",
        slides="slides two",
        content="content two",
        creator="creator two",
        posted_at="2026-06-26",
        view_count=200,
        tags=["gamma"],
    )

    result = wiki_export.export_wiki_data(str(output_dir))

    data_path = output_dir / "data.json"
    data = json.loads(data_path.read_text())

    assert result == {"count": 2, "path": str(data_path)}
    assert isinstance(data["generated_at"], int)
    assert len(data["posts"]) == 2
    assert set(data["posts"][0]) == {
        "id",
        "url",
        "source",
        "caption",
        "transcript",
        "slides",
        "content",
        "creator",
        "posted_at",
        "view_count",
        "tags",
        "fetched_at",
    }
    assert isinstance(data["posts"][0]["tags"], list)
    assert data["posts"] == cache.cache_get_all()


def test_build_wiki_copies_dist_and_writes_data(monkeypatch, tmp_path):
    db_path = tmp_path / "transcripts.db"
    repo_root = tmp_path / "repo"
    dist_dir = repo_root / "wiki" / "dist"
    output_dir = tmp_path / "wiki-out"
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(db_path))
    monkeypatch.setattr(wiki_export, "_REPO_ROOT", repo_root)
    monkeypatch.setattr(wiki_export.webbrowser, "open", lambda _url: False)

    dist_dir.mkdir(parents=True)
    (dist_dir / "index.html").write_text("<main>wiki</main>")
    cache.cache_set("https://example.com/video", content="cached content")

    result = wiki_export.build_wiki(str(output_dir), open_browser=True)

    assert result == str(output_dir.resolve())
    assert (output_dir / "index.html").read_text() == "<main>wiki</main>"
    data = json.loads((output_dir / "data.json").read_text())
    assert isinstance(data["generated_at"], int)
    assert data["posts"] == cache.cache_get_all()
