import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SurveyQuestionText } from '../SurveyQuestionText';
import { Model, QuestionTextModel } from 'survey-core';
import { createMockSurveyModel } from '../../../__tests__/test-utils';

describe('SurveyQuestionText Component', () => {
  let surveyModel: Model;
  let textQuestion: QuestionTextModel;

  beforeEach(() => {
    surveyModel = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'text',
          name: 'textQuestion',
          title: 'Enter your name',
          placeholder: 'Type here...',
          isRequired: true
        }]
      }]
    });
    
    textQuestion = surveyModel.getQuestionByName('textQuestion') as QuestionTextModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render text input correctly', () => {
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    expect(getByTestId('survey-question')).toBeTruthy();
    expect(getByTestId('survey-text-input')).toBeTruthy();
  });

  it('should display question title', () => {
    const { getByText } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    expect(getByText('Enter your name')).toBeTruthy();
  });

  it('should show placeholder text', () => {
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.placeholder).toBe('Type here...');
  });

  it('should handle text input changes', async () => {
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    fireEvent.changeText(input, 'John Doe');

    await waitFor(() => {
      expect(textQuestion.value).toBe('John Doe');
    });
  });

  it('should show required indicator', () => {
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const title = getByTestId('survey-question-title');
    expect(title.props.children).toContain('*');
  });

  it('should display validation errors', async () => {
    textQuestion.validators.push({ type: 'email' });
    
    const { getByTestId, getByText } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    fireEvent.changeText(input, 'invalid-email');
    
    // Trigger validation
    textQuestion.hasErrors(true);

    await waitFor(() => {
      expect(getByText(/email/i)).toBeTruthy();
    });
  });

  it('should handle password input type', () => {
    textQuestion.inputType = 'password';
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should handle email input type', () => {
    textQuestion.inputType = 'email';
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should handle multiline comment type', () => {
    const commentQuestion = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'comment',
          name: 'commentQuestion',
          title: 'Enter comments',
          rows: 4
        }]
      }]
    }).getQuestionByName('commentQuestion') as QuestionTextModel;

    const { getByTestId } = render(
      <SurveyQuestionText question={commentQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(4);
  });

  it('should handle maxLength property', () => {
    textQuestion.maxLength = 50;
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.maxLength).toBe(50);
  });

  it('should handle readonly state', () => {
    textQuestion.readOnly = true;
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.editable).toBe(false);
  });

  it('should display description when provided', () => {
    textQuestion.description = 'Please enter your full name';
    
    const { getByText } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    expect(getByText('Please enter your full name')).toBeTruthy();
  });

  it('should update when question visibility changes', async () => {
    const { queryByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    expect(queryByTestId('survey-question')).toBeTruthy();

    textQuestion.visible = false;

    await waitFor(() => {
      expect(queryByTestId('survey-question')).toBeNull();
    });
  });

  it('should apply custom CSS classes', () => {
    const customCss = {
      question: { backgroundColor: 'yellow' },
      textInput: { borderColor: 'red' }
    };

    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} css={customCss} />
    );

    const questionContainer = getByTestId('survey-question');
    expect(questionContainer.props.style).toMatchObject({ backgroundColor: 'yellow' });
  });

  it('should handle numeric input type', () => {
    textQuestion.inputType = 'number';
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('should handle tel input type', () => {
    textQuestion.inputType = 'tel';
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  it('should handle focus and blur events', () => {
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    
    // Test focus
    fireEvent(input, 'focus');
    expect(textQuestion.focus).toHaveBeenCalled();
    
    // Test blur
    fireEvent(input, 'blur');
    expect(textQuestion.blur).toHaveBeenCalled();
  });

  it('should handle default value', () => {
    textQuestion.defaultValue = 'Default Name';
    
    const { getByTestId } = render(
      <SurveyQuestionText question={textQuestion} model={surveyModel} />
    );

    const input = getByTestId('survey-text-input');
    expect(input.props.value).toBe('Default Name');
  });
});