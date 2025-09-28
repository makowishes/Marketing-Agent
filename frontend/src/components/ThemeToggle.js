import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`h-10 w-10 rounded-xl border-border bg-card hover:bg-muted transition-colors ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-accent-yellow" />
      )}
    </Button>
  );
}

export default ThemeToggle;