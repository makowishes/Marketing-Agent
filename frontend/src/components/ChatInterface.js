import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import MessageCard from './MessageCard';
import api from '../services/api';
import '../styles/ChatInterface.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.generateContent(inputValue);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        contentType: response.contentType || 'text',
        platforms: response.platforms || [],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error while generating content. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRegenerate = async (messageId) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const originalUserMessage = messages[messageIndex - 1]?.content;
    if (!originalUserMessage) return;

    setIsLoading(true);

    try {
      const response = await api.generateContent(originalUserMessage);

      const newMessage = {
        ...messages[messageIndex],
        id: Date.now(),
        content: response.content,
        contentType: response.contentType || 'text',
        platforms: response.platforms || [],
        timestamp: new Date().toISOString(),
        regenerated: true
      };

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = newMessage;
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error regenerating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>Marketing Content Generator</h1>
        <p>AI-powered content creation for YouTube, Instagram, and Blogs</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2>Welcome to Marketing Agent! 👋</h2>
            <p>Ask me to create marketing content for your campaigns.</p>
            <div className="suggestion-chips">
              <button onClick={() => setInputValue("Create a YouTube script for a product launch")}>
                YouTube Script
              </button>
              <button onClick={() => setInputValue("Write an Instagram post for a summer sale")}>
                Instagram Post
              </button>
              <button onClick={() => setInputValue("Generate a blog outline about digital marketing trends")}>
                Blog Outline
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onRegenerate={() => handleRegenerate(message.id)}
          />
        ))}

        {isLoading && (
          <div className="loading-message">
            <Loader className="loading-spinner" />
            <span>Generating content...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to create marketing content..."
            className="chat-input"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;