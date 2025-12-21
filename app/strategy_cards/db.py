"""Database operations for strategy cards tool."""

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


def get_random_card():
    """Fetch a random strategy card from the database."""
    with get_db_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, content
            FROM strategy_cards
            ORDER BY RAND()
            LIMIT 1
        """)
        card = cursor.fetchone()
        cursor.close()
        return card
