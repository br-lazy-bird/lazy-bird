"""
SQLAlchemy initialization
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL ir not set.")

engine = create_engine(url=DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    FastAPI dependency that provides a database session per request.
    Automatically handles session cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
