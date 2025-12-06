@echo off
echo ================================================
echo    Ichigo Chatbot - Setup Script
echo ================================================
echo.

echo [1/4] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [2/4] Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed successfully!
echo.

echo [3/4] Setting up environment files...
if not exist ".env" (
    copy example.env .env
    echo Frontend .env created
) else (
    echo Frontend .env already exists, skipping...
)

if not exist "server\.env" (
    cd server
    copy .env.example .env
    cd ..
    echo Backend .env created
    echo.
    echo IMPORTANT: Please edit server\.env and add your credentials:
    echo   - GROQ_API_KEY
    echo   - PROMPT_PACAR
    echo   - PROMPT_BESTFRIEND
    echo.
) else (
    echo Backend .env already exists, skipping...
)
echo.

echo [4/4] Setup complete!
echo.
echo ================================================
echo    Next Steps:
echo ================================================
echo 1. Edit server\.env and add your API key and prompts
echo    Get API key from: https://console.groq.com/keys
echo.
echo 2. Run the application:
echo    - Double click 'start.bat' to run both servers
echo    - Or manually:
echo      Terminal 1: cd server ^&^& npm start
echo      Terminal 2: npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo ================================================
echo.
pause
