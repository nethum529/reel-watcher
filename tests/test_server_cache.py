import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cache
import server


def test_get_transcript_returns_cached_content_without_rerunning_pipeline(monkeypatch, tmp_path):
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(tmp_path / "transcripts.db"))

    calls = {"caption": 0, "transcript": 0}

    def fake_caption(url):
        calls["caption"] += 1
        return "A Python API walkthrough"

    def fake_transcript(url, lang, tmp):
        calls["transcript"] += 1
        return "Use this code example.", False

    monkeypatch.setattr(server, "_get_caption", fake_caption)
    monkeypatch.setattr(server, "_get_video_transcript", fake_transcript)

    url = "https://www.instagram.com/reel/cache-test/"

    first = server.get_transcript(url)
    second = server.get_transcript(url)

    assert first == second
    assert calls == {"caption": 1, "transcript": 1}

    post = cache.cache_get(url)
    assert post["content"] == first
    assert post["caption"] == "A Python API walkthrough"
    assert post["transcript"] == "Use this code example."
    assert post["slides"] == ""
    assert post["source"] == "instagram"
    assert post["tags"] == ["coding"]


def test_search_cache_and_build_wiki_are_registered_mcp_tools(monkeypatch, tmp_path):
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(tmp_path / "transcripts.db"))

    def fake_search_cache(query, limit):
        return [{"query": query, "limit": limit}]

    monkeypatch.setattr(server.search, "search_cache", fake_search_cache)

    search_results = server.search_cache("Searchable", 7)

    assert search_results == [{"query": "Searchable", "limit": 7}]

    called = {}

    def fake_build_wiki(output_dir="~/.cache/reel-watcher/wiki", open_browser=True):
        called["args"] = (output_dir, open_browser)
        return "/tmp/wiki"

    monkeypatch.setattr(server.wiki_export, "build_wiki", fake_build_wiki)

    assert server.build_wiki("/tmp/out", False) == "/tmp/wiki"
    assert called["args"] == ("/tmp/out", False)

    tools = server.mcp._tool_manager._tools
    assert "search_cache" in tools
    assert "build_wiki" in tools
