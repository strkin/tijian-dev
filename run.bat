@echo off
chcp 65001 >nul
cd /d "%~dp0"

start "server" cmd /k "cd /d %~dp0 && call npm run server"
start "dev"    cmd /k "cd /d %~dp0 && call npm run dev"

timeout /t 3 >nul
start chrome "" http://localhost:5173/home