import React from 'react';
import ChatInterface from './components/ChatInterface';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl">
          <ChatInterface />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;