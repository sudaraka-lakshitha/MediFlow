@echo off
setlocal
title MediFlow First-Time Setup

set "ROOT=%~dp0"
set "SETUP_SCRIPT=%ROOT%scripts\setup-local.ps1"

if not exist "%SETUP_SCRIPT%" (
    echo [ERROR] Setup script was not found: "%SETUP_SCRIPT%"
    pause
    exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%SETUP_SCRIPT%"
if errorlevel 1 (
    echo.
    echo MediFlow setup stopped. Read the message above, fix the listed issue, then run this file again.
    pause
    exit /b 1
)

endlocal
