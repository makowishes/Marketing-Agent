import React from 'react';
import { Copy, Download, RefreshCw, Youtube, Instagram, FileText, User, Bot } from 'lucide-react';
import jsPDF from 'jspdf';
import '../styles/MessageCard.css';

function MessageCard({ message, onRegenerate }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    alert('Content copied to clipboard!');
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(message.content, 180);
    doc.text(lines, 10, 10);
    doc.save(`content-${message.id}.pdf`);
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([message.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `content-${message.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return <Youtube size={16} />;
      case 'instagram':
        return <Instagram size={16} />;
      case 'blog':
        return <FileText size={16} />;
      default:
        return null;
    }
  };

  const getCardClass = () => {
    if (message.type === 'user') return 'message-card user-message';
    if (message.type === 'error') return 'message-card error-message';

    const platform = message.platforms?.[0]?.toLowerCase();
    if (platform === 'youtube') return 'message-card youtube-card';
    if (platform === 'instagram') return 'message-card instagram-card';
    if (platform === 'blog') return 'message-card blog-card';

    return 'message-card assistant-message';
  };

  return (
    <div className={getCardClass()}>
      <div className="message-header">
        <div className="message-avatar">
          {message.type === 'user' ? <User size={20} /> : <Bot size={20} />}
        </div>
        <div className="message-meta">
          <span className="message-sender">
            {message.type === 'user' ? 'You' : 'Marketing Agent'}
          </span>
          {message.platforms && message.platforms.length > 0 && (
            <div className="platform-tags">
              {message.platforms.map((platform, index) => (
                <span key={index} className="platform-tag">
                  {getPlatformIcon(platform)}
                  {platform}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="message-content">
        {message.contentType === 'youtube' && (
          <div className="content-preview youtube-preview">
            <Youtube className="preview-icon" />
            <h3>YouTube Script</h3>
          </div>
        )}
        {message.contentType === 'instagram' && (
          <div className="content-preview instagram-preview">
            <Instagram className="preview-icon" />
            <h3>Instagram Post</h3>
          </div>
        )}
        {message.contentType === 'blog' && (
          <div className="content-preview blog-preview">
            <FileText className="preview-icon" />
            <h3>Blog Article</h3>
          </div>
        )}

        <div className="message-text">
          {message.content}
        </div>
      </div>

      {message.type === 'assistant' && message.type !== 'error' && (
        <div className="message-actions">
          <button onClick={onRegenerate} className="action-button remix-button">
            <RefreshCw size={16} />
            Remix
          </button>
          <button onClick={copyToClipboard} className="action-button">
            <Copy size={16} />
            Copy
          </button>
          <div className="download-dropdown">
            <button className="action-button">
              <Download size={16} />
              Download
            </button>
            <div className="dropdown-content">
              <button onClick={downloadAsPDF}>PDF</button>
              <button onClick={downloadAsText}>Plain Text</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageCard;