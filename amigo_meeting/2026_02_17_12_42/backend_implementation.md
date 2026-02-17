# Backend Authentication Implementation

> **Date**: 2026-02-17
> **Based on**: 3 Amigos Meeting — 登入與註冊功能 (`amigo_meeting/2026_02_17_12_42.md`)
> **Stack**: FastAPI + PostgreSQL 17 + SQLAlchemy + JWT HttpOnly Cookie + Google OAuth 2.0

---

## Implementation Plan

### Context

MeowMeowPay 後端在此之前只有 `GET /api/health` 一個端點。根據 3 Amigos 會議紀錄，需要實作完整的 Google OAuth 登入/註冊系統。技術選型為 PostgreSQL 17 (Homebrew) + SQLAlchemy (sync) + JWT HttpOnly Cookie。

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| 同步 SQLAlchemy（非 async） | 簡單直接，DB 查詢不是瓶頸 |
| `psycopg[binary]` 而非 `psycopg2-binary` | Python 3.14 尚無 psycopg2-binary wheel |
| Cookie `secure=False` for dev | Config 控制，生產環境設 `True` |
| Alembic 管理 schema migration | 不使用 `Base.metadata.create_all()`，確保遷移可追蹤 |
| `get_current_user` 從 `request.cookies` 讀取 | 不用 `OAuth2PasswordBearer`（那是 header-based） |
| JWT 過期時間 24 小時 | 支付應用安全考量，比會議建議的 7 天更保守 |

---

## Phase 0: Infrastructure Setup

### 1. 安裝 PostgreSQL 17

```bash
brew install postgresql@17
brew services start postgresql@17
```

PostgreSQL 17 為 keg-only（未 symlink 到 `/opt/homebrew`），binary 在 `/opt/homebrew/opt/postgresql@17/bin/`。

### 2. 建立資料庫

```bash
/opt/homebrew/opt/postgresql@17/bin/createdb meowmeowpay
```

### 3. 更新 dependencies

`backend/requirements.txt` 新增：

```
sqlalchemy
psycopg[binary]
python-jose[cryptography]
httpx
python-dotenv
alembic
pydantic-settings
```

安裝：`.venv/bin/pip install -r requirements.txt`

**注意**：Python 3.14 + `psycopg[binary]` 成功安裝（psycopg 3.3.2 有 cp314 wheel）。

### 4. 建立 `.env`

```env
DATABASE_URL=postgresql+psycopg://localhost/meowmeowpay
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=change-me-to-a-random-secret-key
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false
```

`.env` 已在 `.gitignore` 中，不會被提交。

---

## Phase 1: New Files

按照依賴順序建立以下檔案：

### 1. `app/config.py` — Settings

使用 `pydantic-settings` 讀取 `.env`，集中管理所有設定值：

- Google OAuth URLs（auth、token、userinfo）
- JWT 設定（algorithm: HS256、expire: 24h）
- Cookie 設定（name: `access_token`、max_age: 86400s）
- `google_redirect_uri` property → `http://localhost:8000/api/auth/google/callback`

### 2. `app/database.py` — Database Layer

- `create_engine(settings.DATABASE_URL)` — 使用 psycopg driver
- `SessionLocal = sessionmaker(bind=engine)`
- `Base` — SQLAlchemy `DeclarativeBase`
- `get_db()` — FastAPI dependency，yield session + finally close

### 3. `app/models.py` — User Model

```
users table:
├── id          UUID PK (default: uuid4)
├── google_id   VARCHAR UNIQUE, indexed
├── email       VARCHAR UNIQUE
├── name        VARCHAR
├── avatar_url  VARCHAR nullable
├── created_at  TIMESTAMP WITH TZ (default: utcnow)
└── updated_at  TIMESTAMP WITH TZ (default: utcnow, onupdate: utcnow)
```

使用 SQLAlchemy 2.0 `Mapped` + `mapped_column` 風格。

### 4. `app/schemas.py` — Pydantic Response Model

`UserResponse`: id (UUID), email, name, avatar_url — 搭配 `from_attributes=True` 直接從 ORM 物件序列化。

### 5. `app/auth.py` — JWT Utilities & Auth Dependency

- `create_access_token(user_id)` → 簽發 JWT（sub=user_id, exp=now+24h）
- `decode_access_token(token)` → 解碼驗證 JWT，回傳 user_id
- `get_current_user(request, db)` → FastAPI Depends：從 cookie 取 JWT → decode → 查 DB → 回傳 User

### 6. `app/routers/__init__.py` — 空檔案

### 7. `app/routers/auth.py` — Auth Router (4 endpoints)

| Endpoint | Method | Logic |
|----------|--------|-------|
| `/api/auth/google` | GET | 組裝 Google OAuth URL（含 client_id, redirect_uri, scope） → `RedirectResponse` 302 |
| `/api/auth/google/callback` | GET (async) | httpx POST 換 token → GET userinfo → 查找/建立 User → 簽 JWT → `set_cookie` → 302 redirect 至 FRONTEND_URL |
| `/api/auth/me` | GET | `Depends(get_current_user)` → 回傳 `UserResponse` |
| `/api/auth/logout` | POST | `delete_cookie` → `{"message": "Logged out"}` |

**callback 為 async** 因為使用 `httpx.AsyncClient` 呼叫 Google API。

---

## Phase 2: Modify Existing Files

### `app/main.py`

- `from app.routers.auth import router as auth_router`
- `app.include_router(auth_router)`
- CORS `allow_origins` 改用 `settings.FRONTEND_URL`（不再硬編碼）

---

## Phase 3: Alembic Migration

### 初始化 Alembic

```bash
cd backend
.venv/bin/alembic init alembic
```

### 修改 `alembic/env.py`

- Import `app.config.settings` 和 `app.database.Base`
- `import app.models` 確保 model 被註冊
- `config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)` 從 .env 讀取

### 建立並執行 migration

```bash
.venv/bin/alembic revision --autogenerate -m "create users table"
.venv/bin/alembic upgrade head
```

生成的 migration（revision `8e266ecb07b2`）：
- `create_table('users', ...)` — 7 個欄位
- `create_index('ix_users_google_id', 'users', ['google_id'], unique=True)`

### 驗證

```
meowmeowpay=# \d users
    欄位    |           型別           | 能否為 NULL
------------+--------------------------+-------------
 id         | uuid                     | not null
 google_id  | character varying        | not null
 email      | character varying        | not null
 name       | character varying        | not null
 avatar_url | character varying        |
 created_at | timestamp with time zone | not null
 updated_at | timestamp with time zone | not null
索引: users_pkey (PK), ix_users_google_id (UNIQUE), users_email_key (UNIQUE)
```

---

## Verification Results

啟動 server 後逐一測試所有端點：

| Test | Command | Result |
|------|---------|--------|
| Health check | `curl localhost:8000/api/health` | ✅ 200 `{"status":"ok","message":"MeowMeowPay API is running 🐱"}` |
| Google redirect | `curl -v localhost:8000/api/auth/google` | ✅ 307 → `https://accounts.google.com/o/oauth2/v2/auth?...` |
| Auth me (no cookie) | `curl localhost:8000/api/auth/me` | ✅ 401 `{"detail":"Not authenticated"}` |
| Logout | `curl -X POST localhost:8000/api/auth/logout` | ✅ 200 `{"message":"Logged out"}` |

---

## File Structure After Implementation

```
backend/
├── .env                          # 環境變數（不提交）
├── requirements.txt              # 更新：+7 dependencies
├── alembic.ini                   # Alembic 設定
├── alembic/
│   ├── env.py                    # 讀取 app settings & Base
│   ├── script.py.mako
│   └── versions/
│       └── 8e266ecb07b2_create_users_table.py
└── app/
    ├── __init__.py
    ├── main.py                   # 更新：include auth_router
    ├── config.py                 # NEW: pydantic-settings
    ├── database.py               # NEW: SQLAlchemy engine + session
    ├── models.py                 # NEW: User model
    ├── schemas.py                # NEW: UserResponse
    ├── auth.py                   # NEW: JWT + get_current_user
    └── routers/
        ├── __init__.py           # NEW
        └── auth.py               # NEW: 4 auth endpoints
```

---

## Next Steps

1. **設定 Google Cloud Console OAuth Client** — 取得真正的 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`，設定 authorized redirect URI 為 `http://localhost:8000/api/auth/google/callback`
2. **前端串接** — 使用 `/frontend-engineer` skill 實作 `useAuth` composable、改造 LoginView、建立 UserMenu
3. **測試** — 使用 `/test-engineer` skill 撰寫 pytest 測試（mock Google API）

---

## Pitfalls & Notes

- **Python 3.14 + psycopg**: `psycopg[binary]` 3.3.2 有 cp314 wheel，可直接安裝。`psycopg2-binary` 目前無 Python 3.14 wheel。
- **CORS + Cookie**: 後端已有 `allow_credentials=True`，前端發 request 時需帶 `credentials: "include"`。
- **OAuth redirect**: Google callback 端點為 `GET /api/auth/google/callback`，需在 Google Cloud Console 的 authorized redirect URIs 中完全匹配。
- **PostgreSQL 17 path**: Homebrew keg-only，需用 `/opt/homebrew/opt/postgresql@17/bin/` prefix 或加入 PATH。
