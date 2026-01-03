require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins (configure as needed)
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Proxy Server is running',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint - proxies requests to OpenAI
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request format. Expected messages array.' 
      });
    }

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        success: false,
        error: 'OpenRouter API key not configured on server.' 
      });
    }

    // Make request to OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI Float Assistant'
        }
      }
    );

    // Validate response structure
    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      console.error('Invalid OpenRouter response structure:', response.data);
      return res.status(500).json({
        success: false,
        error: 'Invalid response from OpenRouter API'
      });
    }

    // Extract and return the assistant's reply
    const assistantMessage = response.data.choices[0].message.content;
    
    res.json({
      success: true,
      message: assistantMessage,
      usage: response.data.usage || {}
    });

  } catch (error) {
    console.error('Error calling OpenRouter API:', error.response?.data || error.message);
    
    // Return appropriate error response with consistent structure
    if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
      res.status(401).json({ 
        success: false,
        error: 'Invalid OpenRouter API key or permission denied.' 
      });
    } else if (error.response?.status === 429) {
      res.status(429).json({ 
        success: false,
        error: 'Rate limit exceeded. Please try again later.' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to get response from AI assistant.',
        details: error.response?.data?.error?.message || error.message
      });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Proxy Server running on http://localhost:${PORT}`);
  console.log(`✓ OpenRouter API key configured: ${process.env.OPENROUTER_API_KEY ? 'Yes' : 'No'}`);
});
