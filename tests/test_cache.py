import sqlite3
import time

import pytest

import cache


@pytest.fixture
def temp_cache(monkeypatch, tmp_path):
    db_path = tmp_path / "transcripts.db"
    monkeypatch.setenv("REEL_WATCHER_CACHE", str(db_path))
    return db_path


def test_cache_get_returns_none_on_miss(temp_cache):
    assert cache.cache_get("https://example.com/missing") is None


def test_cache_set_then_get_returns_post_dict(temp_cache):
    url = "https://example.com/video"

    cache.cache_set(
        url,
        id="post-1",
        source="instagram",
        caption="caption",
        transcript="transcript",
        slides="slides",
        content="content",
        creator="creator",
        posted_at="2026-06-27",
        view_count=123,
        tags=["alpha"],
    )

    post = cache.cache_get(url)

    assert post["url"] == url
    assert post["id"] == "post-1"
    assert post["source"] == "instagram"
    assert post["caption"] == "caption"
    assert post["transcript"] == "transcript"
    assert post["slides"] == "slides"
    assert post["content"] == "content"
    assert post["creator"] == "creator"
    assert post["posted_at"] == "2026-06-27"
    assert post["view_count"] == 123
    assert isinstance(post["fetched_at"], int)


def test_cache_get_returns_none_when_stale(temp_cache):
    url = "https://example.com/stale"
    stale_fetched_at = int(time.time()) - (2 * 86400)

    with cache.get_connection() as conn:
        conn.execute(
            """
            INSERT INTO transcripts (
                url, content, tags, fetched_at, ttl_days
            ) VALUES (?, ?, ?, ?, ?)
            """,
            (url, "old content", "[]", stale_fetched_at, 1),
        )

    assert cache.cache_get(url) is None


def test_cache_set_upserts_and_overwrites_existing_row(temp_cache):
    url = "https://example.com/upsert"

    cache.cache_set(url, content="old", caption="old caption")
    cache.cache_set(url, content="new", caption="new caption")

    post = cache.cache_get(url)

    assert post["content"] == "new"
    assert post["caption"] == "new caption"


def test_cache_tags_round_trip_as_list(temp_cache):
    url = "https://example.com/tags"

    cache.cache_set(url, content="content", tags=["one", "two"])

    assert cache.cache_get(url)["tags"] == ["one", "two"]


def test_cache_get_all_returns_newest_first_without_ttl_filtering(temp_cache):
    now = int(time.time())
    rows = [
        ("https://example.com/old", "old", "[]", now - 100, 0),
        ("https://example.com/new", "new", "[]", now, 30),
        ("https://example.com/mid", "mid", "[]", now - 50, 30),
    ]

    with cache.get_connection() as conn:
        conn.executemany(
            """
            INSERT INTO transcripts (
                url, content, tags, fetched_at, ttl_days
            ) VALUES (?, ?, ?, ?, ?)
            """,
            rows,
        )

    posts = cache.cache_get_all()

    assert [post["url"] for post in posts] == [
        "https://example.com/new",
        "https://example.com/mid",
        "https://example.com/old",
    ]
