@echo off
setlocal

set "ADMIN_DIR=%~dp0"
set "ADMIN_URL=http://127.0.0.1:5174"
if not "%ADMIN_PANEL_PORT%"=="" set "ADMIN_URL=http://127.0.0.1:%ADMIN_PANEL_PORT%"

cd /d "%ADMIN_DIR%" || (
  echo Failed to enter admin folder.
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install Node.js 18 or newer.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm not found. Install npm.
  exit /b 1
)

if "%~1"=="--check" (
  echo Admin launcher check passed.
  exit /b 0
)

if not exist "node_modules\" (
  echo Installing admin dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    exit /b 1
  )
)

if not exist ".env" (
  echo Warning: admin\.env not found. Copy .env.example and set required values before writes work.
)

echo Starting admin panel on 127.0.0.1:5174...
start "Admin Panel" cmd /k "cd /d ""%ADMIN_DIR%"" && npm run admin"

timeout /t 2 /nobreak >nul
start "" "%ADMIN_URL%"

echo Admin panel launching at %ADMIN_URL%
endlocal
exit
exit