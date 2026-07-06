@echo off
cd /d "%~dp0"
echo ========================================
echo   VAULT - Premium E-Commerce Store
echo ========================================
echo.
echo  Starting servers...
echo.
echo  Storefront:      http://localhost:3000
echo  Admin Panel:     http://localhost:3000/admin
echo  Facebook Ads:    http://localhost:3000/facebook-ads
echo.
echo  Coupon Codes:    WELCOME20 (20%% off $100+)
echo                    FREESHIP ($15 off $200+)
echo                    SUMMER25 (25%% off $150+)
echo.
echo ========================================
echo.
set NODE_ENV=production
start "VAULT Backend" cmd /c "node server/index.js"
timeout /t 2 /nobreak >nul
start "VAULT Frontend" cmd /c "cd /d %~dp0client && cmd /c npm run dev"
echo.
echo  Both servers started. Open http://localhost:3000
echo.
pause
