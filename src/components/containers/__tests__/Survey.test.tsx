import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Survey } from '../Survey';
import { Model } from 'survey-core';
import { createMockSurveyModel } from '../../../__tests__/test-utils';

describe('Survey Component', () => {
  let surveyModel: Model;
  let onCompleteMock: jest.Mock;
  let onValueChangedMock: jest.Mock;

  beforeEach(() => {
    onCompleteMock = jest.fn();
    onValueChangedMock = jest.fn();
    
    surveyModel = createMockSurveyModel({
      pages: [
        {
          name: 'page1',
          elements: [
            {
              type: 'text',
              name: 'name',
              title: 'What is your name?',
              isRequired: true
            }
          ]
        },
        {
          name: 'page2',
          elements: [
            {
              type: 'text',
              name: 'email',
              title: 'What is your email?',
              validators: [{ type: 'email' }]
            }
          ]
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render survey correctly', () => {
    const { getByTestId } = render(
      <Survey model={surveyModel} />
    );

    expect(getByTestId('survey-container')).toBeTruthy();
  });

  it('should display first page by default', () => {
    const { getByText } = render(
      <Survey model={surveyModel} />
    );

    expect(getByText('What is your name?')).toBeTruthy();
  });

  it('should navigate to next page', async () => {
    const { getByTestId, getByText } = render(
      <Survey model={surveyModel} />
    );

    // Answer the required question
    const nameInput = getByTestId('survey-text-input');
    fireEvent.changeText(nameInput, 'John Doe');

    // Click next
    const nextButton = getByTestId('survey-nav-next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('What is your email?')).toBeTruthy();
    });
  });

  it('should navigate to previous page', async () => {
    const { getByTestId, getByText } = render(
      <Survey model={surveyModel} />
    );

    // Go to page 2
    surveyModel.currentPageNo = 1;

    await waitFor(() => {
      expect(getByText('What is your email?')).toBeTruthy();
    });

    // Click previous
    const prevButton = getByTestId('survey-nav-prev');
    fireEvent.press(prevButton);

    await waitFor(() => {
      expect(getByText('What is your name?')).toBeTruthy();
    });
  });

  it('should call onComplete when survey is completed', async () => {
    const { getByTestId } = render(
      <Survey model={surveyModel} onComplete={onCompleteMock} />
    );

    // Fill required field on page 1
    const nameInput = getByTestId('survey-text-input');
    fireEvent.changeText(nameInput, 'John Doe');

    // Go to page 2
    surveyModel.currentPageNo = 1;

    // Complete the survey
    const completeButton = getByTestId('survey-nav-complete');
    fireEvent.press(completeButton);

    await waitFor(() => {
      expect(onCompleteMock).toHaveBeenCalledWith(surveyModel);
    });
  });

  it('should call onValueChanged when value changes', async () => {
    const { getByTestId } = render(
      <Survey model={surveyModel} onValueChanged={onValueChangedMock} />
    );

    const nameInput = getByTestId('survey-text-input');
    fireEvent.changeText(nameInput, 'John Doe');

    await waitFor(() => {
      expect(onValueChangedMock).toHaveBeenCalled();
    });
  });

  it('should show/hide navigation based on survey state', () => {
    const singlePageModel = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'text',
          name: 'question1',
          title: 'Single Question'
        }]
      }]
    });

    const { queryByTestId } = render(
      <Survey model={singlePageModel} />
    );

    // Single page survey should not show prev button
    expect(queryByTestId('survey-nav-prev')).toBeNull();
    
    // Should show complete button instead of next
    expect(queryByTestId('survey-nav-complete')).toBeTruthy();
    expect(queryByTestId('survey-nav-next')).toBeNull();
  });

  it('should handle empty survey', () => {
    const emptyModel = new Model({});
    
    const { getByTestId } = render(
      <Survey model={emptyModel} />
    );

    expect(getByTestId('survey-container')).toBeTruthy();
  });

  it('should update when model changes', async () => {
    const { rerender, getByText } = render(
      <Survey model={surveyModel} />
    );

    expect(getByText('What is your name?')).toBeTruthy();

    // Create new model
    const newModel = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'text',
          name: 'newQuestion',
          title: 'New Question Title'
        }]
      }]
    });

    rerender(<Survey model={newModel} />);

    await waitFor(() => {
      expect(getByText('New Question Title')).toBeTruthy();
    });
  });

  it('should apply custom CSS classes', () => {
    const { getByTestId } = render(
      <Survey 
        model={surveyModel} 
        css={{ survey: { backgroundColor: 'red' } }} 
      />
    );

    const container = getByTestId('survey-container');
    expect(container.props.style).toMatchObject({ backgroundColor: 'red' });
  });

  it('should handle survey completion state', async () => {
    const { getByTestId, queryByTestId } = render(
      <Survey model={surveyModel} />
    );

    // Complete the survey
    surveyModel.doComplete();

    await waitFor(() => {
      // Navigation should be hidden when survey is completed
      expect(queryByTestId('survey-nav-next')).toBeNull();
      expect(queryByTestId('survey-nav-complete')).toBeNull();
    });
  });

  it('should register as survey creator', () => {
    const registerSpy = jest.spyOn(surveyModel, 'setCreator' as any);
    
    render(<Survey model={surveyModel} />);
    
    expect(registerSpy).toHaveBeenCalled();
  });
});