# 🚀 DEPLOYMENT GUIDE

## Quick Deploy (5 Minutes)

### 📦 STEP 1: Deploy Backend (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd ai-proxy
   vercel login
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **ai-float-backend** (or any name)
   - Directory? **./ai-proxy**
   - Want to override? **N**

3. **Add Environment Variable**
   ```bash
   vercel env add OPENROUTER_API_KEY
   ```
   Paste your OpenRouter API key when prompted
   
   Select: **Production, Preview, Development**

4. **Redeploy with Environment Variable**
   ```bash
   vercel --prod
   ```

5. **Your Backend URL**
   You'll get: `https://ai-float-backend.vercel.app`
   
   API endpoint: `https://ai-float-backend.vercel.app/chat`

---

### 🌐 STEP 2: Deploy Frontend (GitHub Pages)

1. **Initialize Git** (if not already)
   ```bash
   cd ..
   git init
   git add .
   git commit -m "AI Float Bookmarklet"
   ```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name it: **ai-float**
   - Don't initialize with README
   - Create repository

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-float.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repo: Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - Save

5. **Your Frontend URL**
   `https://YOUR_USERNAME.github.io/ai-float/bookmarklet.js`

---

### ⚙️ STEP 3: Update Configuration

Edit `bookmarklet.js` and update the proxy URL:

```javascript
const CONFIG = {
  proxyUrl: 'https://ai-float-backend.vercel.app/chat', // Your Vercel URL
  ballSize: 24,
  ballOffset: 10,
  chatWidth: 450,
  chatHeight: 600
};
```

Commit and push:
```bash
git add bookmarklet.js
git commit -m "Update proxy URL"
git push
```

---

### 📌 STEP 4: Create Final Bookmarklet

```javascript
javascript:(function(){if(window.__aiFloatInitialized){window.__aiFloatToggle();return;}var s=document.createElement('script');s.src='https://YOUR_USERNAME.github.io/ai-float/bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Alternative: Deploy Backend to Railway

### Option B: Railway (If Vercel doesn't work)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   cd ai-proxy
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variable**
   ```bash
   railway variables set OPENROUTER_API_KEY=your-api-key-here
   ```

4. **Get URL**
   ```bash
   railway domain
   ```

---

## 🎯 Final Checklist

✅ Backend deployed and accessible  
✅ Environment variable (API key) added  
✅ Frontend deployed to GitHub Pages  
✅ bookmarklet.js updated with backend URL  
✅ Changes committed and pushed  
✅ Bookmarklet URL created with GitHub Pages URL  
✅ Tested on a website  

---

## 🐛 Troubleshooting

**CORS Errors?**
- Make sure server.js has correct CORS configuration
- Backend should allow your domain

**API Key Not Working?**
```bash
vercel env ls  # Check if variable is set
vercel env pull  # Pull environment variables locally
```

**GitHub Pages Not Loading?**
- Wait 5-10 minutes after enabling
- Check: Settings → Pages → Visit site
- Make sure bookmarklet.js is in root directory

**Backend URL Not Working?**
- Test: `curl https://your-backend-url.vercel.app/chat`
- Check Vercel dashboard for deployment logs

---

## 📱 Test Your Deployment

1. Go to any website (e.g., Wikipedia)
2. Click your bookmarklet
3. Select some text
4. Click the ✨ ball
5. Ask a question

Should work perfectly! 🎉
