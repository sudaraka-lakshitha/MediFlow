@echo off
setlocal EnableExtensions
title MediFlow LAN Launcher
color 0A

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "LAN_IP=not-detected"

echo.
echo  ================================================
echo          MediFlow - Pharmacy System
echo          Local app + configured database
echo  ================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Node.js is not installed or is not in PATH.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] npm is not available in PATH.
    pause
    exit /b 1
)

if not exist "%BACKEND%\.env" (
    color 0C
    echo  [ERROR] backend\.env was not found.
    echo  Create it from backend\.env.example and configure the Aiven connection.
    pause
    exit /b 1
)

if not exist "%FRONTEND%\.env" (
    >"%FRONTEND%\.env" echo VITE_API_URL=/api
)

findstr /C:"VITE_API_URL=/api" "%FRONTEND%\.env" >nul
if errorlevel 1 (
    color 0C
    echo  [ERROR] Set VITE_API_URL=/api in frontend\.env for LAN access.
    pause
    exit /b 1
)

echo  [1/3] Using the database configured in backend\.env. XAMPP is not required.
echo.

netstat -ano | findstr /R /C:":5000 .*LISTENING" >nul
if errorlevel 1 (
    echo  [2/3] Starting MediFlow API on localhost:5000 ...
    start "MediFlow API" cmd /k "cd /d ""%BACKEND%"" && npm run dev"
) else (
    echo  [2/3] MediFlow API is already running on port 5000.
)

timeout /t 2 /nobreak >nul

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if errorlevel 1 (
    echo  [3/3] Starting the website for this Wi-Fi network ...
    start "MediFlow Frontend LAN" cmd /k "cd /d ""%FRONTEND%"" && npm run dev:lan"
) else (
    echo  [3/3] Frontend is already running on port 5173.
)

for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /I /C:"IPv4 Address"') do (
    for /f "tokens=*" %%B in ("%%A") do set "LAN_IP=%%B"
)

timeout /t 3 /nobreak >nul
if /I not "%~1"=="--no-browser" start "" "http://localhost:5173"

echo.
echo  ================================================
echo   MediFlow is running
echo   This computer: http://localhost:5173
echo   Same Wi-Fi   : http://%LAN_IP%:5173
echo   API          : http://localhost:5000/ready
echo   Database     : backend\.env connection
echo  ================================================
echo.
echo  Keep both server windows open while using MediFlow.
echo  If another device cannot connect, allow Node.js/port 5173
echo  on the Windows Firewall Private network only.
echo.
pause
endlocal
