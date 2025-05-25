// Main entry point for react-native-survey-library

// Import and register all components
import './registerComponents';

export { Survey } from './components/containers/Survey';
export { SurveyPage } from './components/containers/Page';
export { SurveyPanel } from './components/containers/Panel';

// Export types
export type { ISurveyCreator } from './types/survey-types';

// Export factories for custom components
export { ReactNativeQuestionFactory } from './factories/ReactNativeQuestionFactory';
export { ReactNativeElementFactory } from './factories/ReactNativeElementFactory';
export { ReactNativeSurveyCreator } from './ReactNativeSurveyCreator';

// Export hooks
export { useQuestionStyles } from './hooks/useQuestionStyles';
export { useSurveyTheme } from './hooks/useSurveyTheme';

// Export theme utilities
export { ThemeProvider } from './styles/ThemeContext';
export { DefaultTheme } from './styles/themes/DefaultTheme';
export { CSSClassMapper } from './styles/CSSClassMapper';

// Re-export survey-core types for convenience
export { SurveyModel, Question, PageModel, PanelModel } from './survey-core-wrapper';