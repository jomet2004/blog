@echo off
setlocal
title ZenPost Launcher

echo ==========================================
echo    ZenPost Platform Launcher
echo ==========================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Backend Setup
echo [1/2] Checking Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
start "Blog Backend" cmd /k "npm start"
cd ..

echo.

:: Frontend Setup
echo [2/2] Checking Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start "Blog Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ==========================================
echo  Servers are starting up!
echo  - API: http://localhost:5000
echo  - App: http://localhost:5173
echo ==========================================
echo.
echo Press any key to exit this launcher window.
pause >nul
