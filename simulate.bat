@echo off
chcp 65001 >nul
title Mirai Atelier - Simulazione offline
cd /d "%~dp0"

echo.
echo  MIRAI ATELIER - Simulazione offline
echo  ====================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRORE] Node.js non trovato. Installalo da https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo → Installazione dipendenze...
  call npm install
  if errorlevel 1 (
    echo [ERRORE] npm install fallito
    pause
    exit /b 1
  )
)

if "%~1"=="dev" (
  call npm run simulate:dev
) else (
  call npm run simulate
)

pause
