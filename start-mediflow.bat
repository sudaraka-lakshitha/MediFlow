@echo off
title MediFlow Launcher
color 0A

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║         MediFlow - Pharmacy System           ║
echo  ║         Starting local development...        ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Download it from: https://nodejs.org
    pause
    exit /b 1
)

:: Check if psql is available (optional warning)
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo  [WARNING] psql not found in PATH. Make sure PostgreSQL is running.
    echo.
)

:: Set project root (folder where this .bat file lives)
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

:: Check .env exists
if not exist "%BACKEND%\.env" (
    color 0C
    echo  [ERROR] backend\.env not found.
    echo  Copy backend\.env.example to backend\.env and fill in your DATABASE_URL and JWT_SECRET.
    pause
    exit /b 1
)

echo  [1/3] Starting API server on http://localhost:5000 ...
start "MediFlow API" cmd /k "cd /d "%BACKEND%" && npm run dev && pause"

:: Wait 3 seconds for API to warm up
timeout /t 3 /nobreak >nul

echo  [2/3] Starting frontend on http://localhost:5173 ...
start "MediFlow Frontend" cmd /k "cd /d "%ROOT%" && npm run dev:web && pause"

:: Wait 4 seconds for Vite to compile
timeout /t 4 /nobreak >nul

echo  [3/3] Opening browser...
start "" "http://localhost:5173"

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   MediFlow is running!                       ║
echo  ║                                              ║
echo  ║   Web app  :  http://localhost:5173          ║
echo  ║   API       :  http://localhost:5000/health  ║
echo  ║   Swagger   :  http://localhost:5000/docs    ║
echo  ║                                              ║
echo  ║   Admin     :  pharmacy.mediflow+admin@      ║
echo  ║   Password  :  Demo123!                      ║
echo  ║                                              ║
echo  ║   Close the two server windows to stop.      ║
echo  ╚══════════════════════════════════════════════╝
echo.
pause
