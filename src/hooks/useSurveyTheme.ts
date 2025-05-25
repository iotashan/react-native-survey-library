import { useMemo } from 'react';
import type { Model } from 'survey-core';
import { CSSToRNConverter } from '../styles/CSSToRNConverter';

interface Theme {
  colors: {
    primary: string;
    background: string;
    text: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    titleSize: number;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  borders: {
    radius: number;
    width: number;
    color: string;
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: '#18a689',
    background: '#f7f7f7',
    text: '#333333',
    error: '#e60a3e'
  },
  typography: {
    fontFamily: 'System',
    fontSize: 16,
    titleSize: 20
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24
  },
  borders: {
    radius: 4,
    width: 1,
    color: '#e0e0e0'
  }
};

export function useSurveyTheme(model?: Model): Theme {
  return useMemo(() => {
    const theme = {
      colors: { ...defaultTheme.colors },
      typography: { ...defaultTheme.typography },
      spacing: { ...defaultTheme.spacing },
      borders: { ...defaultTheme.borders }
    };
    
    if (model?.themeVariables) {
      const vars = model.themeVariables;
      
      // Map theme variables to theme properties
      if (vars['--primary-color']) {
        theme.colors.primary = vars['--primary-color'];
      }
      if (vars['--background-color']) {
        theme.colors.background = vars['--background-color'];
      }
      if (vars['--text-color']) {
        theme.colors.text = vars['--text-color'];
      }
      if (vars['--error-color']) {
        theme.colors.error = vars['--error-color'];
      }
      
      // Typography
      if (vars['--font-family']) {
        theme.typography.fontFamily = vars['--font-family'];
      }
      if (vars['--font-size']) {
        const fontSize = CSSToRNConverter.convertValue(vars['--font-size']);
        if (typeof fontSize === 'number') {
          theme.typography.fontSize = fontSize;
        }
      }
      if (vars['--title-font-size']) {
        const titleSize = CSSToRNConverter.convertValue(vars['--title-font-size']);
        if (typeof titleSize === 'number') {
          theme.typography.titleSize = titleSize;
        }
      }
      
      // Spacing
      if (vars['--spacing-small']) {
        const small = CSSToRNConverter.convertValue(vars['--spacing-small']);
        if (typeof small === 'number') {
          theme.spacing.small = small;
        }
      }
      if (vars['--spacing-medium']) {
        const medium = CSSToRNConverter.convertValue(vars['--spacing-medium']);
        if (typeof medium === 'number') {
          theme.spacing.medium = medium;
        }
      }
      if (vars['--spacing-large']) {
        const large = CSSToRNConverter.convertValue(vars['--spacing-large']);
        if (typeof large === 'number') {
          theme.spacing.large = large;
        }
      }
      
      // Borders
      if (vars['--border-radius']) {
        const radius = CSSToRNConverter.convertValue(vars['--border-radius']);
        if (typeof radius === 'number') {
          theme.borders.radius = radius;
        }
      }
      if (vars['--border-width']) {
        const width = CSSToRNConverter.convertValue(vars['--border-width']);
        if (typeof width === 'number') {
          theme.borders.width = width;
        }
      }
      if (vars['--border-color']) {
        theme.borders.color = vars['--border-color'];
      }
    }
    
    return theme;
  }, [model?.themeVariables]);
}