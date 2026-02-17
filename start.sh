#!/bin/bash

trap 'kill 0; exit' SIGINT SIGTERM

echo "Starting MeowMeowPay..."

# Backend
(cd backend && source .venv/bin/activate && python3 -m uvicorn app.main:app --reload) &

# Frontend
(cd frontend && npm run dev) &

wait
