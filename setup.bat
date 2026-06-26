@echo off
echo ====================================
echo AlgoVision - Algorithm Visualization
echo ====================================
echo.

REM Check if backend and frontend folders exist
if not exist "backend" (
    echo Error: backend folder not found
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend folder not found
    exit /b 1
)

echo Starting Backend Setup...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing backend dependencies...
pip install -r requirements.txt

REM Create .env if it doesn't exist
if not exist ".env" (
    copy .env.example .env
    echo .env file created from .env.example
)

echo.
echo Backend setup complete!
echo To start the backend, run: cd backend && venv\Scripts\activate && python app.py
echo Backend will run on http://localhost:5000
echo.

echo Starting Frontend Setup...
cd ..\frontend

REM Install npm dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env if it doesn't exist
if not exist ".env.local" (
    copy .env.example .env.local
    echo .env.local file created from .env.example
)

echo.
echo Frontend setup complete!
echo To start the frontend, run: cd frontend && npm run dev
echo Frontend will run on http://localhost:5173
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Open two terminals
echo 2. Terminal 1: cd backend && venv\Scripts\activate && python app.py
echo 3. Terminal 2: cd frontend && npm run dev
echo 4. Open http://localhost:5173 in your browser
echo.
pause

