#!/bin/bash

# Start Backend and Frontend
echo "Starting Procurement Quality Portal..."
echo ""

# Kill any existing processes on ports 8000 and 5173
echo "Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

sleep 1

# Start Backend
echo "Starting Backend Server on http://localhost:8000..."
cd backend
python -m app.main &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

sleep 3

# Start Frontend
echo "Starting Frontend Server on http://localhost:5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✓ Both servers are running!"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
