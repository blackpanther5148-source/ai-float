@echo off
echo.
echo 🚀 AI Float Deployment Script for Windows
echo ==========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if vercel is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo 🔧 Step 1: Deploying Backend to Vercel...
echo ==========================================
cd ai-proxy
echo Please follow Vercel prompts...
call vercel --prod

echo.
echo ✅ Backend deployed!
echo.
echo 🔑 Now add your OpenRouter API key:
call vercel env add OPENROUTER_API_KEY

echo.
echo 🔄 Redeploying with environment variable...
call vercel --prod

cd ..

echo.
echo ✅ Backend deployment complete!
echo.
set /p BACKEND_URL="Enter your Vercel backend URL (e.g., https://your-app.vercel.app): "

echo.
echo ⚙️  Updating bookmarklet.js with backend URL...
REM Note: This needs manual update on Windows
echo Please manually update bookmarklet.js:
echo Change: proxyUrl: 'http://localhost:3000/chat'
echo To: proxyUrl: '%BACKEND_URL%/chat'
pause

echo.
echo 📂 Step 2: Setting up Git repository...
echo ========================================

REM Initialize git if needed
if not exist .git (
    git init
    git add .
    git commit -m "Initial commit - AI Float Bookmarklet"
)

echo.
echo 📤 Push to GitHub:
echo 1. Create a new repository on GitHub: https://github.com/new
echo 2. Name it: ai-float
echo 3. Don't initialize with README
echo.
set /p GITHUB_URL="Enter your GitHub repository URL (https://github.com/USERNAME/ai-float.git): "

git remote add origin "%GITHUB_URL%"
git branch -M main
git push -u origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo 🌐 Step 3: Enable GitHub Pages
echo ===============================
echo 1. Go to your repository on GitHub
echo 2. Click: Settings → Pages
echo 3. Source: Deploy from a branch
echo 4. Branch: main / root
echo 5. Save
echo.
pause

echo.
set /p GITHUB_USERNAME="Enter your GitHub username: "

echo.
echo 🎉 DEPLOYMENT COMPLETE!
echo =======================
echo.
echo 📌 Your Bookmarklet URL:
echo -------------------------
echo javascript:(function(){if(window.__aiFloatInitialized){window.__aiFloatToggle();return;}var s=document.createElement('script');s.src='https://%GITHUB_USERNAME%.github.io/ai-float/bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();
echo.
echo ✅ Backend: %BACKEND_URL%
echo ✅ Frontend: https://%GITHUB_USERNAME%.github.io/ai-float/bookmarklet.js
echo.
echo 📝 Save the bookmarklet URL above as a bookmark in your browser!
echo.
pause
