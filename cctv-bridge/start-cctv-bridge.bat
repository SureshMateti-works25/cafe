@echo off
title AromaCraft Cafe - CCTV WebRTC Streaming Gateway
echo ========================================================
echo   AromaCraft Enterprise - CCTV WebRTC Stream Bridge
echo   Connecting Camera: 192.168.68.113:554
echo   Public Domain: https://cam.nistta.com
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Starting go2rtc WebRTC Gateway on http://localhost:1984...
start "AromaCraft go2rtc Bridge" /min go2rtc.exe -c go2rtc.yaml

echo [2/2] Starting Cloudflare Tunnel for cam.nistta.com...
start "AromaCraft Cloudflare Tunnel" /min cloudflared.exe tunnel run --token eyJhIjoiYjRjYWU1OTBkNWRmZjcwMWU3MzU5ODI4ZjU0ODQyNzUiLCJ0IjoiODcwN2E5ZWItNWIzNC00ZTE1LWI5ZGEtMjg4ZmQ2NjFhMTk5IiwicyI6Ik56UXpNVEJoTkRBdFptUXdNQzAwTjJaakxUaGtZalF0WmpFellUVXdPV0l4TXpRMiJ9

echo.
echo All services running in background!
echo Local Stream:  http://localhost:1984/stream.html?src=table1
echo Public Stream: https://cam.nistta.com/stream.html?src=table1
echo.
echo Press any key to stop all bridge services...
pause >nul

echo Stopping services...
taskkill /f /im cloudflared.exe >nul 2>&1
taskkill /f /im go2rtc.exe >nul 2>&1
echo Done.
