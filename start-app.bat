@echo off
cd /d "%~dp0"

echo Starting backend and frontend...
start "College SMS Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
start "College SMS Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo App is starting...
echo Open: http://localhost:5173
echo.
echo Login:
echo Email:    admin@college.test
echo Password: Admin@123
echo.
pause
