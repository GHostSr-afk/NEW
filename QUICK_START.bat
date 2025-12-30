@echo off
cls
echo ========================================
echo    SMARTCLOSET - QUICK START
echo ========================================
echo.
echo Starting backend server...
echo.
echo Backend will run on: http://localhost:5000
echo.
echo After server starts:
echo 1. Open demo-ui.html (will auto-open)
echo 2. Login with: demo@smartcloset.com
echo 3. Password: demo123456
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

start demo-ui.html

node server/index.js
