import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
