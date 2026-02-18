from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    JWT_SECRET: str
    FRONTEND_URL: str = "http://localhost:5173"
    COOKIE_SECURE: bool = False

    # Google OAuth URLs
    GOOGLE_AUTH_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v2/userinfo"

    # JWT settings
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24

    # Cookie settings
    COOKIE_NAME: str = "access_token"
    COOKIE_MAX_AGE: int = 86400  # 24 hours in seconds

    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"

    model_config = {"env_file": ".env"}


settings = Settings()
