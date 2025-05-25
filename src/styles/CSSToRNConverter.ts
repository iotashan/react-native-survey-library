import { Platform } from 'react-native';

export class CSSToRNConverter {
  // Simple value conversion (no theme needed)
  static convertValue(value: any): any {
    if (typeof value === 'string') {
      // Handle px units
      const pxMatch = value.match(/^(\d+(?:\.\d+)?)px$/);
      if (pxMatch) {
        return parseFloat(pxMatch[1]);
      }
      
      // Handle rem units
      const remMatch = value.match(/^(\d+(?:\.\d+)?)rem$/);
      if (remMatch) {
        return parseFloat(remMatch[1]) * 16;
      }
      
      // Handle em units
      const emMatch = value.match(/^(\d+(?:\.\d+)?)em$/);
      if (emMatch) {
        return parseFloat(emMatch[1]) * 16;
      }
      
      // Return as-is for percentages, colors, etc.
      return value;
    }
    
    return value;
  }
  
  // Convert CSS property name to React Native property name
  static convertProperty(property: string): string {
    // Already camelCase
    if (!property.includes('-')) {
      return property;
    }
    
    // Convert kebab-case to camelCase
    return property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }
  
  // Convert a CSS styles object to React Native styles
  static convertStyles(styles: any): any {
    if (!styles || typeof styles !== 'object') {
      return {};
    }
    
    const converted: any = {};
    
    Object.entries(styles).forEach(([key, value]) => {
      const rnKey = this.convertProperty(key);
      converted[rnKey] = this.convertValue(value);
    });
    
    return converted;
  }
  
  // Create a React Native StyleSheet from CSS classes
  static createStyleSheet(cssClasses: Record<string, any>): any {
    const converted: Record<string, any> = {};
    
    Object.entries(cssClasses).forEach(([className, styles]) => {
      converted[className] = this.convertStyles(styles);
    });
    
    return converted;
  }
  static convertCSSClasses(cssClasses: any, theme: any): Record<string, any> {
    const styles: Record<string, any> = {};
    
    Object.keys(cssClasses).forEach(key => {
      const className = cssClasses[key];
      
      // Handle composite classes (e.g., "sd-input sd-input--error")
      if (className && className.includes(' ')) {
        const classes = className.split(' ').filter(Boolean);
        styles[key] = this.mergeStyles(classes.map(c => this.getStyleForClass(c, theme)));
      } else if (className) {
        styles[key] = this.getStyleForClass(className, theme);
      }
    });
    
    return styles;
  }
  
  private static getStyleForClass(className: string, theme: any): any {
    // Map specific CSS class patterns to RN styles
    const mappings: Record<string, any> = {
      // Root and container styles
      'sv_main': theme.components.survey.container,
      'sv_container': theme.components.survey.container,
      'sv_body': theme.components.survey.body,
      'sv_body__page': theme.components.survey.body,
      
      // Question styles
      'sv_qstn': theme.components.question.root,
      'sv_q_title': theme.components.question.title,
      'sv_q_title_required': theme.components.question.requiredText,
      'sv_q_description': theme.components.question.description,
      'sv_q_erbox': theme.components.question.errorText,
      
      // Input styles
      'sv_q_text_root': theme.components.input.default,
      'sv_q_input': theme.components.input.default,
      'sv_q_input--error': theme.components.input.error,
      'sv_q_input--disabled': theme.components.input.disabled,
      'sv_q_input--focused': theme.components.input.focused,
      
      // Choice styles
      'sv_q_radiogroup': { marginVertical: 8 },
      'sv_q_radiogroup_control': theme.components.choice.control,
      'sv_q_checkbox': { marginVertical: 8 },
      'sv_q_checkbox_control': { ...theme.components.choice.control, ...theme.components.choice.checkbox },
      'sv_q_radiogroup_control_label': theme.components.choice.label,
      'sv_q_checkbox_control_label': theme.components.choice.label,
      
      // Button styles
      'sv_nav_btn': theme.components.button.default,
      'sv_nav_btn--action': theme.components.button.default,
      'sv_nav_btn--navigation': theme.components.button.navigation,
      'sv_prev_btn': theme.components.button.navigation,
      'sv_next_btn': theme.components.button.default,
      'sv_complete_btn': theme.components.button.default,
      
      // Panel styles
      'sv_p_root': theme.components.panel.container,
      'sv_p_title': theme.components.panel.title,
      'sv_p_container': theme.components.panel.body,
      
      // Progress styles
      'sv_progress': theme.components.progress.container,
      'sv_progress-bar': theme.components.progress.bar,
      'sv_progress-text': theme.components.progress.text,
      
      // Rating styles
      'sv_q_rating': theme.components.rating.container,
      'sv_q_rating_item': theme.components.rating.item,
      'sv_q_rating_item--selected': theme.components.rating.itemSelected,
      
      // Matrix styles
      'sv_matrix': theme.components.matrix.container,
      'sv_matrix_header': theme.components.matrix.header,
      'sv_matrix_cell': theme.components.matrix.cell,
      'sv_matrix_cell_header': theme.components.matrix.headerCell,
      
      // SurveyJS specific classes
      'sd-root': theme.components.survey.container,
      'sd-container': theme.components.survey.container,
      'sd-question': theme.components.question.root,
      'sd-question__title': theme.components.question.title,
      'sd-question__description': theme.components.question.description,
      'sd-question__erbox': theme.components.question.errorText,
      'sd-input': theme.components.input.default,
      'sd-btn': theme.components.button.default,
      'sd-btn--action': theme.components.button.default,
      'sd-btn--navigation': theme.components.button.navigation,
    };
    
    return mappings[className] || {};
  }
  
  private static mergeStyles(styles: any[]): any {
    return Object.assign({}, ...styles.filter(Boolean));
  }
  
  static convertValueWithTheme(value: any, theme: any): any {
    if (typeof value === 'string') {
      // Handle CSS variables
      if (value.startsWith('var(')) {
        const varName = value.match(/var\((--[^)]+)\)/)?.[1];
        if (varName && theme.variables[varName]) {
          return theme.variables[varName];
        }
      }
      
      // Handle rem/em units
      const remMatch = value.match(/^(\d+(?:\.\d+)?)rem$/);
      if (remMatch) {
        return parseFloat(remMatch[1]) * 16;
      }
      
      const emMatch = value.match(/^(\d+(?:\.\d+)?)em$/);
      if (emMatch) {
        return parseFloat(emMatch[1]) * 16;
      }
      
      // Handle px units
      const pxMatch = value.match(/^(\d+)px$/);
      if (pxMatch) {
        return parseInt(pxMatch[1], 10);
      }
      
      // Handle percentage for specific properties
      if (value.endsWith('%')) {
        return value;
      }
    }
    
    return value;
  }
  
  static convertInlineStyle(style: any, theme: any): any {
    if (!style) return {};
    
    const converted: any = {};
    
    Object.keys(style).forEach(key => {
      // Convert CSS property names to React Native
      let rnKey = key;
      
      // Handle specific conversions
      switch (key) {
        case 'backgroundColor':
        case 'borderColor':
        case 'color':
          converted[rnKey] = this.convertValueWithTheme(style[key], theme);
          break;
        case 'fontSize':
        case 'borderRadius':
        case 'borderWidth':
        case 'padding':
        case 'paddingTop':
        case 'paddingBottom':
        case 'paddingLeft':
        case 'paddingRight':
        case 'margin':
        case 'marginTop':
        case 'marginBottom':
        case 'marginLeft':
        case 'marginRight':
          converted[rnKey] = this.convertValueWithTheme(style[key], theme);
          break;
        case 'fontWeight':
          // Ensure fontWeight is a string in React Native
          converted[rnKey] = String(style[key]);
          break;
        default:
          converted[rnKey] = style[key];
      }
    });
    
    return converted;
  }
}