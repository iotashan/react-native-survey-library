import { useMemo } from 'react';
import type { Question } from 'survey-core';
import { CSSClassMapper } from '../styles/CSSClassMapper';

export function useQuestionStyles(question: Question, customCss?: any) {
  return useMemo(() => {
    if (!question) {
      return {
        containerStyle: {},
        titleStyle: {},
        requiredStyle: {},
        descriptionStyle: {},
        errorStyle: {},
        inputStyle: {}
      };
    }

    const cssClasses = question.cssClasses || {};
    
    // Get styles from CSS class mapper
    const containerStyle = cssClasses.root ? CSSClassMapper.getStyle(cssClasses.root) : {};
    const titleStyle = cssClasses.title ? CSSClassMapper.getStyle(cssClasses.title) : {};
    const requiredStyle = cssClasses.requiredText ? CSSClassMapper.getStyle(cssClasses.requiredText) : {};
    const descriptionStyle = cssClasses.description ? CSSClassMapper.getStyle(cssClasses.description) : {};
    const errorStyle = cssClasses.error ? CSSClassMapper.getStyle(cssClasses.error) : {};
    const inputStyle = cssClasses.textInput ? CSSClassMapper.getStyle(cssClasses.textInput) : {};
    
    // Merge with custom CSS if provided
    return {
      containerStyle: customCss?.question ? { ...containerStyle, ...customCss.question } : containerStyle,
      titleStyle: customCss?.questionTitle ? { ...titleStyle, ...customCss.questionTitle } : titleStyle,
      requiredStyle,
      descriptionStyle,
      errorStyle,
      inputStyle: customCss?.textInput ? { ...inputStyle, ...customCss.textInput } : inputStyle
    };
  }, [question, question?.cssClasses, customCss]);
}

export function useQuestionWrapperStyles(question: Question) {
  return useMemo(() => {
    return {
      container: {
        marginBottom: 16,
      },
      content: {
        flex: 1,
      },
      errorContainer: {
        marginTop: 4,
      },
      descriptionContainer: {
        marginBottom: 8,
      },
    };
  }, []);
}