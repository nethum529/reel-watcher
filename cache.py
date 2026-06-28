import json
import os
import sqlite3
import time


def cache_path() -> str:
    return os.environ.get(
        "REEL_WATCHER_CACHE",
        os.path.expanduser("~/.cache/reel-watcher/transcripts.db"),
    )


def get_connection() -> sqlite3.Connection:
    path = cache_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS transcripts (
            url TEXT PRIMARY KEY,
            id TEXT,
            source TEXT,
            caption TEXT,
            transcript TEXT,
            slides TEXT,
            content TEXT NOT NULL,
            creator TEXT,
            posted_at TEXT,
            view_count INTEGER,
            tags TEXT,
            fetched_at INTEGER NOT NULL,
            ttl_days INTEGER DEFAULT 30
        )
        """
    )
    conn.commit()
    return conn


def _row_to_post(row: sqlite3.Row) -> dict:
    post = dict(row)
    post["tags"] = json.loads(post["tags"] or "[]")
    return {
        "id": post["id"],
        "url": post["url"],
        "source": post["source"],
        "caption": post["caption"],
        "transcript": post["transcript"],
        "slides": post["slides"],
        "content": post["content"],
        "creator": post["creator"],
        "posted_at": post["posted_at"],
        "view_count": post["view_count"],
        "tags": post["tags"],
        "fetched_at": post["fetched_at"],
    }


def cache_get(url) -> dict | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM transcripts WHERE url = ?",
            (url,),
        ).fetchone()

    if row is None:
        return None

    if int(time.time()) - row["fetched_at"] > row["ttl_days"] * 86400:
        return None

    return _row_to_post(row)


def cache_set(
    url,
    *,
    content,
    caption="",
    transcript="",
    slides="",
    id="",
    source="",
    creator="",
    posted_at=None,
    view_count=None,
    tags=None,
    ttl_days=30,
) -> None:
    fetched_at = int(time.time())
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO transcripts (
                url, id, source, caption, transcript, slides, content, creator,
                posted_at, view_count, tags, fetched_at, ttl_days
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(url) DO UPDATE SET
                id = excluded.id,
                source = excluded.source,
                caption = excluded.caption,
                transcript = excluded.transcript,
                slides = excluded.slides,
                content = excluded.content,
                creator = excluded.creator,
                posted_at = excluded.posted_at,
                view_count = excluded.view_count,
                tags = excluded.tags,
                fetched_at = excluded.fetched_at,
                ttl_days = excluded.ttl_days
            """,
            (
                url,
                id,
                source,
                caption,
                transcript,
                slides,
                content,
                creator,
                posted_at,
                view_count,
                json.dumps(tags or []),
                fetched_at,
                ttl_days,
            ),
        )


def cache_get_all() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM transcripts ORDER BY fetched_at DESC"
        ).fetchall()

    return [_row_to_post(row) for row in rows]
