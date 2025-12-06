#!/bin/bash

echo "================================================"
echo "   Ichigo Chatbot - Setup Script"
echo "================================================"
echo ""

echo "[1/4] Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi
echo "Frontend dependencies installed successfully!"
echo ""

echo "[2/4] Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    cd ..
    exit 1
fi
cd ..
echo "Backend dependencies installed successfully!"
echo ""

echo "[3/4] Setting up environment files..."
if [ ! -f ".env" ]; then
    cp example.env .env
    echo "Frontend .env created"
else
    echo "Frontend .env already exists, skipping..."
fi

if [ ! -f "server/.env" ]; then
    cd server
    cp .env.example .env
    cd ..
    echo "Backend .env created"
    echo ""
    echo "IMPORTANT: Please edit server/.env and add your credentials:"
    echo "  - GROQ_API_KEY"
    echo "  - PROMPT_PACAR"
    echo "  - PROMPT_BESTFRIEND"
    echo ""
else
    echo "Backend .env already exists, skipping..."
fi
echo ""

echo "[4/4] Setup complete!"
echo ""
echo "================================================"
echo "   Next Steps:"
echo "================================================"
echo "1. Edit server/.env and add your API key and prompts"
echo "   Get API key from: https://console.groq.com/keys"
echo ""
echo "2. Run the application:"
echo "   - Run: ./start.sh"
echo "   - Or manually:"
echo "     Terminal 1: cd server && npm start"
echo "     Terminal 2: npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo "================================================"
echo ""
