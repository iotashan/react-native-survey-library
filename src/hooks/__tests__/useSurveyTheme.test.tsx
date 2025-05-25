import { renderHook } from '@testing-library/react-native';
import { useSurveyTheme } from '../useSurveyTheme';
import { CSSClassMapper } from '../../styles/CSSClassMapper';
import { Model } from 'survey-core';
import { createMockSurveyModel } from '../../__tests__/test-utils';

describe('useSurveyTheme Hook', () => {
  let surveyModel: Model;

  beforeEach(() => {
    CSSClassMapper.clear();
    surveyModel = createMockSurveyModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return theme object with colors', () => {
    const { result } = renderHook(() => useSurveyTheme());

    expect(result.current.colors).toBeDefined();
    expect(result.current.colors.primary).toBeDefined();
    expect(result.current.colors.background).toBeDefined();
    expect(result.current.colors.text).toBeDefined();
    expect(result.current.colors.error).toBeDefined();
  });

  it('should return theme object with typography', () => {
    const { result } = renderHook(() => useSurveyTheme());

    expect(result.current.typography).toBeDefined();
    expect(result.current.typography.fontFamily).toBeDefined();
    expect(result.current.typography.fontSize).toBeDefined();
    expect(result.current.typography.titleSize).toBeDefined();
  });

  it('should return theme object with spacing', () => {
    const { result } = renderHook(() => useSurveyTheme());

    expect(result.current.spacing).toBeDefined();
    expect(result.current.spacing.small).toBeDefined();
    expect(result.current.spacing.medium).toBeDefined();
    expect(result.current.spacing.large).toBeDefined();
  });

  it('should return theme object with borders', () => {
    const { result } = renderHook(() => useSurveyTheme());

    expect(result.current.borders).toBeDefined();
    expect(result.current.borders.radius).toBeDefined();
    expect(result.current.borders.width).toBeDefined();
    expect(result.current.borders.color).toBeDefined();
  });

  it('should merge survey theme data when provided', () => {
    surveyModel.themeVariables = {
      '--primary-color': '#ff0000',
      '--background-color': '#ffffff',
      '--text-color': '#000000'
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    expect(result.current.colors.primary).toBe('#ff0000');
    expect(result.current.colors.background).toBe('#ffffff');
    expect(result.current.colors.text).toBe('#000000');
  });

  it('should handle survey font variables', () => {
    surveyModel.themeVariables = {
      '--font-family': 'Arial, sans-serif',
      '--font-size': '18px',
      '--title-font-size': '24px'
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    expect(result.current.typography.fontFamily).toBe('Arial, sans-serif');
    expect(result.current.typography.fontSize).toBe(18);
    expect(result.current.typography.titleSize).toBe(24);
  });

  it('should handle survey spacing variables', () => {
    surveyModel.themeVariables = {
      '--spacing-small': '4px',
      '--spacing-medium': '12px',
      '--spacing-large': '24px'
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    expect(result.current.spacing.small).toBe(4);
    expect(result.current.spacing.medium).toBe(12);
    expect(result.current.spacing.large).toBe(24);
  });

  it('should handle survey border variables', () => {
    surveyModel.themeVariables = {
      '--border-radius': '8px',
      '--border-width': '2px',
      '--border-color': '#cccccc'
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    expect(result.current.borders.radius).toBe(8);
    expect(result.current.borders.width).toBe(2);
    expect(result.current.borders.color).toBe('#cccccc');
  });

  it('should use default values when no survey model provided', () => {
    const { result } = renderHook(() => useSurveyTheme());

    // Check default values
    expect(result.current.colors.primary).toBe('#18a689');
    expect(result.current.colors.background).toBe('#f7f7f7');
    expect(result.current.typography.fontSize).toBe(16);
    expect(result.current.spacing.medium).toBe(16);
  });

  it('should update when survey theme changes', () => {
    const { result, rerender } = renderHook(
      ({ model }) => useSurveyTheme(model),
      { initialProps: { model: surveyModel } }
    );

    const initialPrimary = result.current.colors.primary;

    // Update theme variables
    surveyModel.themeVariables = {
      '--primary-color': '#00ff00'
    };

    rerender({ model: surveyModel });

    expect(result.current.colors.primary).toBe('#00ff00');
    expect(result.current.colors.primary).not.toBe(initialPrimary);
  });

  it('should convert CSS variable names to theme properties', () => {
    surveyModel.themeVariables = {
      '--primary-color': '#123456',
      '--secondary-color': '#654321',
      '--error-color': '#ff0000',
      '--success-color': '#00ff00'
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    expect(result.current.colors.primary).toBe('#123456');
    expect(result.current.colors.error).toBe('#ff0000');
  });

  it('should handle malformed theme values gracefully', () => {
    surveyModel.themeVariables = {
      '--font-size': 'invalid',
      '--spacing-small': 'not-a-number',
      '--border-width': null as any
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    // Should fall back to defaults
    expect(result.current.typography.fontSize).toBe(16);
    expect(result.current.spacing.small).toBe(8);
    expect(result.current.borders.width).toBe(1);
  });

  it('should apply theme to question styles', () => {
    const theme = {
      colors: { primary: '#ff0000', text: '#000000' },
      typography: { fontSize: 18 },
      spacing: { medium: 20 },
      borders: { radius: 10 }
    };

    const { result } = renderHook(() => useSurveyTheme(surveyModel));

    // Create question styles based on theme
    const questionStyles = {
      container: {
        padding: result.current.spacing.medium,
        borderRadius: result.current.borders.radius
      },
      title: {
        fontSize: result.current.typography.titleSize,
        color: result.current.colors.text
      }
    };

    expect(questionStyles.container.padding).toBeDefined();
    expect(questionStyles.container.borderRadius).toBeDefined();
    expect(questionStyles.title.fontSize).toBeDefined();
    expect(questionStyles.title.color).toBeDefined();
  });
});