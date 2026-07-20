@echo off
setlocal EnableExtensions
title MediFlow Launcher
color 0A

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "XAMPP=C:\xampp"

echo.
echo  ================================================
echo          MediFlow - Pharmacy System
echo          Starting local development...
echo  ================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  [ERROR] Node.js is not installed or is not in PATH.
    echo  Download it from https://nodejs.org
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
    echo  Copy backend\.env.example to backend\.env and configure it first.
    pause
    exit /b 1
)

if not exist "%XAMPP%\mysql\bin\mysql.exe" (
    color 0C
    echo  [ERROR] XAMPP MySQL was not found at C:\xampp.
    echo  Install XAMPP in C:\xampp or update the XAMPP variable in this file.
    pause
    exit /b 1
)

netstat -ano | findstr /R /C:":3306 .*LISTENING" >nul
if errorlevel 1 (
    echo  [1/4] Starting XAMPP MySQL...
    start "XAMPP MySQL" /min "%XAMPP%\mysql_start.bat"
    timeout /t 5 /nobreak >nul
    netstat -ano | findstr /R /C:":3306 .*LISTENING" >nul
    if errorlevel 1 (
        color 0C
        echo  [ERROR] XAMPP MySQL did not start on port 3306.
        echo  Open the XAMPP Control Panel, start MySQL, and retry.
        pause
        exit /b 1
    )
) else (
    echo  [1/4] XAMPP MySQL is already running.
)

netstat -ano | findstr /R /C:":5000 .*LISTENING" >nul
if errorlevel 1 (
    echo  [2/4] Starting API at http://localhost:5000 ...
    start "MediFlow API" cmd /k "cd /d ""%BACKEND%"" && npm run dev"
) else (
    echo  [2/4] API is already running on port 5000.
)

timeout /t 2 /nobreak >nul

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if errorlevel 1 (
    echo  [3/4] Starting frontend at http://localhost:5173 ...
    start "MediFlow Frontend" cmd /k "cd /d ""%ROOT%"" && npm run dev:web"
) else (
    echo  [3/4] Frontend is already running on port 5173.
)

timeout /t 3 /nobreak >nul

if /I not "%~1"=="--no-browser" (
    echo  [4/4] Opening MediFlow in the browser...
    start "" "http://localhost:5173"
) else (
    echo  [4/4] Browser opening skipped for verification.
)

echo.
echo  ================================================
echo   MediFlow is running
echo   Web app : http://localhost:5173
echo   API     : http://localhost:5000/health
echo   Swagger : http://localhost:5000/docs
echo   Database: XAMPP MySQL on localhost:3306
echo  ================================================
echo.
pause
endlocal
