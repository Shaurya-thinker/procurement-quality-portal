@echo off
echo Starting Procurement Quality Portal - Full Stack...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m app.main"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause