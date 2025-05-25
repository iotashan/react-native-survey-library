# CSS to React Native Styling Strategy

## Overview

SurveyJS heavily relies on CSS classes for theming and styling. To maintain compatibility and ease of customization in React Native, we need a systematic approach to convert CSS patterns to React Native styles.

## Core Strategy: CSS Classes to Style Objects

### 1. Create a CSS Class Mapping System

```typescript
// src/styles/CSSClassMapper.ts
export class CSSClassMapper {
  private static styleMap: Map<string, any> = new Map();
  
  static registerStyles(cssClasses: Record<string, any>, styles: Record<string, any>) {
    Object.keys(cssClasses).forEach(key => {
      this.styleMap.set(cssClasses[key], styles[key]);
    });
  }
  
  static getStyle(className: string): any {
    return this.styleMap.get(className) || {};
  }
  
  static getStyles(classNames: string[]): any[] {
    return classNames.map(cn => this.getStyle(cn)).filter(Boolean);
  }
}
```

### 2. Implement Theme System Matching SurveyJS

```typescript
// src/styles/themes/DefaultTheme.ts
export const DefaultTheme = {
  // Base theme variables (matching CSS variables)
  variables: {
    '--primary-color': '#19b394',
    '--secondary-color': '#ff6771',
    '--background-color': '#f3f3f3',
    '--foreground-color': '#161616',
    '--border-color': '#d6d6d6',
    '--text-color': '#161616',
    '--disabled-color': '#161616',
    '--disabled-background-color': '#f3f3f3',
    '--error-color': '#e60a3e',
    '--success-color': '#19b394',
    '--font-family': 'System',
    '--font-size': 16,
    '--line-height': 24,
    '--panel-spacing': 16,
    '--question-spacing': 12,
  },
  
  // Component-specific styles
  components: {
    root: {
      backgroundColor: 'var(--background-color)',
      flex: 1,
    },
    question: {
      root: {
        marginBottom: 'var(--question-spacing)',
      },
      title: {
        fontSize: 'var(--font-size)',
        color: 'var(--text-color)',
        marginBottom: 8,
      },
      description: {
        fontSize: 14,
        color: 'var(--text-color)',
        opacity: 0.7,
        marginBottom: 8,
      },
      errorText: {
        color: 'var(--error-color)',
        fontSize: 14,
        marginTop: 4,
      },
    },
    input: {
      default: {
        borderWidth: 1,
        borderColor: 'var(--border-color)',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        fontSize: 'var(--font-size)',
        color: 'var(--text-color)',
      },
      focused: {
        borderColor: 'var(--primary-color)',
      },
      error: {
        borderColor: 'var(--error-color)',
      },
      disabled: {
        backgroundColor: 'var(--disabled-background-color)',
        color: 'var(--disabled-color)',
      },
    },
  },
};
```

### 3. CSS Classes to React Native Styles Converter

```typescript
// src/styles/CSSToRNConverter.ts
export class CSSToRNConverter {
  static convertCSSClasses(cssClasses: any, theme: any): Record<string, any> {
    const styles: Record<string, any> = {};
    
    // Map common CSS patterns to RN
    Object.keys(cssClasses).forEach(key => {
      const className = cssClasses[key];
      
      // Handle composite classes (e.g., "sd-input sd-input--error")
      if (className.includes(' ')) {
        const classes = className.split(' ');
        styles[key] = this.mergeStyles(classes.map(c => this.getStyleForClass(c, theme)));
      } else {
        styles[key] = this.getStyleForClass(className, theme);
      }
    });
    
    return styles;
  }
  
  private static getStyleForClass(className: string, theme: any): any {
    // Map specific CSS class patterns to RN styles
    const mappings: Record<string, any> = {
      // Input styles
      'sd-input': theme.components.input.default,
      'sd-input--error': theme.components.input.error,
      'sd-input--disabled': theme.components.input.disabled,
      
      // Question styles
      'sd-question': theme.components.question.root,
      'sd-question__title': theme.components.question.title,
      'sd-question__description': theme.components.question.description,
      'sd-question__erbox': theme.components.question.errorText,
      
      // Container styles
      'sd-container': {
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      'sd-row': {
        flexDirection: 'row',
      },
      'sd-column': {
        flex: 1,
      },
      
      // Button styles
      'sd-btn': {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: theme.variables['--primary-color'],
      },
      'sd-btn--action': {
        backgroundColor: theme.variables['--primary-color'],
      },
      'sd-btn--navigation': {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.variables['--primary-color'],
      },
    };
    
    return mappings[className] || {};
  }
  
  private static mergeStyles(styles: any[]): any {
    return Object.assign({}, ...styles);
  }
}
```

### 4. Dynamic Style Resolution

```typescript
// src/styles/DynamicStyles.ts
export class DynamicStyles {
  private static cache = new Map<string, any>();
  
  static resolve(expression: string, variables: Record<string, any>): any {
    if (this.cache.has(expression)) {
      return this.cache.get(expression);
    }
    
    // Replace CSS variables with actual values
    let result = expression;
    Object.keys(variables).forEach(varName => {
      result = result.replace(new RegExp(`var\\(${varName}\\)`, 'g'), variables[varName]);
    });
    
    // Convert CSS units to RN
    result = this.convertUnits(result);
    
    // Parse numeric values
    if (!isNaN(Number(result))) {
      result = Number(result);
    }
    
    this.cache.set(expression, result);
    return result;
  }
  
  private static convertUnits(value: string): string {
    // Convert rem to pixels (assuming 1rem = 16px)
    value = value.replace(/(\d+(?:\.\d+)?)rem/g, (match, num) => {
      return String(parseFloat(num) * 16);
    });
    
    // Remove px units (RN uses numbers)
    value = value.replace(/(\d+)px/g, '$1');
    
    return value;
  }
}
```

### 5. Hook for Component Styling

```typescript
// src/hooks/useQuestionStyles.ts
export function useQuestionStyles(question: Question) {
  const theme = useTheme();
  const [styles, setStyles] = useState<any>({});
  
  useEffect(() => {
    // Get CSS classes from the model
    const cssClasses = question.cssClasses;
    
    // Convert to RN styles
    const convertedStyles = CSSToRNConverter.convertCSSClasses(cssClasses, theme);
    
    // Apply dynamic styles
    const resolvedStyles = Object.keys(convertedStyles).reduce((acc, key) => {
      acc[key] = StyleSheet.create({
        style: DynamicStyles.resolve(convertedStyles[key], theme.variables)
      }).style;
      return acc;
    }, {} as any);
    
    setStyles(resolvedStyles);
  }, [question.cssClasses, theme]);
  
  return styles;
}
```

### 6. Responsive Styles (like CSS Media Queries)

```typescript
// src/styles/ResponsiveStyles.ts
import { Dimensions } from 'react-native';

export class ResponsiveStyles {
  static breakpoints = {
    small: 480,
    medium: 768,
    large: 1024,
  };
  
  static select(styles: {
    base?: any;
    small?: any;
    medium?: any;
    large?: any;
  }): any {
    const { width } = Dimensions.get('window');
    
    let selectedStyle = styles.base || {};
    
    if (width >= this.breakpoints.small && styles.small) {
      selectedStyle = { ...selectedStyle, ...styles.small };
    }
    if (width >= this.breakpoints.medium && styles.medium) {
      selectedStyle = { ...selectedStyle, ...styles.medium };
    }
    if (width >= this.breakpoints.large && styles.large) {
      selectedStyle = { ...selectedStyle, ...styles.large };
    }
    
    return selectedStyle;
  }
}
```

### 7. CSS Animation to RN Animated

```typescript
// src/styles/Animations.ts
import { Animated, Easing } from 'react-native';

export class Animations {
  static fadeIn(duration = 300) {
    const opacity = new Animated.Value(0);
    
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
    
    return { opacity };
  }
  
  static slideIn(from: 'left' | 'right' | 'top' | 'bottom', duration = 300) {
    const position = new Animated.Value(from === 'left' || from === 'right' ? 100 : 0);
    
    Animated.timing(position, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    
    const transform = from === 'left' 
      ? [{ translateX: position }]
      : from === 'right'
      ? [{ translateX: Animated.multiply(position, -1) }]
      : from === 'top'
      ? [{ translateY: position }]
      : [{ translateY: Animated.multiply(position, -1) }];
    
    return { transform };
  }
}
```

## Implementation Example

```typescript
// Component using the CSS mapping system
export class SurveyQuestionText extends SurveyQuestionUncontrolledElement<QuestionTextModel> {
  render() {
    const styles = useQuestionStyles(this.question);
    
    return (
      <View style={styles.root}>
        <Text style={styles.title}>{this.question.title}</Text>
        {this.question.description && (
          <Text style={styles.description}>{this.question.description}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            this.question.hasError && styles.inputError,
            this.state.isFocused && styles.inputFocused,
          ]}
          value={this.question.value}
          onChangeText={this.updateValue}
        />
        {this.question.hasError && (
          <Text style={styles.errorText}>{this.question.errorText}</Text>
        )}
      </View>
    );
  }
}
```

## CSS Features Mapping

| CSS Feature | React Native Solution |
|-------------|---------------------|
| CSS Variables | Theme variables object |
| Media Queries | ResponsiveStyles helper |
| Pseudo-classes (:hover, :focus) | State-based styles |
| Transitions | Animated API |
| Flexbox | Native support |
| Grid | Custom grid component |
| calc() | JavaScript calculations |
| rem/em units | Pixel conversion |
| !important | Style array ordering |
| Cascading | Style merging |
| ::before/::after | Additional View components |

## Theme Switching

```typescript
// src/contexts/ThemeContext.tsx
export const ThemeProvider = ({ children, theme = 'default' }) => {
  const [currentTheme, setCurrentTheme] = useState(themes[theme]);
  
  const switchTheme = (themeName: string) => {
    setCurrentTheme(themes[themeName]);
    // Update all registered styles
    CSSClassMapper.clearCache();
  };
  
  return (
    <ThemeContext.Provider value={{ theme: currentTheme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Benefits of This Approach

1. **Maintains SurveyJS Compatibility** - Uses the same cssClasses structure
2. **Theme Support** - Easy to switch between themes
3. **Performance** - Styles are cached and optimized
4. **Flexibility** - Can override any style
5. **Developer Experience** - Familiar CSS-like API
6. **Type Safety** - Full TypeScript support

This system allows the React Native module to work as closely as possible to the CSS-based React version while leveraging React Native's styling capabilities.