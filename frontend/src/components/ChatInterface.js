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
          <div className="retro-section max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-9 mb-6">
              <div className="w-12 h-12 bg-accent-blue/10 border-2 border-accent-blue rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-accent-blue" />
              </div>
              <div className="bg-accent-yellow/10 border-2 border-accent-yellow p-2">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                  MAC
                </h1>
              </div>
              <div className="w-12 h-12 bg-accent-red/10 border-2 border-accent-red rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-accent-red" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        {!hasStartedChat && (
          <div className="retro-card-creative content-aura p-8 md:p-12 mb-8 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="bg-accent-green/10 border-2 border-accent-green p-4 mb-6 inline-block">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent-green" />
                  <h3 className="text-xl font-black text-foreground">OUR MISSION</h3>
                  <Sparkles className="h-5 w-5 text-accent-green" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
                Your Marketing Agent-C
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
                We create comprehensive marketing content that drives growth. Our AI generates a complete package including YouTube scripts, Instagram content, and blog posts - all tailored to your unique business and audience.
              </p>
            </div>

            <div className="retro-section">
              <h3 className="text-2xl font-black text-foreground mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-yellow/20 border-2 border-accent-yellow flex items-center justify-center">
                  <Coffee className="h-4 w-4 text-accent-yellow" />
                </div>
                Let's Get Started
              </h3>
              <p className="text-muted-foreground mb-8 text-lg font-medium">
                We understand the unique challenges small businesses face in today's competitive market. Share some details about your business to receive your personalized marketing content package designed specifically for your growth:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-accent-green/5 border border-accent-green/20">
                    <span className="text-accent-green text-lg font-bold">★</span>
                    <span className="font-bold text-card-foreground">What type of business do you own?</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent-blue/5 border border-accent-blue/20">
                    <span className="text-accent-blue text-lg font-bold">★</span>
                    <span className="font-bold text-card-foreground">Who is your target audience?</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-accent-red/5 border border-accent-red/20">
                    <span className="text-accent-red text-lg font-bold">★</span>
                    <span className="font-bold text-card-foreground">What products or services do you offer?</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent-yellow/5 border border-accent-yellow/20">
                    <span className="text-accent-yellow text-lg font-bold">★</span>
                    <span className="font-bold text-card-foreground">Any specific marketing goals?</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent-yellow/10 border-2 border-accent-yellow p-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-black text-card-foreground text-base">💡 EXAMPLE:</span><br />
                  <span className="font-medium">"I own a local coffee shop serving artisanal coffee and pastries. My target audience is young professionals and college students downtown. I want to promote our new seasonal drinks and cozy study environment."</span>
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
          <div className="retro-section content-aura">
            <div className="flex gap-4">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell us about your business, target audience, and marketing goals..."
                className="min-h-[80px] input-creative bg-card resize-none text-base font-medium placeholder:text-muted-foreground/70"
                rows="3"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="button-creative self-end h-16 w-16 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                size="icon"
              >
                {isLoading ? (
                  <div className="loading-creative">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                ) : (
                  <Send className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;