import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DefaultTheme } from './themes/DefaultTheme';
import { CSSClassMapper } from './CSSClassMapper';

interface ThemeContextType {
  theme: typeof DefaultTheme;
  setTheme: (theme: any) => void;
  switchTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: any;
  themes?: Record<string, any>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = DefaultTheme,
  themes = { default: DefaultTheme }
}) => {
  const [currentTheme, setCurrentTheme] = useState(theme);

  const setTheme = (newTheme: any) => {
    setCurrentTheme(newTheme);
    // Clear style cache when theme changes
    CSSClassMapper.clearCache();
  };

  const switchTheme = (themeName: string) => {
    if (themes[themeName]) {
      setTheme(themes[themeName]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};