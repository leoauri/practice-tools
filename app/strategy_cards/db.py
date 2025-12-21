"""Database operations for strategy cards tool."""

import os
import random
import time
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
    # Explicitly seed random with current time to work in FastCGI
    random.seed(time.time())

    with get_db_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        # Fetch all cards and select randomly in Python
        cursor.execute("""
            SELECT id, content
            FROM strategy_cards
        """)
        cards = cursor.fetchall()
        cursor.close()

        if cards:
            return random.choice(cards)
        return None


def add_card(content):
    """Add a new strategy card to the database."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO strategy_cards (content)
            VALUES (%s)
        """, (content,))
        conn.commit()
        card_id = cursor.lastrowid
        cursor.close()
        return card_id
