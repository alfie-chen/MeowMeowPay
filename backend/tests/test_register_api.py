"""Integration tests for POST /api/auth/register (BE-6, BE-7)."""

import pytest

from app.auth import verify_password
from app.models import User


VALID_PAYLOAD = {
    "name": "貓咪用戶",
    "email": "meow@example.com",
    "password": "Secure123",
}


class TestRegisterSuccess:
    def test_returns_201_with_user(self, client):
        resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == VALID_PAYLOAD["email"]
        assert data["name"] == VALID_PAYLOAD["name"]
        assert "id" in data
        assert "password_hash" not in data  # never leak hash

    def test_sets_jwt_cookie(self, client):
        resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
        assert resp.status_code == 201
        assert "access_token" in resp.cookies

    def test_password_is_hashed_in_db(self, client, db_session):
        resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
        assert resp.status_code == 201

        user = db_session.query(User).filter(User.email == VALID_PAYLOAD["email"]).first()
        assert user is not None
        assert user.password_hash != VALID_PAYLOAD["password"]  # not stored in plaintext
        assert verify_password(VALID_PAYLOAD["password"], user.password_hash)

    def test_auth_provider_is_email(self, client, db_session):
        client.post("/api/auth/register", json=VALID_PAYLOAD)
        user = db_session.query(User).filter(User.email == VALID_PAYLOAD["email"]).first()
        assert user.auth_provider == "email"

    def test_google_id_is_null(self, client, db_session):
        client.post("/api/auth/register", json=VALID_PAYLOAD)
        user = db_session.query(User).filter(User.email == VALID_PAYLOAD["email"]).first()
        assert user.google_id is None

    def test_email_stored_lowercase(self, client, db_session):
        payload = {**VALID_PAYLOAD, "email": "Meow@Example.COM"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 201
        user = db_session.query(User).filter(User.email == "meow@example.com").first()
        assert user is not None

    def test_name_is_trimmed(self, client, db_session):
        payload = {**VALID_PAYLOAD, "name": "  貓咪用戶  "}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "貓咪用戶"

    def test_registered_user_can_access_me(self, client):
        resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
        assert resp.status_code == 201
        cookie = {"access_token": resp.cookies["access_token"]}
        me_resp = client.get("/api/auth/me", cookies=cookie)
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == VALID_PAYLOAD["email"]


class TestRegisterDuplicateEmail:
    def test_409_on_duplicate_email_registration(self, client):
        client.post("/api/auth/register", json=VALID_PAYLOAD)
        resp = client.post("/api/auth/register", json=VALID_PAYLOAD)
        assert resp.status_code == 409
        assert resp.json()["detail"] == "Email already registered"

    def test_409_when_email_already_used_by_google_user(self, client, mock_user):
        """Google user with same email blocks email registration."""
        payload = {
            "name": "New User",
            "email": mock_user.email,
            "password": "Secure123",
        }
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 409
        assert resp.json()["detail"] == "Email already registered"

    def test_409_case_insensitive_email_conflict(self, client):
        """Email collision across different cases."""
        client.post("/api/auth/register", json=VALID_PAYLOAD)
        payload = {**VALID_PAYLOAD, "email": "MEOW@EXAMPLE.COM"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 409


class TestRegisterValidation:
    def test_422_password_too_short(self, client):
        payload = {**VALID_PAYLOAD, "password": "short7"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422

    def test_422_password_exactly_7_chars(self, client):
        payload = {**VALID_PAYLOAD, "password": "1234567"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422

    def test_200_password_exactly_8_chars(self, client):
        """Boundary value: 8 characters should pass."""
        payload = {**VALID_PAYLOAD, "password": "Exact8Ch"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 201

    def test_422_missing_name(self, client):
        payload = {"email": VALID_PAYLOAD["email"], "password": VALID_PAYLOAD["password"]}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422

    def test_422_empty_name(self, client):
        payload = {**VALID_PAYLOAD, "name": ""}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422

    def test_422_invalid_email_format(self, client):
        payload = {**VALID_PAYLOAD, "email": "not-an-email"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422

    def test_422_missing_email(self, client):
        payload = {"name": VALID_PAYLOAD["name"], "password": VALID_PAYLOAD["password"]}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422

    def test_422_missing_password(self, client):
        payload = {"name": VALID_PAYLOAD["name"], "email": VALID_PAYLOAD["email"]}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 422


class TestMigrationDataIntegrity:
    """BE-7: Verify existing Google users are unaffected by schema changes.

    In tests, Base.metadata.create_all() creates the schema in its current
    (post-migration) state. We seed Google users and assert their data is intact,
    which validates the model and migration logic are consistent.
    """

    def test_existing_google_user_retains_google_id(self, mock_user, db_session):
        user = db_session.query(User).filter(User.google_id == "google-123").first()
        assert user is not None
        assert user.google_id == "google-123"

    def test_existing_google_user_has_correct_auth_provider(self, mock_user, db_session):
        user = db_session.query(User).filter(User.google_id == "google-123").first()
        assert user.auth_provider == "google"

    def test_existing_google_user_has_null_password_hash(self, mock_user, db_session):
        user = db_session.query(User).filter(User.google_id == "google-123").first()
        assert user.password_hash is None

    def test_google_user_and_email_user_coexist(self, client, mock_user, db_session):
        """Both auth methods can coexist without conflict."""
        payload = {**VALID_PAYLOAD, "email": "different@example.com"}
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 201

        google_user = db_session.query(User).filter(User.google_id == "google-123").first()
        email_user = db_session.query(User).filter(User.email == "different@example.com").first()

        assert google_user is not None
        assert email_user is not None
        assert google_user.auth_provider == "google"
        assert email_user.auth_provider == "email"
