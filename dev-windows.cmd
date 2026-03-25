@echo off
REM Starts the API (port 6000) in a new window, then Vite (3000) here.
REM Fixes: [vite] http proxy error ... ECONNREFUSED 127.0.0.1:6000
cd /d "%~dp0"

if not exist "server\node_modules\" (
  echo Installing server dependencies...
  cd server && call npm install && cd ..
)
if not exist "client\node_modules\" (
  echo Installing client dependencies...
  cd client && call npm install && cd ..
)

echo Starting API in a new window (leave it open)...
start "AI Cost API (port 6000)" cmd /k "cd /d ""%~dp0server"" && npm start"

echo Waiting for API to listen...
timeout /t 4 /nobreak >nul

echo Starting Vite on http://localhost:3000 ...
cd /d "%~dp0client"
call npm run dev
