# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MeowMeowPay is a payment application (early development stage) with a Vue 3 frontend and FastAPI backend. The frontend has a polished landing page; authentication and payment features are not yet implemented.

## Development Commands

### Frontend (from `frontend/` directory)
```bash
npm run dev        # Vite dev server on localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

### Backend (from `backend/` directory)
```bash
python3 -m uvicorn app.main:app --reload   # Dev server on localhost:8000
```

FastAPI auto-generated docs available at `localhost:8000/docs`.

## Tech Stack

| 層級 | 技術 | 用途 |
|------|------|------|
| Frontend | Vue 3 + Vite + Vue Router | SPA 框架與建置工具 |
| Frontend 測試 | Vitest + @vue/test-utils + jsdom | 單元/元件測試 |
| Backend | FastAPI + Uvicorn | API 伺服器 |
| Backend 測試 | Pytest + httpx | 尚未安裝，需加入 requirements.txt |
| E2E 測試 | Playwright | 尚未安裝，待完整流程建立後加入 |
| 資料庫 | PostgreSQL | 主資料庫 |
| ORM | SQLAlchemy + Alembic | 資料庫操作與 migration |
| 認證 | python-jose (JWT) + httpx (Google OAuth) | Token 與第三方登入 |
| 配置管理 | pydantic-settings + python-dotenv | 環境變數與設定 |

## Architecture

### Frontend (`frontend/`)
- **Vue 3** with `<script setup>` syntax, **Vite** build tool, **Vue Router**
- No TypeScript — plain JavaScript
- `src/style.css` — design system with CSS custom properties (HSL colors, 8-point spacing scale, radius/shadow/transition tokens, dark mode default with light mode via `prefers-color-scheme`)
- `src/router/index.js` — routes: `/` (home), `/login`
- `src/components/` — reusable components (AppHeader, LoginButton)
- `src/views/` — page-level components (HomeView, LoginView)
- All styling uses scoped `<style scoped>` and references design tokens from `style.css` — no magic numbers

### Backend (`backend/`)
- **FastAPI** with Uvicorn, CORS configured for `localhost:5173`
- Single entry point: `app/main.py`
- Currently only has `GET /api/health` endpoint plus auth router
- Python venv in `backend/.venv/`
- Key modules: `config.py`, `database.py`, `models.py`, `schemas.py`, `auth.py`, `routers/auth.py`

## QA 測試策略

| 層級 | 工具 | 範圍 | 狀態 |
|------|------|------|------|
| Frontend 單元測試 | Vitest + @vue/test-utils | 元件邏輯、composables | 已有 4 個測試檔 |
| Backend 單元/API 測試 | Pytest + httpx | FastAPI endpoints、auth 邏輯 | 尚未安裝 |
| API 手動/自動化測試 | Postman + Newman | API 手動探索與 CI 自動化執行 | 尚未建立 collection |
| E2E 測試 | Playwright | 使用者完整流程（登入、付款等） | 尚未安裝 |

### 測試指令
```bash
# Frontend（from frontend/）
npm run test       # Vitest watch mode
npm run test:run   # Vitest 單次執行

# Backend（from backend/）— 待安裝 pytest
# pytest             # 執行所有測試
# pytest -v          # 詳細輸出
```

## CI/CD 策略

- **CI**: GitHub Actions
- **CD**: Zeabur（Git push 自動部署）

### Pipeline 流程（PR / Push 觸發）
1. **Frontend** — `npm run build` 建置檢查 + `npm run test:run` Vitest 測試
2. **Backend** — `pytest` 單元/API 測試
3. **Newman** — 執行 Postman collection API 測試
4. **E2E**（後期）— Playwright 完整流程測試
5. 全部通過 → Zeabur 自動部署

### 實施優先順序
1. GitHub Actions 跑 Vitest（已有測試，可立即啟用）
2. 加入 Pytest 後端測試
3. Newman 執行 Postman collection
4. Playwright E2E

## Git 分支策略

- **main** — 穩定版本，對應 Zeabur 生產環境自動部署
- **dev** — 日常開發整合分支，功能完成後合併回 main
- **feature/xxx** — 從 dev 開出，完成後 PR 回 dev

### 工作流程
```
feature/xxx → PR → dev（CI 測試通過）→ PR → main → Zeabur 自動部署
```

## Conventions

- Vue components use `<script setup>` composition API exclusively
- CSS values come from design tokens defined in `style.css` — follow this pattern
- HTML lang is `zh-Hant` (Traditional Chinese target audience)
- Deployment target: Zeabur (meowmeowpay-frontend.zeabur.app)

## Agent Skills

The `.claude/skills/` directory contains role-based agent prompts (frontend-engineer, backend-engineer, test-engineer, three-amigos) that are auto-synced to `.agents/skills/` via a macOS LaunchAgent using fswatch.
