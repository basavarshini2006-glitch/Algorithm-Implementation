#!/bin/bash

echo "===================================="
echo "AlgoVision - Algorithm Visualization"
echo "===================================="
echo ""

# Check if backend and frontend folders exist
if [ ! -d "backend" ]; then
    echo "Error: backend folder not found"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "Error: frontend folder not found"
    exit 1
fi

echo "Starting Backend Setup..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
fi

echo ""
echo "Backend setup complete!"
echo "To start the backend, run: cd backend && source venv/bin/activate && python app.py"
echo "Backend will run on http://localhost:5000"
echo ""

echo "Starting Frontend Setup..."
cd ../frontend

# Install npm dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo ".env.local file created from .env.example"
fi

echo ""
echo "Frontend setup complete!"
echo "To start the frontend, run: cd frontend && npm run dev"
echo "Frontend will run on http://localhost:5173"
echo ""

echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Open two terminals"
echo "2. Terminal 1: cd backend && source venv/bin/activate && python app.py"
echo "3. Terminal 2: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""

