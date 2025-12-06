@echo off
echo ================================================
echo    Starting Ichigo Chatbot
echo ================================================
echo.
echo Starting Backend Server...
echo.

start "Ichigo Backend" cmd /k "cd server && npm start"
timeout /t 3 /nobreak > nul

echo Starting Frontend...
echo.
start "Ichigo Frontend" cmd /k "npm run dev"

echo.
echo ================================================
echo Both servers are starting in separate windows!
echo ================================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo To stop servers: Close both terminal windows
echo ================================================
echo.
