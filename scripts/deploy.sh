#!/bin/bash

echo "Deploying Cipher Protocol..."

cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ../dashboard
pnpm install
pnpm build
pnpm start &
FRONTEND_PID=$!

echo "Backend running on http://localhost:8000"
echo "Frontend running on http://localhost:3000"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
