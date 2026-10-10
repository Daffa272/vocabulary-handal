@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Jejak Data - server lokal

set "PY="
where py >nul 2>nul && py --version >nul 2>nul && set "PY=py"
if not defined PY where python >nul 2>nul && python --version >nul 2>nul && set "PY=python"

if defined PY (
  echo.
  echo  Jejak Data berjalan di  http://localhost:8000
  echo  Biarkan jendela ini terbuka selama kamu belajar.
  echo  Tekan CTRL+C untuk berhenti.
  echo.
  start "" "http://localhost:8000"
  %PY% -m http.server 8000
) else (
  echo.
  echo  Python tidak ditemukan. Membuka index.html langsung di browser...
  echo  ^(Situs ini tetap berfungsi tanpa server.^)
  echo.
  start "" "%~dp0index.html"
  pause
)
