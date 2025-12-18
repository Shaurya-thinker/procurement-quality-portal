@echo off
echo Installing Procurement Quality Portal dependencies...
echo.

REM Install Backend dependencies
echo Installing Backend Python dependencies...
cd backend
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Install Frontend dependencies
echo Installing Frontend Node dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)
cd ..

echo.
echo All dependencies installed successfully!
echo You can now run the application.
