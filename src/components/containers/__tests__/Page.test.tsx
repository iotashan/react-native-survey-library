import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Page } from '../Page';
import { Model, PageModel } from 'survey-core';
import { createMockSurveyModel } from '../../../__tests__/test-utils';

describe('Page Component', () => {
  let surveyModel: Model;
  let pageModel: PageModel;

  beforeEach(() => {
    surveyModel = createMockSurveyModel({
      pages: [
        {
          name: 'testPage',
          title: 'Test Page Title',
          description: 'Test page description',
          elements: [
            {
              type: 'text',
              name: 'question1',
              title: 'Question 1'
            },
            {
              type: 'text',
              name: 'question2',
              title: 'Question 2'
            }
          ]
        }
      ]
    });
    
    pageModel = surveyModel.pages[0];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render page correctly', () => {
    const { getByTestId } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(getByTestId('survey-page')).toBeTruthy();
  });

  it('should display page title when provided', () => {
    const { getByText } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Test Page Title')).toBeTruthy();
  });

  it('should display page description when provided', () => {
    const { getByText } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Test page description')).toBeTruthy();
  });

  it('should render all questions on the page', () => {
    const { getByText } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Question 1')).toBeTruthy();
    expect(getByText('Question 2')).toBeTruthy();
  });

  it('should not render title when not provided', () => {
    pageModel.title = '';
    
    const { queryByTestId } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(queryByTestId('survey-page-title')).toBeNull();
  });

  it('should not render description when not provided', () => {
    pageModel.description = '';
    
    const { queryByTestId } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(queryByTestId('survey-page-description')).toBeNull();
  });

  it('should handle empty page', () => {
    const emptyPageModel = new PageModel('emptyPage');
    
    const { getByTestId } = render(
      <Page page={emptyPageModel} model={surveyModel} css={{}} />
    );

    expect(getByTestId('survey-page')).toBeTruthy();
  });

  it('should update when page visibility changes', async () => {
    const { queryByTestId } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(queryByTestId('survey-page')).toBeTruthy();

    // Make page invisible
    pageModel.visible = false;

    await waitFor(() => {
      expect(queryByTestId('survey-page')).toBeNull();
    });
  });

  it('should apply custom CSS classes', () => {
    const customCss = {
      page: { backgroundColor: 'blue' },
      pageTitle: { color: 'red' },
      pageDescription: { fontSize: 12 }
    };

    const { getByTestId } = render(
      <Page page={pageModel} model={surveyModel} css={customCss} />
    );

    const pageContainer = getByTestId('survey-page');
    expect(pageContainer.props.style).toMatchObject({ backgroundColor: 'blue' });
  });

  it('should handle panels on the page', () => {
    const pageWithPanel = createMockSurveyModel({
      pages: [{
        name: 'pageWithPanel',
        elements: [{
          type: 'panel',
          name: 'panel1',
          title: 'Panel Title',
          elements: [{
            type: 'text',
            name: 'panelQuestion',
            title: 'Question in Panel'
          }]
        }]
      }]
    }).pages[0];

    const { getByText } = render(
      <Page page={pageWithPanel} model={surveyModel} css={{}} />
    );

    expect(getByText('Panel Title')).toBeTruthy();
    expect(getByText('Question in Panel')).toBeTruthy();
  });

  it('should pass creator context to child elements', () => {
    const mockCreator = {
      createQuestionElement: jest.fn(),
      createPanelElement: jest.fn(),
      renderError: jest.fn(),
      questionTitleLocation: 'top',
      questionErrorLocation: 'bottom'
    };

    render(
      <Page 
        page={pageModel} 
        model={surveyModel} 
        css={{}} 
        creator={mockCreator as any}
      />
    );

    // Questions should be rendered with creator context
    expect(mockCreator.createQuestionElement).toHaveBeenCalledTimes(2);
  });

  it('should update when questions are added to page', async () => {
    const { queryByText } = render(
      <Page page={pageModel} model={surveyModel} css={{}} />
    );

    expect(queryByText('New Question')).toBeNull();

    // Add new question to page
    pageModel.addNewQuestion('text', 'newQuestion');
    const newQuestion = pageModel.getQuestionByName('newQuestion');
    if (newQuestion) {
      newQuestion.title = 'New Question';
    }

    await waitFor(() => {
      expect(queryByText('New Question')).toBeTruthy();
    });
  });
});