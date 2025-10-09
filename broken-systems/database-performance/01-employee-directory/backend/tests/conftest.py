"""
pytest configuration and fixtures for integration tests.
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import get_db


@pytest.fixture(scope="session")
def test_db_url():
    """
    Provides the test database connection URL.
    When running in Docker, uses Docker network hostname.
    When running locally, uses localhost.
    """
    # Use environment variable if set (Docker), otherwise localhost (local venv)
    db_host = os.getenv("TEST_DB_HOST", "localhost")
    db_port = os.getenv("TEST_DB_PORT", "5433")
    return f"postgresql+psycopg://test_user:test_password@{db_host}:{db_port}/test_employee_directory"


@pytest.fixture(scope="session")
def test_db_engine(test_db_url):
    """
    Creates a SQLAlchemy engine for the test database.
    """
    engine = create_engine(test_db_url, echo=False)
    return engine


@pytest.fixture(scope="session")
def test_db_session(test_db_engine):
    """
    Creates a session factory for the test database.
    """
    TestSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_db_engine
    )
    return TestSessionLocal


@pytest.fixture(scope="session")
def client(test_db_session):
    """
    Creates a FastAPI TestClient with test database dependency override.
    """

    def override_get_db():
        db = test_db_session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
