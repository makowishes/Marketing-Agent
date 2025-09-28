import React from 'react';
import ChatInterface from './components/ChatInterface';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background relative">
        <div className="top-lighting"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <ChatInterface />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;