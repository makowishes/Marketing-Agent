import React from 'react';
import { ChevronDown, ChevronUp, Sparkles, Target, Zap, RefreshCw } from 'lucide-react';
import '../styles/GettingStartedGuide.css';

function GettingStartedGuide({ isOpen, onToggle }) {
  return (
    <div className={`getting-started-guide ${isOpen ? 'open' : 'closed'}`}>
      <button className="guide-toggle" onClick={onToggle}>
        <div className="toggle-content">
          <Sparkles size={20} />
          <span>How to get the most out of your experience</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="guide-content">
          <div className="guide-section">
            <div className="guide-item">
              <Target className="guide-icon" />
              <div className="guide-text">
                <h3>Be Specific</h3>
                <p>Include details about your target audience, brand voice, and campaign goals for better results.</p>
              </div>
            </div>

            <div className="guide-item">
              <Zap className="guide-icon" />
              <div className="guide-text">
                <h3>Multi-Platform Support</h3>
                <p>Generate content for YouTube scripts, Instagram posts, and blog articles all in one place.</p>
              </div>
            </div>

            <div className="guide-item">
              <RefreshCw className="guide-icon" />
              <div className="guide-text">
                <h3>Iterate & Refine</h3>
                <p>Use the "Remix" button to generate alternative versions and find the perfect content for your needs.</p>
              </div>
            </div>
          </div>

          <div className="guide-tips">
            <h3>Quick Tips:</h3>
            <ul>
              <li>Start with "Create a YouTube script about..." for video content</li>
              <li>Use "Write an Instagram post for..." for social media</li>
              <li>Try "Generate a blog outline on..." for article structures</li>
              <li>Click "Copy" to quickly grab content or "Download" for offline use</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default GettingStartedGuide;