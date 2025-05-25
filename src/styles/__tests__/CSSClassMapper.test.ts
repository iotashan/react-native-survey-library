import { CSSClassMapper } from '../CSSClassMapper';

describe('CSSClassMapper', () => {
  beforeEach(() => {
    // Clear the style map before each test
    CSSClassMapper.clear();
  });

  describe('registerStyle', () => {
    it('should register a single style', () => {
      const style = { backgroundColor: 'red' };
      CSSClassMapper.registerStyle('test-class', style);
      
      expect(CSSClassMapper.getStyle('test-class')).toEqual(style);
    });

    it('should override existing style', () => {
      const style1 = { backgroundColor: 'red' };
      const style2 = { backgroundColor: 'blue' };
      
      CSSClassMapper.registerStyle('test-class', style1);
      CSSClassMapper.registerStyle('test-class', style2);
      
      expect(CSSClassMapper.getStyle('test-class')).toEqual(style2);
    });
  });

  describe('registerStyles', () => {
    it('should register multiple styles', () => {
      const styles = {
        'class1': { backgroundColor: 'red' },
        'class2': { color: 'blue' },
        'class3': { fontSize: 16 }
      };
      
      CSSClassMapper.registerStyles(styles);
      
      expect(CSSClassMapper.getStyle('class1')).toEqual(styles.class1);
      expect(CSSClassMapper.getStyle('class2')).toEqual(styles.class2);
      expect(CSSClassMapper.getStyle('class3')).toEqual(styles.class3);
    });
  });

  describe('getStyle', () => {
    it('should return empty object for non-existent class', () => {
      expect(CSSClassMapper.getStyle('non-existent')).toEqual({});
    });

    it('should return empty object for empty className', () => {
      expect(CSSClassMapper.getStyle('')).toEqual({});
    });

    it('should return empty object for null/undefined', () => {
      expect(CSSClassMapper.getStyle(null as any)).toEqual({});
      expect(CSSClassMapper.getStyle(undefined as any)).toEqual({});
    });

    it('should handle space-separated class names', () => {
      CSSClassMapper.registerStyles({
        'class1': { backgroundColor: 'red', padding: 10 },
        'class2': { color: 'blue', padding: 20 },
        'class3': { fontSize: 16 }
      });
      
      const result = CSSClassMapper.getStyle('class1 class2 class3');
      
      expect(result).toEqual({
        backgroundColor: 'red',
        color: 'blue',
        padding: 20, // class2 overrides class1
        fontSize: 16
      });
    });

    it('should handle extra spaces in class names', () => {
      CSSClassMapper.registerStyles({
        'class1': { backgroundColor: 'red' },
        'class2': { color: 'blue' }
      });
      
      const result = CSSClassMapper.getStyle('  class1   class2  ');
      
      expect(result).toEqual({
        backgroundColor: 'red',
        color: 'blue'
      });
    });

    it('should use cache for repeated calls', () => {
      CSSClassMapper.registerStyles({
        'class1': { backgroundColor: 'red' },
        'class2': { color: 'blue' }
      });
      
      // First call - computes and caches
      const result1 = CSSClassMapper.getStyle('class1 class2');
      
      // Second call - should use cache
      const result2 = CSSClassMapper.getStyle('class1 class2');
      
      expect(result1).toBe(result2); // Same object reference
    });
  });

  describe('mergeStyles', () => {
    it('should merge multiple style objects', () => {
      const styles = [
        { backgroundColor: 'red', padding: 10 },
        { color: 'blue', padding: 20 },
        { fontSize: 16 }
      ];
      
      const result = CSSClassMapper.mergeStyles(styles);
      
      expect(result).toEqual({
        backgroundColor: 'red',
        color: 'blue',
        padding: 20, // Later value overrides
        fontSize: 16
      });
    });

    it('should handle empty array', () => {
      expect(CSSClassMapper.mergeStyles([])).toEqual({});
    });

    it('should handle null/undefined values', () => {
      const styles = [
        { backgroundColor: 'red' },
        null,
        undefined,
        { color: 'blue' }
      ];
      
      const result = CSSClassMapper.mergeStyles(styles as any);
      
      expect(result).toEqual({
        backgroundColor: 'red',
        color: 'blue'
      });
    });
  });

  describe('clear', () => {
    it('should clear all registered styles and cache', () => {
      CSSClassMapper.registerStyles({
        'class1': { backgroundColor: 'red' },
        'class2': { color: 'blue' }
      });
      
      // Get style to populate cache
      CSSClassMapper.getStyle('class1 class2');
      
      CSSClassMapper.clear();
      
      expect(CSSClassMapper.getStyle('class1')).toEqual({});
      expect(CSSClassMapper.getStyle('class2')).toEqual({});
      expect(CSSClassMapper.getStyle('class1 class2')).toEqual({});
    });
  });
});