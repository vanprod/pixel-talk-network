
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme} 
      className="retro-button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="inline mr-2" />
      ) : (
        <Moon size={18} className="inline mr-2" />
      )}
      {theme === 'dark' ? 'LIGHT' : 'DARK'}
    </button>
  );
}
