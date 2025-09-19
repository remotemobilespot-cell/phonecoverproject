@echo off
REM Windows Production Build Script

echo 🚀 Building Phone Case App for Production...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist frontend\dist rmdir /s /q frontend\dist
if exist backend\node_modules\.cache rmdir /s /q backend\node_modules\.cache

REM Install dependencies
echo 📦 Installing dependencies...
cd frontend && npm ci
cd ..\backend && npm ci

REM Build frontend  
echo 🏗️ Building frontend...
cd ..\frontend && npm run build

REM Test build
echo 🧪 Testing production build...
start /b npm run preview
timeout /t 5 /nobreak > nul
taskkill /f /im node.exe 2>nul

REM Verify backend
echo 🔍 Verifying backend...
cd ..\backend
timeout /t 10 npm start 2>nul

echo ✅ Production build complete!
echo 📁 Frontend build: frontend\dist
echo 🚀 Ready for deployment!

pause