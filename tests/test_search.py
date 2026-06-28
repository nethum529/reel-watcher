import sys

import cache
import search


def test_search_cache_returns_keyword_matches(monkeypatch, tmp_path):
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(tmp_path / "transcripts.db"))

    cache.cache_set(
        "https://example.com/match",
        content="A detailed breakdown of sourdough fermentation timing.",
        creator="baker",
        tags=["bread", "science"],
    )
    cache.cache_set(
        "https://example.com/other",
        content="A quick tour of a city garden.",
        creator="gardener",
        tags=["plants"],
    )

    assert search.rebuild_fts_index() == 2

    results = search.search_cache("sourdough")

    assert [result["url"] for result in results] == ["https://example.com/match"]
    assert results[0]["creator"] == "baker"
    assert results[0]["tags"] == ["bread", "science"]
    assert "sourdough" in results[0]["snippet"].lower()
    assert isinstance(results[0]["score"], float)


def test_search_cache_returns_empty_list_for_non_match(monkeypatch, tmp_path):
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(tmp_path / "transcripts.db"))
    cache.cache_set("https://example.com/video", content="Only talks about ceramics.")
    search.rebuild_fts_index()

    assert search.search_cache("sourdough") == []


def test_search_cache_works_without_sqlite_vec(monkeypatch, tmp_path):
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(tmp_path / "transcripts.db"))
    monkeypatch.setitem(sys.modules, "sqlite_vec", None)

    cache.cache_set(
        "https://example.com/keyword",
        content="Keyword fallback still searches transcript text.",
    )
    search.rebuild_fts_index()

    assert [result["url"] for result in search.search_cache("fallback")] == [
        "https://example.com/keyword"
    ]
