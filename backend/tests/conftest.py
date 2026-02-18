import os
import uuid

# Set test environment variables BEFORE importing app modules,
# so Settings() and database.py pick up test values at import time.
os.environ.update({
    "DATABASE_URL": "sqlite:///",
    "GOOGLE_CLIENT_ID": "test-client-id",
    "GOOGLE_CLIENT_SECRET": "test-client-secret",
    "JWT_SECRET": "test-jwt-secret-key",
    "FRONTEND_URL": "http://localhost:5173",
})

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from starlette.testclient import TestClient

from app.auth import create_access_token
from app.database import Base, get_db
from app.main import app
from app.models import User


engine = create_engine(
    "sqlite:///",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine)


@pytest.fixture(autouse=True)
def setup_database():
    """Create all tables before each test, drop after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session():
    """Provide a transactional DB session for each test."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session):
    """FastAPI TestClient with DB dependency overridden."""

    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def mock_user(db_session):
    """Pre-create a Google-authenticated user in the test DB."""
    user = User(
        id=uuid.uuid4(),
        google_id="google-123",
        email="test@example.com",
        name="Test User",
        avatar_url="https://example.com/avatar.png",
        auth_provider="google",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def auth_cookie(mock_user):
    """Return a cookie dict with a valid JWT for mock_user."""
    token = create_access_token(str(mock_user.id))
    return {"access_token": token}
