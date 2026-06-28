import json
import sqlite3

import cache


def _load_sqlite_vec(conn: sqlite3.Connection) -> None:
    try:
        import sqlite_vec

        sqlite_vec.load(conn)
    except Exception:
        pass


def ensure_fts(conn: sqlite3.Connection) -> None:
    _load_sqlite_vec(conn)
    conn.execute(
        """
        CREATE VIRTUAL TABLE IF NOT EXISTS transcripts_fts
        USING fts5(url UNINDEXED, content, content='transcripts')
        """
    )
    conn.execute(
        """
        CREATE TRIGGER IF NOT EXISTS transcripts_fts_ai
        AFTER INSERT ON transcripts BEGIN
            INSERT INTO transcripts_fts(rowid, url, content)
            VALUES (new.rowid, new.url, new.content);
        END
        """
    )
    conn.execute(
        """
        CREATE TRIGGER IF NOT EXISTS transcripts_fts_ad
        AFTER DELETE ON transcripts BEGIN
            INSERT INTO transcripts_fts(transcripts_fts, rowid, url, content)
            VALUES ('delete', old.rowid, old.url, old.content);
        END
        """
    )
    conn.execute(
        """
        CREATE TRIGGER IF NOT EXISTS transcripts_fts_au
        AFTER UPDATE ON transcripts BEGIN
            INSERT INTO transcripts_fts(transcripts_fts, rowid, url, content)
            VALUES ('delete', old.rowid, old.url, old.content);
            INSERT INTO transcripts_fts(rowid, url, content)
            VALUES (new.rowid, new.url, new.content);
        END
        """
    )
    conn.commit()


def rebuild_fts_index() -> int:
    with cache.get_connection() as conn:
        ensure_fts(conn)
        count = conn.execute("SELECT COUNT(*) FROM transcripts").fetchone()[0]
        conn.execute("INSERT INTO transcripts_fts(transcripts_fts) VALUES ('rebuild')")
        conn.commit()
        return count


def search_cache(query: str, limit: int = 20) -> list[dict]:
    if not query.strip():
        return []

    with cache.get_connection() as conn:
        ensure_fts(conn)
        rows = conn.execute(
            """
            SELECT
                f.url,
                snippet(transcripts_fts, 1, '<mark>', '</mark>', '...', 24) AS snippet,
                t.creator,
                t.tags,
                bm25(transcripts_fts) AS score
            FROM transcripts_fts AS f
            JOIN transcripts AS t ON t.rowid = f.rowid
            WHERE transcripts_fts MATCH ?
            ORDER BY score
            LIMIT ?
            """,
            (query, limit),
        ).fetchall()

    return [
        {
            "url": row["url"],
            "snippet": row["snippet"],
            "creator": row["creator"],
            "tags": json.loads(row["tags"] or "[]"),
            "score": float(row["score"]),
        }
        for row in rows
    ]
