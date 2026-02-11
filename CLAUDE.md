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
- Currently only has `GET /api/health` endpoint
- Python venv in `backend/.venv/`

## Conventions

- Vue components use `<script setup>` composition API exclusively
- CSS values come from design tokens defined in `style.css` — follow this pattern
- HTML lang is `zh-Hant` (Traditional Chinese target audience)
- Deployment target: Zeabur (meowmeowpay-frontend.zeabur.app)

## Agent Skills

The `.claude/skills/` directory contains role-based agent prompts (frontend-engineer, backend-engineer, test-engineer, three-amigos) that are auto-synced to `.agents/skills/` via a macOS LaunchAgent using fswatch.
