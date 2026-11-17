@echo off
chcp 65001 > nul
title Квестефи — PWA & Web Сервер
cd /d "%~dp0"
echo ===================================================
echo   Запуск платформы Квестефи v5.1.0 (PWA & Desktop)
echo ===================================================
python start_server.py
pause
