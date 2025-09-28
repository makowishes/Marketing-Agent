import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Coffee, Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import MarketingPackageCard from './MarketingPackageCard';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
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
    setHasStartedChat(true); // Hide mission statement after first message

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

  const handleRegenerateScript = async (scriptType) => {
    // For now, regenerate the entire package
    // TODO: Implement individual script regeneration when backend supports it
    const lastUserMessage = messages.find(m => m.type === 'user');
    if (!lastUserMessage) return;

    setIsLoading(true);

    try {
      const response = await api.generateContent(lastUserMessage.content);

      const lastMessageIndex = messages.length - 1;
      const newMessage = {
        ...messages[lastMessageIndex],
        id: Date.now(),
        content: response.content,
        contentType: response.contentType || 'marketing-package',
        platforms: response.platforms || ['YouTube', 'Instagram', 'Blog'],
        scripts: response.scripts,
        timestamp: new Date().toISOString(),
        regenerated: true
      };

      const updatedMessages = [...messages];
      updatedMessages[lastMessageIndex] = newMessage;
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error regenerating script:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-6 px-4 md:px-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="h-8 w-8 text-accent-green" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              MAC
            </h1>
            <Heart className="h-6 w-6 text-accent-red" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl md:text-2xl font-semibold text-muted-foreground">
              Your Marketing Agent C
            </span>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete marketing content packages crafted with care for small businesses
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        {!hasStartedChat && (
          <div className="bg-card rounded-3xl border border-border shadow-soft p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                MAC - Helping Small Businesses Shine
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                We create comprehensive marketing content that drives growth. Our AI generates a complete package including YouTube scripts, Instagram content, and blog posts - all tailored to your unique business and audience.
              </p>
            </div>

            <div className="bg-muted rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-accent-orange" />
                Let's Get Started
              </h3>
              <p className="text-muted-foreground mb-6">
                Share some details about your business to receive your personalized marketing content package:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                    What type of business do you own?
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                    Who is your target audience?
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <div className="w-2 h-2 bg-accent-red rounded-full"></div>
                    What products or services do you offer?
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
                    Any specific marketing goals?
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 border-l-4 border-l-accent-yellow">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-card-foreground">💡 Example:</span> "I own a local coffee shop serving artisanal coffee and pastries. My target audience is young professionals and college students downtown. I want to promote our new seasonal drinks and cozy study environment."
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((message) => (
            <MarketingPackageCard
              key={message.id}
              message={message}
              onRegenerateScript={handleRegenerateScript}
            />
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader className="h-6 w-6 animate-spin text-accent-blue" />
            <span className="text-lg font-medium text-muted-foreground">Creating your marketing content...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-6 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
            <div className="flex gap-4">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell us about your business, target audience, and marketing goals..."
                className="min-h-[60px] border-0 bg-muted focus-visible:ring-0 resize-none text-base"
                rows="2"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="self-end h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;