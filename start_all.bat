@echo off
echo Starting Procurement Quality Portal...
echo.

REM Start Backend in a new terminal window
echo Starting Backend Server on http://localhost:8000...
start "Backend Server" cmd /k "cd backend && python -m app.main"

REM Wait a few seconds for backend to start
timeout /t 3 /nobreak

REM Start Frontend in a new terminal window
echo Starting Frontend Server on http://localhost:5173...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting in separate windows...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause
