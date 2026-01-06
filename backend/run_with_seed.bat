@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Backend Setup ^& Seed Script
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    pause
    exit /b 1
)

echo [OK] Python found
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
cd ..
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed
echo.

REM Navigate to backend
cd backend

REM Run migrations (optional)
echo [INFO] Running database migrations...
alembic upgrade head >nul 2>&1
if errorlevel 1 (
    echo [WARN] Migrations not available, skipping...
)

REM Seed database
echo [INFO] Seeding database with sample data...
python seed_data.py
if errorlevel 1 (
    echo [ERROR] Failed to seed database
    pause
    exit /b 1
)

echo [OK] Database seeded
echo.

REM Start the server
echo [INFO] Starting backend server on http://localhost:8000
echo.
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
