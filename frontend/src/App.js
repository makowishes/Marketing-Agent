import React from 'react';
import ChatInterface from './components/ChatInterface';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="bg-background relative">
        {/* Fixed background elements that cover the entire viewport */}
        <div className="fixed inset-0 top-lighting"></div>

        {/* Multiple floating aura elements with fixed positioning */}
        <div className="fixed ambient-glow" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="fixed ambient-glow" style={{ top: '20%', right: '10%', animationDelay: '-2s' }}></div>
        <div className="fixed ambient-glow" style={{ top: '50%', left: '15%', animationDelay: '-4s' }}></div>
        <div className="fixed ambient-glow" style={{ top: '70%', right: '20%', animationDelay: '-6s' }}></div>
        <div className="fixed ambient-glow" style={{ bottom: '5%', left: '40%', animationDelay: '-8s' }}></div>
        <div className="fixed ambient-glow" style={{ top: '35%', left: '60%', animationDelay: '-10s' }}></div>
        <div className="fixed ambient-glow" style={{ bottom: '30%', right: '5%', animationDelay: '-12s' }}></div>

        <div className="container mx-auto max-w-4xl relative z-10 min-h-screen">
          <ChatInterface />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;