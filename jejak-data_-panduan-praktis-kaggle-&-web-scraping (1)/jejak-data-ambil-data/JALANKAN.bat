@echo off
chcp 65001 >nul
title Jejak Data - Panduan Kaggle & Web Scraping

echo ==========================================================
echo        JEJAK DATA: PANDUAN KAGGLE & WEB SCRAPING
echo ==========================================================
echo Memeriksa instalasi Python di komputer Anda...
echo.

where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python terdeteksi!
    echo Membuka website melalui server lokal Python di port 8000...
    echo Tekan CTRL+C di jendela ini jika ingin menghentikan server.
    echo.
    start http://localhost:8000/
    python -m http.server 8000
) else (
    echo [INFO] Python tidak ditemukan di PATH sistem.
    echo Membuka website langsung di browser default Anda...
    echo.
    start index.html
)

pause
