@echo off
echo Starting Antigravity Blog Platform...

start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm run dev"

echo Backend and Frontend are starting in separate windows.
echo API: http://localhost:5000
echo Frontend: http://localhost:5173
