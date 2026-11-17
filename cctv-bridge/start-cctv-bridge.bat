@echo off
title AromaCraft Cafe - CCTV WebRTC Streaming Gateway
echo ========================================================
echo   AromaCraft Enterprise - CCTV WebRTC Stream Bridge
echo   Connecting Camera: 192.168.68.113:554
echo ========================================================
echo.
cd /d "%~dp0"
echo Starting go2rtc WebRTC Gateway on http://localhost:1984...
go2rtc.exe -c go2rtc.yaml
pause
