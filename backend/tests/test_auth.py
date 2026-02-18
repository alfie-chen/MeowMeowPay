"""Unit tests for app/auth.py — JWT create/decode functions."""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
import pytest

from app.auth import create_access_token, decode_access_token
from app.config import settings


class TestCreateAccessToken:
    def test_returns_valid_jwt(self):
        token = create_access_token("user-123")
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        assert payload["sub"] == "user-123"
        assert "exp" in payload

    def test_token_expiry_is_in_future(self):
        token = create_access_token("user-123")
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        exp = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        assert exp > datetime.now(timezone.utc)


class TestDecodeAccessToken:
    def test_valid_token(self):
        token = create_access_token("user-456")
        user_id = decode_access_token(token)
        assert user_id == "user-456"

    def test_expired_token(self):
        payload = {
            "sub": "user-456",
            "exp": datetime.now(timezone.utc) - timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        with pytest.raises(JWTError):
            decode_access_token(token)

    def test_invalid_token(self):
        with pytest.raises(JWTError):
            decode_access_token("not-a-real-token")

    def test_missing_sub_claim(self):
        payload = {
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        with pytest.raises(JWTError, match="Missing sub"):
            decode_access_token(token)
