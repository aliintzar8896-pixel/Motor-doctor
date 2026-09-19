@echo off
title Motor Doctor - Roadside & Bill Doctor
echo ========================================================
echo       MOTOR DOCTOR - Roadside & Bill Doctor
echo       Teerthanker Mahaveer University (TMU), Moradabad
echo       Submitted by: Intzar Ali (BCA 5th Sem, Sec E)
echo ========================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "Motor Doctor - Backend API" cmd /k "cd /d "%~dp0backend" && npm run dev"
echo.
echo Opening browser at http://localhost:8080/ ...
timeout /t 3 /nobreak >nul
start "" "http://localhost:8080/"
echo Starting Frontend Development Server (Port 8080)...
cd /d "%~dp0frontend"
npm run dev
pause
