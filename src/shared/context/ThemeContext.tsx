'use client';

import type React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import { z } from 'zod';

const themeSchema = z.enum(['light', 'dark']);
type Theme = z.infer<typeof themeSchema>;

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const parsed = themeSchema.safeParse(localStorage.getItem('theme'));
  return parsed.success ? parsed.data : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
