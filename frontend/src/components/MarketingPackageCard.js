import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Youtube, Instagram, FileText, User, Bot, Package, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import jsPDF from 'jspdf';

function MarketingPackageCard({ message, onRegenerateScript }) {
  const [regeneratingScript, setRegeneratingScript] = useState(null);

  const copyToClipboard = (content, scriptType) => {
    navigator.clipboard.writeText(content);
    alert(`${scriptType} script copied to clipboard!`);
  };

  const downloadScript = (content, scriptType, format = 'txt') => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 10, 10);
      doc.save(`${scriptType.toLowerCase()}-script-${message.id}.pdf`);
    } else {
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${scriptType.toLowerCase()}-script-${message.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleRegenerateScript = async (scriptType) => {
    setRegeneratingScript(scriptType);
    try {
      await onRegenerateScript(scriptType);
    } finally {
      setRegeneratingScript(null);
    }
  };

  const formatScriptContent = (content) => {
    // Simple formatting for better readability
    return content.replace(/\*\*(.*?)\*\*/g, '$1').trim();
  };

  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-6">
        <div className="retro-card bg-accent-blue text-white px-6 py-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white/20 border-2 border-white/30 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">You</span>
          </div>
          <p className="text-base leading-relaxed font-medium">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'error') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800 text-lg">MAC - Your Marketing Agent C</CardTitle>
              <p className="text-red-600 text-sm">Something went wrong</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 leading-relaxed">{message.content}</p>
        </CardContent>
      </Card>
    );
  }

  // Marketing package display
  return (
    <div className="space-y-8">
      {/* Package Header */}
      <div className="retro-card">
        <div className="text-center p-8">
          <div className="bg-accent-green/10 border-2 border-accent-green p-6 mb-6 inline-block">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-accent-green/20 border-2 border-accent-green flex items-center justify-center">
                <Package size={24} className="text-accent-green" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-card-foreground">MAC - YOUR MARKETING AGENT C</h2>
                <div className="flex items-center gap-2 justify-center mt-2">
                  <Heart size={16} className="text-accent-red" />
                  <span className="text-base font-black text-muted-foreground uppercase tracking-wider">Complete Marketing Package</span>
                  <Heart size={16} className="text-accent-red" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-accent-yellow/10 border-2 border-accent-yellow p-6">
            <h3 className="text-xl font-black text-card-foreground mb-3">🎯 YOUR PERSONALIZED CONTENT PACKAGE</h3>
            <p className="text-muted-foreground font-medium text-lg">Here are your custom scripts crafted with care for your business needs</p>
          </div>
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* YouTube Script */}
        <div className="retro-card card-hover">
          <div className="p-6">
            <div className="bg-accent-red/10 border-2 border-accent-red p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-red/20 border-2 border-accent-red flex items-center justify-center">
                  <Youtube size={24} className="text-accent-red" />
                </div>
                <h3 className="text-xl font-black text-card-foreground uppercase tracking-wider">YouTube Script</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                onClick={() => handleRegenerateScript('youtube')}
                disabled={regeneratingScript === 'youtube'}
                className="retro-button bg-accent-red text-white hover:bg-accent-red/90 text-xs font-black uppercase"
                size="sm"
              >
                <RefreshCw size={12} className={regeneratingScript === 'youtube' ? 'animate-spin' : ''} />
                {regeneratingScript === 'youtube' ? 'Regen...' : 'Regen'}
              </Button>
              <Button
                onClick={() => copyToClipboard(message.scripts?.youtube || message.content, 'YouTube')}
                className="retro-button bg-card text-foreground border-2 border-border hover:bg-accent/50 text-xs font-black uppercase"
                size="sm"
              >
                <Copy size={12} />
                Copy
              </Button>
              <Button
                onClick={() => downloadScript(message.scripts?.youtube || message.content, 'YouTube')}
                className="retro-button bg-card text-foreground border-2 border-border hover:bg-accent/50 text-xs font-black uppercase"
                size="sm"
              >
                <Download size={12} />
                Save
              </Button>
            </div>
            <div className="bg-muted border-2 border-border p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">
                {formatScriptContent(message.scripts?.youtube || message.content)}
              </pre>
            </div>
          </div>
        </div>

        {/* Instagram Script */}
        <div className="retro-card card-hover">
          <div className="p-6">
            <div className="bg-accent-red/10 border-2 border-accent-red p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-red/20 border-2 border-accent-red flex items-center justify-center">
                  <Instagram size={24} className="text-accent-red" />
                </div>
                <h3 className="text-xl font-black text-card-foreground uppercase tracking-wider">Instagram Content</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                onClick={() => handleRegenerateScript('instagram')}
                disabled={regeneratingScript === 'instagram'}
                className="retro-button bg-accent-red text-white hover:bg-accent-red/90 text-xs font-black uppercase"
                size="sm"
              >
                <RefreshCw size={12} className={regeneratingScript === 'instagram' ? 'animate-spin' : ''} />
                {regeneratingScript === 'instagram' ? 'Regen...' : 'Regen'}
              </Button>
              <Button
                onClick={() => copyToClipboard(message.scripts?.instagram || message.content, 'Instagram')}
                className="retro-button bg-card text-foreground border-2 border-border hover:bg-accent/50 text-xs font-black uppercase"
                size="sm"
              >
                <Copy size={12} />
                Copy
              </Button>
              <Button
                onClick={() => downloadScript(message.scripts?.instagram || message.content, 'Instagram')}
                className="retro-button bg-card text-foreground border-2 border-border hover:bg-accent/50 text-xs font-black uppercase"
                size="sm"
              >
                <Download size={12} />
                Save
              </Button>
            </div>
            <div className="bg-muted border-2 border-border p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">
                {formatScriptContent(message.scripts?.instagram || message.content)}
              </pre>
            </div>
          </div>
        </div>

        {/* Blog Script */}
        <div className="retro-card card-hover">
          <div className="p-6">
            <div className="bg-accent-blue/10 border-2 border-accent-blue p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center">
                  <FileText size={24} className="text-accent-blue" />
                </div>
                <h3 className="text-xl font-black text-card-foreground uppercase tracking-wider">Blog Post</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                onClick={() => handleRegenerateScript('blog')}
                disabled={regeneratingScript === 'blog'}
                className="retro-button bg-accent-blue text-white hover:bg-accent-blue/90 text-xs font-black uppercase"
                size="sm"
              >
                <RefreshCw size={12} className={regeneratingScript === 'blog' ? 'animate-spin' : ''} />
                {regeneratingScript === 'blog' ? 'Regen...' : 'Regen'}
              </Button>
              <Button
                onClick={() => copyToClipboard(message.scripts?.blog || message.content, 'Blog')}
                className="retro-button bg-card text-foreground border-2 border-border hover:bg-accent/50 text-xs font-black uppercase"
                size="sm"
              >
                <Copy size={12} />
                Copy
              </Button>
              <Button
                onClick={() => downloadScript(message.scripts?.blog || message.content, 'Blog')}
                className="retro-button bg-card text-foreground border-2 border-border hover:bg-accent/50 text-xs font-black uppercase"
                size="sm"
              >
                <Download size={12} />
                Save
              </Button>
            </div>
            <div className="bg-muted border-2 border-border p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">
                {formatScriptContent(message.scripts?.blog || message.content)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketingPackageCard;