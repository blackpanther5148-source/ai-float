(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    proxyUrl: 'https://ai-float-backend.vercel.app/chat', // Deployed backend URL
    ballSize: 24,
    ballOffset: 10,
    chatWidth: 450,
    chatHeight: 600
  };

  // Global state
  let cursorX = 0;
  let cursorY = 0;
  let floatingBall = null;
  let chatPanel = null;
  let conversationHistory = [];
  let selectedText = '';
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Initialize the bookmarklet
  function init() {
    console.log('🔧 Init function called');
    // Check if already initialized
    if (window.__aiFloatInitialized) {
      console.log('⚠️ AI Float already initialized');
      return;
    }

    // Remove existing instances if any
    cleanup();

    // Mark as initialized
    window.__aiFloatInitialized = true;
    console.log('✅ AI Float initialized successfully');

    // Create the floating ball
    createFloatingBall();

    // Add event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    console.log('👂 Event listeners added');

    // Set auto-load flag
    try {
      localStorage.setItem('aiFloatAutoLoad', 'true');
      console.log('💾 Auto-load flag set to true');
    } catch (e) {
      console.log('⚠️ Could not set auto-load flag');
    }
  }

  // Create the floating ball element
  function createFloatingBall() {
    floatingBall = document.createElement('div');
    floatingBall.id = 'ai-floating-ball';
    floatingBall.innerHTML = '✨';
    
    // Apply styles
    Object.assign(floatingBall.style, {
      position: 'fixed',
      width: CONFIG.ballSize + 'px',
      height: CONFIG.ballSize + 'px',
      borderRadius: '50%',
      background: '#171615',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      zIndex: '999999',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      userSelect: 'none',
      border: '1px solid rgba(255,255,255,0.01)'
    });

    // Hover effects
    floatingBall.addEventListener('mouseenter', () => {
      floatingBall.style.transform = 'scale(1.1)';
      floatingBall.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });

    floatingBall.addEventListener('mouseleave', () => {
      floatingBall.style.transform = 'scale(1)';
      floatingBall.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });

    // Click handler
    floatingBall.addEventListener('click', handleBallClick);

    document.body.appendChild(floatingBall);
  }

  // Handle mouse up event
  function handleMouseUp(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    console.log('🖱️ Mouse up at:', cursorX, cursorY);

    // Small delay to let selection settle
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      console.log('📝 Selected text:', text.length, 'chars');

      if (text.length > 0) {
        selectedText = text;
        console.log('✨ Showing ball...');
        showBall();
      } else {
        hideBall();
      }
    }, 10);
  }

  // Handle selection change
  function handleSelectionChange() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length === 0 && floatingBall) {
      hideBall();
    }
  }

  // Show the floating ball near cursor
  function showBall() {
    if (!floatingBall) return;

    const selection = window.getSelection();
    let x = cursorX;
    let y = cursorY;

    // Try to get selection rectangle for better positioning
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        x = rect.right + CONFIG.ballOffset;
        y = rect.top;
      }
    }

    // Bounds checking
    const maxX = window.innerWidth - CONFIG.ballSize - 10;
    const maxY = window.innerHeight - CONFIG.ballSize - 10;
    
    x = Math.min(Math.max(10, x), maxX);
    y = Math.min(Math.max(10, y), maxY);

    floatingBall.style.left = x + 'px';
    floatingBall.style.top = y + 'px';
    floatingBall.style.display = 'flex';
  }

  // Hide the floating ball
  function hideBall() {
    if (floatingBall) {
      floatingBall.style.display = 'none';
    }
  }

  // Handle ball click - open chat panel
  function handleBallClick() {
    if (chatPanel) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Open the chat panel
  function openChat() {
    chatPanel = document.createElement('div');
    chatPanel.id = 'ai-chat-panel';

    // Calculate position near cursor with bounds checking
    let x = cursorX + CONFIG.ballOffset;
    let y = cursorY;

    const maxX = window.innerWidth - CONFIG.chatWidth - 10;
    const maxY = window.innerHeight - CONFIG.chatHeight - 10;
    
    x = Math.min(Math.max(10, x), maxX);
    y = Math.min(Math.max(10, y), maxY);

    // Panel structure
    chatPanel.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; background: rgba(255,255,255,0.01); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.02);">
        <div id="chat-header" style="padding: 18px; background: rgba(255,255,255,0.005); color: #fff; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; border-bottom: 1px solid rgba(255,255,255,0.02);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 600; font-size: 17px; color: rgba(255,255,255,0.5);">ai assistant</span>
            <span style="font-size: 11px; opacity: 0.25; margin-left: 4px; color: #999;">(drag to move)</span>
          </div>
          <button id="close-chat-btn" style="background: rgba(255,255,255,0.005); border: 1px solid rgba(255,255,255,0.03); color: rgba(255,255,255,0.4); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;">×</button>
        </div>
        <div style="padding: 14px; background: rgba(255,255,255,0.005); border-bottom: 1px solid rgba(255,255,255,0.02); font-size: 14px; color: #ccc;">
          <strong style="color: rgba(255,255,255,0.45);">Selected:</strong> <span style="font-style: italic; color: rgba(255,255,255,0.3);">"${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}"</span>
        </div>
        <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; background: rgba(255,255,255,0.008);"></div>
        <div style="padding: 14px; border-top: 1px solid rgba(255,255,255,0.02); background: rgba(255,255,255,0.005);">
          <div style="display: flex; gap: 10px;">
            <input type="text" id="chat-input" placeholder="Ask a question about the selected text..." style="flex: 1; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; font-size: 15px; outline: none; transition: border-color 0.2s; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.015);" />
            <button id="send-btn" style="padding: 12px 24px; background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; transition: background 0.2s, color 0.2s;">Send</button>
          </div>
        </div>
      </div>
    `;

    // Apply panel styles
    Object.assign(chatPanel.style, {
      position: 'fixed',
      left: x + 'px',
      top: y + 'px',
      width: CONFIG.chatWidth + 'px',
      height: CONFIG.chatHeight + 'px',
      zIndex: '1000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    });

    document.body.appendChild(chatPanel);

    // Add drag functionality
    const header = document.getElementById('chat-header');
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragOffsetX = e.clientX - chatPanel.offsetLeft;
      dragOffsetY = e.clientY - chatPanel.offsetTop;
      header.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      let newX = e.clientX - dragOffsetX;
      let newY = e.clientY - dragOffsetY;
      
      // Keep panel within viewport bounds
      newX = Math.max(0, Math.min(newX, window.innerWidth - CONFIG.chatWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - CONFIG.chatHeight));
      
      chatPanel.style.left = newX + 'px';
      chatPanel.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
      }
    });

    // Add event listeners
    document.getElementById('close-chat-btn').addEventListener('click', closeChat);
    document.getElementById('close-chat-btn').addEventListener('mouseenter', (e) => {
      e.target.style.opacity = '0.7';
    });
    document.getElementById('close-chat-btn').addEventListener('mouseleave', (e) => {
      e.target.style.opacity = '1';
    });
    
    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', sendMessage);
    sendBtn.addEventListener('mouseenter', (e) => {
      e.target.style.background = 'rgba(255,255,255,0.04)';
      e.target.style.color = 'rgba(255,255,255,0.65)';
    });
    sendBtn.addEventListener('mouseleave', (e) => {
      e.target.style.background = 'rgba(255,255,255,0.02)';
      e.target.style.color = 'rgba(255,255,255,0.5)';
    });
    
    const input = document.getElementById('chat-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    input.addEventListener('focus', (e) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    });
    input.addEventListener('blur', (e) => {
      e.target.style.borderColor = 'rgba(255,255,255,0.04)';
    });

    // Initialize conversation
    conversationHistory = [{
      role: 'system',
      content: 'You are a helpful assistant that explains selected text and answers questions clearly.'
    }];

    // Add initial greeting
    addMessage('assistant', 'Hello! I can help you understand the selected text. What would you like to know?');

    // Focus input
    setTimeout(() => {
      document.getElementById('chat-input').focus();
    }, 100);
  }

  // Close the chat panel
  function closeChat() {
    if (chatPanel) {
      chatPanel.remove();
      chatPanel = null;
      conversationHistory = [];
    }
  }

  // Send a message to the AI
  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const userMessage = input.value.trim();

    if (!userMessage) return;

    // Clear input
    input.value = '';

    // Add user message to chat
    addMessage('user', userMessage);

    // Add to conversation history
    const userContent = `${userMessage}\n\nSelected text: ${selectedText}`;
    conversationHistory.push({
      role: 'user',
      content: userContent
    });

    // Show loading indicator
    const loadingId = addMessage('assistant', 'Thinking...');

    try {
      // Call proxy API
      const response = await fetch(CONFIG.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationHistory
        })
      });

      const data = await response.json();

      // Remove loading indicator
      removeMessage(loadingId);

      // Handle response with better error checking
      if (!data) {
        addMessage('error', 'Received empty response from server.');
        return;
      }

      if (data.success === true && data.message) {
        // Add assistant response
        addMessage('assistant', data.message);
        
        // Update conversation history
        conversationHistory.push({
          role: 'assistant',
          content: data.message
        });
      } else {
        // Handle error responses
        const errorMsg = data.error || 'Failed to get response from AI assistant.';
        const details = data.details ? `\n\nDetails: ${data.details}` : '';
        addMessage('error', errorMsg + details);
      }

    } catch (error) {
      removeMessage(loadingId);
      addMessage('error', 'Network error: Could not connect to AI service. Make sure the proxy server is running.');
      console.error('Error:', error);
    }
  }

  // Add a message to the chat
  function addMessage(type, content) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return null;

    const messageId = 'msg-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;

    const isUser = type === 'user';
    const isError = type === 'error';

    Object.assign(messageDiv.style, {
      padding: '12px 16px',
      borderRadius: '10px',
      maxWidth: '85%',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      background: isUser ? 'rgba(255,255,255,0.03)' : (isError ? 'rgba(255,100,100,0.04)' : 'rgba(255,255,255,0.015)'),
      color: isUser ? 'rgba(255,255,255,0.6)' : (isError ? 'rgba(255,150,150,0.55)' : 'rgba(255,255,255,0.55)'),
      fontSize: '15px',
      lineHeight: '1.6',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      border: '1px solid rgba(255,255,255,0.03)'
    });

    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageId;
  }

  // Remove a message from the chat
  function removeMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) message.remove();
  }

  // Cleanup function
  function cleanup() {
    if (floatingBall) {
      floatingBall.remove();
      floatingBall = null;
    }
    if (chatPanel) {
      chatPanel.remove();
      chatPanel = null;
    }
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('selectionchange', handleSelectionChange);
    window.__aiFloatInitialized = false;
  }

  // Auto-initialize ALWAYS (force initialization on load)
  console.log('🚀 AI Float script loaded!');
  try {
    const autoLoad = localStorage.getItem('aiFloatAutoLoad');
    console.log('📍 Auto-load setting:', autoLoad);
    // Auto-load if it was activated before (or never set, meaning first activation)
    if (autoLoad !== 'false') {
      console.log('✅ Initializing AI Float...');
      init();
    } else {
      console.log('⏸️ AI Float is deactivated. Click bookmark to activate.');
    }
  } catch (e) {
    // If localStorage fails, initialize anyway
    console.log('⚠️ localStorage error, initializing anyway');
    init();
  }

  // Expose cleanup function globally for debugging
  window.__aiFloatCleanup = cleanup;
  
  // Expose deactivate function
  window.__aiFloatDeactivate = function() {
    cleanup();
    try {
      localStorage.setItem('aiFloatAutoLoad', 'false');
    } catch (e) {}
    console.log('✅ AI Float deactivated. Click bookmark again to reactivate.');
  };
  
  // Expose toggle function
  window.__aiFloatToggle = function() {
    if (window.__aiFloatInitialized) {
      window.__aiFloatDeactivate();
    } else {
      init();
      console.log('✅ AI Float activated. It will stay active on all pages until you deactivate it.');
    }
  };

})();
