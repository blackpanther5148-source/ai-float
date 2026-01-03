# 🎈 AI Floating Ball Assistant

A bookmarklet-based AI assistant that appears beside your cursor when you select text on any webpage. Ask questions about the selected text and get instant AI-powered answers through a beautiful floating chat interface.

## ✨ Features

- **Smart Activation**: Floating ball appears only when text is selected
- **Cursor Positioning**: Ball and chat panel intelligently position near your cursor
- **Interactive Chat**: Ask multiple questions about the selected text
- **Secure Backend**: OpenAI API key stays safe on your server
- **Works Everywhere**: Use on any website via bookmarklet
- **Beautiful UI**: Modern gradient design with smooth animations

## 📁 Project Structure

```
Ai-float/
├── ai-proxy/
│   ├── package.json      # Node.js dependencies
│   ├── server.js         # Express proxy server
│   ├── .env              # OpenAI API key (create this)
│   └── README.md         # This file
└── bookmarklet.js        # Client-side bookmarklet code
```

## 🚀 Setup Instructions

### Step 1: Set Up the Backend Proxy Server

1. **Navigate to the ai-proxy folder**:
   ```bash
   cd ai-proxy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your OpenAI API key**:
   - Open the `.env` file
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - Get your API key from: https://platform.openai.com/api-keys

   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   PORT=3000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify the server is running**:
   - Open your browser and visit: http://localhost:3000
   - You should see: `{"status":"ok","message":"AI Proxy Server is running"}`

### Step 2: Create the Bookmarklet

1. **Minify the bookmarklet code**:
   - Open `bookmarklet.js`
   - Copy the entire contents
   - Use an online JavaScript minifier (e.g., https://javascript-minifier.com/) or use it as-is

2. **Update the proxy URL** (if deploying to production):
   - In `bookmarklet.js`, find the line:
     ```javascript
     proxyUrl: 'http://localhost:3000/chat'
     ```
   - Change it to your deployed server URL if needed

3. **Create the bookmarklet**:
   - Create a new bookmark in your browser
   - Name it: "✨ AI Assistant"
   - For the URL, wrap the minified code in:
     ```javascript
     javascript:(function(){/* YOUR MINIFIED CODE HERE */})();
     ```
   
   Or use this simplified version for testing:
   ```javascript
   javascript:(function(){var s=document.createElement('script');s.src='http://localhost:8000/bookmarklet.js';document.body.appendChild(s);})();
   ```
   
   **Note**: For the second method, you'll need to serve bookmarklet.js via a local server.

### Step 3: Serve the Bookmarklet (Optional Method)

If you want to load the bookmarklet from a URL:

1. **Serve the file locally**:
   ```bash
   # In the Ai-float directory
   python -m http.server 8000
   # Or use any other static file server
   ```

2. **Create a simpler bookmarklet**:
   ```javascript
   javascript:(function(){var s=document.createElement('script');s.src='http://localhost:8000/bookmarklet.js';document.body.appendChild(s);})();
   ```

## 📖 How to Use

1. **Start the proxy server** (if not already running):
   ```bash
   cd ai-proxy
   npm start
   ```

2. **Visit any webpage** where you want to use the assistant

3. **Select some text** on the page

4. **The floating ball (✨) will appear** near your selection

5. **Click the ball** to open the chat panel

6. **Ask questions** about the selected text in the chat interface

7. **Get AI-powered answers** instantly!

## 🔧 Configuration

### Update Proxy URL

If you deploy the proxy server to a production environment:

1. Open `bookmarklet.js`
2. Find the `CONFIG` object at the top:
   ```javascript
   const CONFIG = {
     proxyUrl: 'http://localhost:3000/chat', // Change this
     ballSize: 50,
     ballOffset: 10,
     chatWidth: 400,
     chatHeight: 500
   };
   ```
3. Update `proxyUrl` to your deployed server URL

### Customize Appearance

Modify the `CONFIG` object in `bookmarklet.js`:
- `ballSize`: Size of the floating ball (default: 50px)
- `ballOffset`: Distance from cursor (default: 10px)
- `chatWidth`: Width of chat panel (default: 400px)
- `chatHeight`: Height of chat panel (default: 500px)

### Change AI Model

In `server.js`, modify the OpenAI request:
```javascript
{
  model: 'gpt-3.5-turbo', // Change to 'gpt-4' or other models
  messages: messages,
  temperature: 0.7,
  max_tokens: 1000
}
```

## 🌐 Deploying to Production

### Deploy the Proxy Server

You can deploy the proxy server to any Node.js hosting platform:

**Option 1: Heroku**
```bash
# Install Heroku CLI and login
heroku create your-ai-proxy
heroku config:set OPENAI_API_KEY=your-api-key
git push heroku main
```

**Option 2: Railway**
1. Visit https://railway.app/
2. Create a new project
3. Connect your GitHub repo
4. Add environment variable: `OPENAI_API_KEY`

**Option 3: Render**
1. Visit https://render.com/
2. Create a new Web Service
3. Connect your GitHub repo
4. Add environment variable: `OPENAI_API_KEY`

**Option 4: DigitalOcean, AWS, Google Cloud, etc.**
- Deploy as a standard Node.js application
- Set the `OPENAI_API_KEY` environment variable
- Ensure port 3000 (or your chosen port) is accessible

### Update CORS Settings (Important for Production)

For production, update CORS in `server.js` to only allow specific origins:

```javascript
const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['*'];

app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.includes('*') || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

## 🔒 Security Best Practices

1. **Never expose your OpenAI API key** in the bookmarklet code
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** in production (consider using `express-rate-limit`)
4. **Add authentication** if you want to restrict access
5. **Use HTTPS** in production
6. **Whitelist domains** in CORS settings

## 🐛 Troubleshooting

### Ball doesn't appear when selecting text
- Make sure the proxy server is running
- Check browser console for errors (F12)
- Try refreshing the page and clicking the bookmarklet again

### "Network error" message
- Verify the proxy server is running on the correct port
- Check that the `proxyUrl` in `bookmarklet.js` matches your server URL
- Check CORS settings if accessing from a different domain

### "OpenAI API key not configured"
- Ensure `.env` file exists in the `ai-proxy` folder
- Verify the API key is correctly set (no extra spaces)
- Restart the server after changing `.env`

### Chat panel appears off-screen
- The code includes bounds checking, but if issues persist:
- Try selecting text closer to the center of the page
- Adjust `chatWidth` and `chatHeight` in the CONFIG object

## 📊 API Usage Example

The proxy server expects this payload format:

```json
{
  "messages": [
    { 
      "role": "system", 
      "content": "You are a helpful assistant that explains selected text and answers questions clearly." 
    },
    { 
      "role": "user", 
      "content": "Explain this concept.\n\nSelected text: Quantum entanglement" 
    }
  ]
}
```

Response format:

```json
{
  "success": true,
  "message": "Quantum entanglement is a phenomenon where...",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

## 🎨 Customization Ideas

- Add support for different AI models (GPT-4, Claude, etc.)
- Implement conversation history persistence
- Add voice input/output
- Create keyboard shortcuts
- Add theme customization
- Implement multi-language support
- Add copy/paste functionality for responses
- Save favorite responses

## 📝 License

MIT License - feel free to use and modify as needed!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 💡 Tips

- **Use on articles**: Select paragraphs and ask for summaries
- **Learn new terms**: Highlight technical terms and ask for explanations
- **Language help**: Select text in foreign languages and ask for translations
- **Code review**: Select code snippets and ask for explanations
- **Research**: Quickly understand complex topics while browsing

---

**Enjoy your AI-powered browsing assistant! ✨**
