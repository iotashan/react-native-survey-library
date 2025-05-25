import { CSSToRNConverter } from '../CSSToRNConverter';

describe('CSSToRNConverter', () => {
  describe('convertValue', () => {
    it('should convert px values to numbers', () => {
      expect(CSSToRNConverter.convertValue('10px')).toBe(10);
      expect(CSSToRNConverter.convertValue('24px')).toBe(24);
      expect(CSSToRNConverter.convertValue('0px')).toBe(0);
    });

    it('should convert em values', () => {
      expect(CSSToRNConverter.convertValue('1em')).toBe(16);
      expect(CSSToRNConverter.convertValue('1.5em')).toBe(24);
      expect(CSSToRNConverter.convertValue('2em')).toBe(32);
    });

    it('should convert rem values', () => {
      expect(CSSToRNConverter.convertValue('1rem')).toBe(16);
      expect(CSSToRNConverter.convertValue('1.5rem')).toBe(24);
      expect(CSSToRNConverter.convertValue('2rem')).toBe(32);
    });

    it('should convert percentage values', () => {
      expect(CSSToRNConverter.convertValue('50%')).toBe('50%');
      expect(CSSToRNConverter.convertValue('100%')).toBe('100%');
    });

    it('should handle auto value', () => {
      expect(CSSToRNConverter.convertValue('auto')).toBe('auto');
    });

    it('should handle color values', () => {
      expect(CSSToRNConverter.convertValue('#ff0000')).toBe('#ff0000');
      expect(CSSToRNConverter.convertValue('red')).toBe('red');
      expect(CSSToRNConverter.convertValue('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
    });

    it('should handle numeric values', () => {
      expect(CSSToRNConverter.convertValue(10)).toBe(10);
      expect(CSSToRNConverter.convertValue(0)).toBe(0);
    });

    it('should handle other string values', () => {
      expect(CSSToRNConverter.convertValue('solid')).toBe('solid');
      expect(CSSToRNConverter.convertValue('center')).toBe('center');
    });
  });

  describe('convertProperty', () => {
    it('should convert CSS properties to React Native properties', () => {
      expect(CSSToRNConverter.convertProperty('font-size')).toBe('fontSize');
      expect(CSSToRNConverter.convertProperty('background-color')).toBe('backgroundColor');
      expect(CSSToRNConverter.convertProperty('border-radius')).toBe('borderRadius');
      expect(CSSToRNConverter.convertProperty('text-align')).toBe('textAlign');
    });

    it('should handle already camelCase properties', () => {
      expect(CSSToRNConverter.convertProperty('fontSize')).toBe('fontSize');
      expect(CSSToRNConverter.convertProperty('backgroundColor')).toBe('backgroundColor');
    });

    it('should handle single word properties', () => {
      expect(CSSToRNConverter.convertProperty('color')).toBe('color');
      expect(CSSToRNConverter.convertProperty('width')).toBe('width');
      expect(CSSToRNConverter.convertProperty('height')).toBe('height');
    });
  });

  describe('convertStyles', () => {
    it('should convert CSS object to React Native styles', () => {
      const cssStyles = {
        'font-size': '16px',
        'background-color': '#ffffff',
        'padding': '10px',
        'margin-top': '20px',
        'border-radius': '5px'
      };

      const result = CSSToRNConverter.convertStyles(cssStyles);

      expect(result).toEqual({
        fontSize: 16,
        backgroundColor: '#ffffff',
        padding: 10,
        marginTop: 20,
        borderRadius: 5
      });
    });

    it('should handle mixed value types', () => {
      const cssStyles = {
        'width': '100%',
        'height': 50,
        'font-size': '1.5rem',
        'color': 'red',
        'flex': 1
      };

      const result = CSSToRNConverter.convertStyles(cssStyles);

      expect(result).toEqual({
        width: '100%',
        height: 50,
        fontSize: 24,
        color: 'red',
        flex: 1
      });
    });

    it('should handle empty object', () => {
      expect(CSSToRNConverter.convertStyles({})).toEqual({});
    });

    it('should handle null/undefined', () => {
      expect(CSSToRNConverter.convertStyles(null as any)).toEqual({});
      expect(CSSToRNConverter.convertStyles(undefined as any)).toEqual({});
    });
  });

  describe('createStyleSheet', () => {
    it('should create React Native stylesheet from CSS classes', () => {
      const cssClasses = {
        container: {
          'padding': '20px',
          'background-color': '#f0f0f0'
        },
        text: {
          'font-size': '16px',
          'color': '#333333'
        }
      };

      const result = CSSToRNConverter.createStyleSheet(cssClasses);

      expect(result.container).toEqual({
        padding: 20,
        backgroundColor: '#f0f0f0'
      });
      expect(result.text).toEqual({
        fontSize: 16,
        color: '#333333'
      });
    });

    it('should handle nested selectors by flattening', () => {
      const cssClasses = {
        'button': {
          'padding': '10px',
          'background-color': 'blue'
        },
        'button:hover': {
          'background-color': 'darkblue'
        }
      };

      const result = CSSToRNConverter.createStyleSheet(cssClasses);

      expect(result.button).toEqual({
        padding: 10,
        backgroundColor: 'blue'
      });
      expect(result['button:hover']).toEqual({
        backgroundColor: 'darkblue'
      });
    });
  });

  describe('edge cases', () => {
    it('should handle complex border values', () => {
      const cssStyles = {
        'border': '1px solid #000',
        'border-width': '2px',
        'border-style': 'dashed',
        'border-color': 'red'
      };

      const result = CSSToRNConverter.convertStyles(cssStyles);

      expect(result).toEqual({
        border: '1px solid #000',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'red'
      });
    });

    it('should handle transform values', () => {
      const cssStyles = {
        'transform': 'rotate(45deg) scale(1.5)'
      };

      const result = CSSToRNConverter.convertStyles(cssStyles);

      expect(result).toEqual({
        transform: 'rotate(45deg) scale(1.5)'
      });
    });
  });
});