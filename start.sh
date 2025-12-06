#!/bin/bash

echo "================================================"
echo "   Starting Ichigo Chatbot"
echo "================================================"
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
    echo "Starting with tmux (recommended)..."
    echo ""
    
    # Create a new tmux session
    tmux new-session -d -s ichigo-chatbot
    
    # Split window horizontally
    tmux split-window -h
    
    # Run backend in first pane
    tmux select-pane -t 0
    tmux send-keys "cd server && npm start" C-m
    
    # Run frontend in second pane
    tmux select-pane -t 1
    tmux send-keys "npm run dev" C-m
    
    # Attach to the session
    echo "================================================"
    echo "Both servers are running in tmux!"
    echo "================================================"
    echo ""
    echo "Backend:  http://localhost:3001"
    echo "Frontend: http://localhost:5173"
    echo ""
    echo "To detach: Press Ctrl+B then D"
    echo "To reattach: tmux attach -t ichigo-chatbot"
    echo "To stop: tmux kill-session -t ichigo-chatbot"
    echo "================================================"
    echo ""
    
    tmux attach-session -t ichigo-chatbot
else
    echo "Starting with simple background processes..."
    echo ""
    echo "Note: Install 'tmux' for better process management"
    echo "      sudo apt-get install tmux  (Ubuntu/Debian)"
    echo "      brew install tmux          (macOS)"
    echo ""
    
    # Start backend in background
    cd server
    npm start > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    sleep 3
    
    # Start frontend in background
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    echo "================================================"
    echo "Both servers started!"
    echo "================================================"
    echo ""
    echo "Backend PID:  $BACKEND_PID (log: backend.log)"
    echo "Frontend PID: $FRONTEND_PID (log: frontend.log)"
    echo ""
    echo "Backend:  http://localhost:3001"
    echo "Frontend: http://localhost:5173"
    echo ""
    echo "To stop servers:"
    echo "  kill $BACKEND_PID $FRONTEND_PID"
    echo "================================================"
    echo ""
fi
