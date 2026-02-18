from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, hash_password
from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas import RegisterRequest, UserResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/google")
def google_login():
    params = urlencode({
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    })
    return RedirectResponse(url=f"{settings.GOOGLE_AUTH_URL}?{params}")


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    # Exchange code for token
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            settings.GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_resp.json()
        access_token = token_data["access_token"]

        # Get user info
        userinfo_resp = await client.get(
            settings.GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        userinfo = userinfo_resp.json()

    # Find or create user
    user = db.query(User).filter(User.google_id == userinfo["id"]).first()
    if not user:
        user = User(
            google_id=userinfo["id"],
            email=userinfo["email"],
            name=userinfo.get("name", ""),
            avatar_url=userinfo.get("picture"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.name = userinfo.get("name", user.name)
        user.avatar_url = userinfo.get("picture", user.avatar_url)
        db.commit()

    # Create JWT and set cookie
    jwt_token = create_access_token(str(user.id))
    response = RedirectResponse(url=settings.FRONTEND_URL, status_code=302)
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=jwt_token,
        max_age=settings.COOKIE_MAX_AGE,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
    )
    return response


@router.post("/register", response_model=UserResponse, status_code=201)
def register(body: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    # Normalize email to lowercase to prevent case-variant duplicates
    email = body.email.lower()

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=email,
        name=body.name.strip(),
        password_hash=hash_password(body.password),
        auth_provider="email",
        avatar_url=None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    jwt_token = create_access_token(str(user.id))
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=jwt_token,
        max_age=settings.COOKIE_MAX_AGE,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
    )
    return user


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=settings.COOKIE_NAME)
    return {"message": "Logged out"}
