"""Integration tests for auth API endpoints and health check."""

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch, MagicMock

from jose import jwt
import pytest

from app.config import settings


class TestHealthCheck:
    def test_returns_ok(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"


class TestGoogleLogin:
    def test_redirects_to_google(self, client):
        resp = client.get("/api/auth/google", follow_redirects=False)
        assert resp.status_code == 307
        location = resp.headers["location"]
        assert "accounts.google.com" in location
        assert settings.GOOGLE_CLIENT_ID in location


class TestGoogleCallback:
    MOCK_USERINFO = {
        "id": "google-new-user",
        "email": "newuser@example.com",
        "name": "New User",
        "picture": "https://example.com/new-avatar.png",
    }

    def _mock_httpx_client(self, userinfo=None):
        """Build a mock for httpx.AsyncClient context manager."""
        userinfo = userinfo or self.MOCK_USERINFO

        mock_token_resp = MagicMock()
        mock_token_resp.json.return_value = {"access_token": "mock_google_token"}

        mock_userinfo_resp = MagicMock()
        mock_userinfo_resp.json.return_value = userinfo

        mock_client = AsyncMock()
        mock_client.post.return_value = mock_token_resp
        mock_client.get.return_value = mock_userinfo_resp

        mock_cm = AsyncMock()
        mock_cm.__aenter__.return_value = mock_client
        mock_cm.__aexit__.return_value = None
        return mock_cm

    @patch("app.routers.auth.httpx.AsyncClient")
    def test_creates_new_user(self, mock_async_client, client, db_session):
        mock_async_client.return_value = self._mock_httpx_client()
        resp = client.get(
            "/api/auth/google/callback",
            params={"code": "mock-auth-code"},
            follow_redirects=False,
        )
        assert resp.status_code == 302
        assert "access_token" in resp.cookies

        from app.models import User
        user = db_session.query(User).filter(User.google_id == "google-new-user").first()
        assert user is not None
        assert user.email == "newuser@example.com"
        assert user.name == "New User"

    @patch("app.routers.auth.httpx.AsyncClient")
    def test_updates_existing_user(self, mock_async_client, client, mock_user, db_session):
        updated_info = {
            "id": mock_user.google_id,
            "email": mock_user.email,
            "name": "Updated Name",
            "picture": "https://example.com/updated-avatar.png",
        }
        mock_async_client.return_value = self._mock_httpx_client(userinfo=updated_info)
        resp = client.get(
            "/api/auth/google/callback",
            params={"code": "mock-auth-code"},
            follow_redirects=False,
        )
        assert resp.status_code == 302

        db_session.refresh(mock_user)
        assert mock_user.name == "Updated Name"
        assert mock_user.avatar_url == "https://example.com/updated-avatar.png"


class TestGetMe:
    def test_authenticated(self, client, mock_user, auth_cookie):
        resp = client.get("/api/auth/me", cookies=auth_cookie)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == mock_user.email
        assert data["name"] == mock_user.name

    def test_no_cookie(self, client):
        resp = client.get("/api/auth/me")
        assert resp.status_code == 401

    def test_invalid_token(self, client):
        resp = client.get("/api/auth/me", cookies={"access_token": "garbage"})
        assert resp.status_code == 401

    def test_expired_token(self, client, mock_user):
        payload = {
            "sub": str(mock_user.id),
            "exp": datetime.now(timezone.utc) - timedelta(hours=1),
        }
        expired_token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        resp = client.get("/api/auth/me", cookies={"access_token": expired_token})
        assert resp.status_code == 401


class TestLogout:
    def test_clears_cookie(self, client):
        resp = client.post("/api/auth/logout")
        assert resp.status_code == 200
        assert resp.json()["message"] == "Logged out"
        # Cookie should be set with max-age=0 to delete it
        set_cookie = resp.headers.get("set-cookie", "")
        assert "access_token" in set_cookie
