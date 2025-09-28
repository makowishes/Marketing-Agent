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
        <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-4 max-w-3xl shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <User size={14} />
            </div>
            <span className="text-sm font-medium opacity-90">You</span>
          </div>
          <p className="text-base leading-relaxed">{message.content}</p>
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
    <div className="space-y-6">
      {/* Package Header */}
      <Card className="border-border bg-card shadow-soft">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Package size={20} className="text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-card-foreground">MAC - Your Marketing Agent C</CardTitle>
              <div className="flex items-center gap-1 justify-center mt-1">
                <Heart size={12} className="text-accent-red" />
                <span className="text-sm text-muted-foreground">Complete Marketing Package</span>
                <Heart size={12} className="text-accent-red" />
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">🎯 Your Personalized Content Package</h3>
            <p className="text-muted-foreground">Here are your custom scripts crafted with care for your business needs</p>
          </div>
        </CardHeader>
      </Card>

      {/* Scripts Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* YouTube Script */}
        <Card className="border-border bg-card shadow-soft card-hover">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Youtube size={20} className="text-red-600" />
                </div>
                <CardTitle className="text-lg text-card-foreground">YouTube Script</CardTitle>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleRegenerateScript('youtube')}
                disabled={regeneratingScript === 'youtube'}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw size={14} className={regeneratingScript === 'youtube' ? 'animate-spin' : ''} />
                {regeneratingScript === 'youtube' ? 'Regenerating...' : 'Regenerate'}
              </Button>
              <Button
                onClick={() => copyToClipboard(message.scripts?.youtube || message.content, 'YouTube')}
                variant="outline"
                size="sm"
              >
                <Copy size={14} />
              </Button>
              <Button
                onClick={() => downloadScript(message.scripts?.youtube || message.content, 'YouTube')}
                variant="outline"
                size="sm"
              >
                <Download size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-muted rounded-xl p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
                {formatScriptContent(message.scripts?.youtube || message.content)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Instagram Script */}
        <Card className="border-border bg-card shadow-soft card-hover">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                  <Instagram size={20} className="text-pink-600" />
                </div>
                <CardTitle className="text-lg text-card-foreground">Instagram Content</CardTitle>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleRegenerateScript('instagram')}
                disabled={regeneratingScript === 'instagram'}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw size={14} className={regeneratingScript === 'instagram' ? 'animate-spin' : ''} />
                {regeneratingScript === 'instagram' ? 'Regenerating...' : 'Regenerate'}
              </Button>
              <Button
                onClick={() => copyToClipboard(message.scripts?.instagram || message.content, 'Instagram')}
                variant="outline"
                size="sm"
              >
                <Copy size={14} />
              </Button>
              <Button
                onClick={() => downloadScript(message.scripts?.instagram || message.content, 'Instagram')}
                variant="outline"
                size="sm"
              >
                <Download size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-muted rounded-xl p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
                {formatScriptContent(message.scripts?.instagram || message.content)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Blog Script */}
        <Card className="border-border bg-card shadow-soft card-hover">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <CardTitle className="text-lg text-card-foreground">Blog Post</CardTitle>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleRegenerateScript('blog')}
                disabled={regeneratingScript === 'blog'}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw size={14} className={regeneratingScript === 'blog' ? 'animate-spin' : ''} />
                {regeneratingScript === 'blog' ? 'Regenerating...' : 'Regenerate'}
              </Button>
              <Button
                onClick={() => copyToClipboard(message.scripts?.blog || message.content, 'Blog')}
                variant="outline"
                size="sm"
              >
                <Copy size={14} />
              </Button>
              <Button
                onClick={() => downloadScript(message.scripts?.blog || message.content, 'Blog')}
                variant="outline"
                size="sm"
              >
                <Download size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-muted rounded-xl p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans">
                {formatScriptContent(message.scripts?.blog || message.content)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MarketingPackageCard;