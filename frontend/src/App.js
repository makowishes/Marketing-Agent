import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import GettingStartedGuide from './components/GettingStartedGuide';
import './styles/App.css';

function App() {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="app">
      <div className="app-container">
        <GettingStartedGuide isOpen={showGuide} onToggle={() => setShowGuide(!showGuide)} />
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;