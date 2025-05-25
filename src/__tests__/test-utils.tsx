import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Model } from 'survey-core';

// Create a mock survey model with default configuration
export const createMockSurveyModel = (json?: any): Model => {
  const defaultJson = {
    pages: [
      {
        name: 'page1',
        elements: [
          {
            type: 'text',
            name: 'question1',
            title: 'Test Question'
          }
        ]
      }
    ]
  };

  return new Model(json || defaultJson);
};

// Custom render function that includes common providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };

// Common test IDs
export const testIds = {
  survey: 'survey-container',
  page: 'survey-page',
  panel: 'survey-panel',
  question: 'survey-question',
  questionTitle: 'survey-question-title',
  questionDescription: 'survey-question-description',
  questionError: 'survey-question-error',
  textInput: 'survey-text-input',
  navigation: {
    prev: 'survey-nav-prev',
    next: 'survey-nav-next',
    complete: 'survey-nav-complete'
  }
};

// Helper to create question props
export const createQuestionProps = (overrides?: any) => {
  const model = createMockSurveyModel();
  const question = model.getQuestionByName('question1');
  
  return {
    question,
    model,
    css: {},
    ...overrides
  };
};