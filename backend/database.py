"""SQLite configuration and session management for the backend.

This module provides the necessary database initialization, connection
management, and lightweight migration utilities for the Nexa backend.
"""
import os
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Determine the directory for user data, defaulting to the current module directory
user_data_dir = os.environ.get("NEXA_USER_DATA_DIR", os.path.dirname(os.path.abspath(__file__)))
os.makedirs(user_data_dir, exist_ok=True)
db_path = os.path.join(user_data_dir, "nexa.db")

# Initialize the SQLAlchemy engine with SQLite
engine = create_engine(
    f"sqlite:///{db_path}",
    connect_args={"check_same_thread": False}
)

# Factory for generating new database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db() -> None:
    """Create tables if they do not exist.
    
    This function uses SQLAlchemy's metadata utility to safely create
    all defined models in the database without overwriting existing data.
    """
    Base.metadata.create_all(bind=engine)

def get_db():
    """Yield a request-scoped SQLAlchemy session.
    
    This generator manages the lifecycle of a database session,
    ensuring it is safely closed after the request completes.
    
    Yields:
        Session: A newly created SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def migrate_db() -> None:
    """Apply lightweight migrations for local SQLite installs.
    
    Connects directly to the SQLite database to perform necessary schema
    modifications, such as adding missing columns for new features.
    """
    # Open a direct connection to the SQLite database file
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Retrieve the schema of the 'messages' table
    cursor.execute("PRAGMA table_info(messages)")
    columns = [row[1] for row in cursor.fetchall()]
    
    # Check if the 'image_base64' column exists, and add it if missing
    if "image_base64" not in columns:
        cursor.execute("ALTER TABLE messages ADD COLUMN image_base64 TEXT")
        conn.commit()
        print("[DB] Migrated: added image_base64 column to messages table")
        
    conn.close()