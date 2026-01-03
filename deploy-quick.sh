#!/bin/bash

echo "🚀 AI Float Deployment Script"
echo "=============================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Deploy Backend
echo "🔧 Step 1: Deploying Backend to Vercel..."
echo "=========================================="
cd ai-proxy
echo "Please follow Vercel prompts..."
vercel --prod

echo ""
echo "✅ Backend deployed!"
echo ""
echo "🔑 Now add your OpenRouter API key:"
vercel env add OPENROUTER_API_KEY

echo ""
echo "🔄 Redeploying with environment variable..."
vercel --prod

cd ..

echo ""
echo "✅ Backend deployment complete!"
echo ""
echo "📝 Copy your Vercel URL from above (e.g., https://your-app.vercel.app)"
read -p "Enter your Vercel backend URL: " BACKEND_URL

# Update bookmarklet.js
echo ""
echo "⚙️  Updating bookmarklet.js with backend URL..."
sed -i "s|http://localhost:3000/chat|${BACKEND_URL}/chat|g" bookmarklet.js

echo ""
echo "📂 Step 2: Setting up Git repository..."
echo "========================================"

# Initialize git if needed
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "Initial commit - AI Float Bookmarklet"
fi

echo ""
echo "📤 Push to GitHub:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "2. Name it: ai-float"
echo "3. Don't initialize with README"
echo ""
read -p "Enter your GitHub repository URL (https://github.com/USERNAME/ai-float.git): " GITHUB_URL

git remote add origin "$GITHUB_URL"
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🌐 Step 3: Enable GitHub Pages"
echo "==============================="
echo "1. Go to: $GITHUB_URL"
echo "2. Click: Settings → Pages"
echo "3. Source: Deploy from a branch"
echo "4. Branch: main / root"
echo "5. Save"
echo ""
read -p "Press Enter after enabling GitHub Pages..."

# Extract GitHub username
GITHUB_USERNAME=$(echo "$GITHUB_URL" | sed -n 's/.*github\.com\/\([^/]*\)\/.*/\1/p')

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "📌 Your Bookmarklet URL:"
echo "-------------------------"
echo "javascript:(function(){if(window.__aiFloatInitialized){window.__aiFloatToggle();return;}var s=document.createElement('script');s.src='https://${GITHUB_USERNAME}.github.io/ai-float/bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();"
echo ""
echo "✅ Backend: ${BACKEND_URL}"
echo "✅ Frontend: https://${GITHUB_USERNAME}.github.io/ai-float/bookmarklet.js"
echo ""
echo "📝 Save the bookmarklet URL above as a bookmark in your browser!"
echo ""
