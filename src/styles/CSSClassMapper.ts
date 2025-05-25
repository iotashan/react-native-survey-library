import { StyleSheet } from 'react-native';

export class CSSClassMapper {
  private static styleMap: Map<string, any> = new Map();
  private static styleSheets: Map<string, any> = new Map();
  private static cache: Map<string, any> = new Map();

  static registerStyle(className: string, style: any) {
    this.styleMap.set(className, style);
  }

  static registerStyles(styles: Record<string, any>) {
    Object.entries(styles).forEach(([className, style]) => {
      this.registerStyle(className, style);
    });
  }

  static getStyle(className: string): any {
    if (!className || typeof className !== 'string') return {};
    
    // Check cache first
    if (this.cache.has(className)) {
      return this.cache.get(className);
    }
    
    // Handle composite classes (e.g., "sd-input sd-input--error")
    if (className.includes(' ')) {
      const classes = className.split(' ').filter(Boolean);
      const merged = this.mergeStyles(classes.map(cn => this.getStyle(cn)));
      this.cache.set(className, merged);
      return merged;
    }
    
    return this.styleMap.get(className) || {};
  }

  static getStyles(classNames: string[]): any[] {
    return classNames.map(cn => this.getStyle(cn)).filter(Boolean);
  }

  static mergeStyles(styles: any[]): any {
    return Object.assign({}, ...styles.filter(Boolean));
  }

  static createStyleSheet(name: string, styles: Record<string, any>): any {
    if (!this.styleSheets.has(name)) {
      this.styleSheets.set(name, StyleSheet.create(styles));
    }
    return this.styleSheets.get(name);
  }

  static clear() {
    this.styleMap.clear();
    this.styleSheets.clear();
    this.cache.clear();
  }

  static getComputedStyle(cssClasses: any, theme: any): Record<string, any> {
    const computedStyles: Record<string, any> = {};
    
    Object.keys(cssClasses).forEach(key => {
      const className = cssClasses[key];
      if (className) {
        computedStyles[key] = this.getStyle(className);
      }
    });
    
    return computedStyles;
  }
}