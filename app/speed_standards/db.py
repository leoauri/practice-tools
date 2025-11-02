"""Database operations for speed standards tool."""

import os
import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager


def get_db_config():
    """Get database configuration from environment variables."""
    return {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD'),
        'database': os.getenv('DB_NAME'),
        'charset': 'utf8mb4',
        'collation': 'utf8mb4_unicode_ci'
    }


@contextmanager
def get_db_connection():
    """Context manager for database connections."""
    connection = None
    try:
        connection = mysql.connector.connect(**get_db_config())
        yield connection
    except Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if connection and connection.is_connected():
            connection.close()


def get_all_songs():
    """Fetch all songs from the database."""
    with get_db_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, achieved, target
            FROM speed_standards_songs
            ORDER BY title
        """)
        songs = cursor.fetchall()
        cursor.close()
        return songs


def update_song_progress(song_id, achieved, target):
    """Update a song's progress."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE speed_standards_songs
            SET achieved = %s, target = %s, updated_at = NOW()
            WHERE id = %s
        """, (achieved, target, song_id))
        conn.commit()
        cursor.close()
        return cursor.rowcount > 0


def add_song(title, achieved=0, target=0):
    """Add a new song to the repertoire."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO speed_standards_songs (title, achieved, target)
            VALUES (%s, %s, %s)
        """, (title, achieved, target))
        conn.commit()
        song_id = cursor.lastrowid
        cursor.close()
        return song_id
