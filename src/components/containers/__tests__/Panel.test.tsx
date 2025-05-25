import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Panel } from '../Panel';
import { Model, PanelModel } from 'survey-core';
import { createMockSurveyModel } from '../../../__tests__/test-utils';

describe('Panel Component', () => {
  let surveyModel: Model;
  let panelModel: PanelModel;

  beforeEach(() => {
    surveyModel = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'panel',
          name: 'testPanel',
          title: 'Test Panel Title',
          description: 'Test panel description',
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
        }]
      }]
    });
    
    panelModel = surveyModel.getPanelByName('testPanel') as PanelModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render panel correctly', () => {
    const { getByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(getByTestId('survey-panel')).toBeTruthy();
  });

  it('should display panel title when provided', () => {
    const { getByText } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Test Panel Title')).toBeTruthy();
  });

  it('should display panel description when provided', () => {
    const { getByText } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Test panel description')).toBeTruthy();
  });

  it('should render all questions in the panel', () => {
    const { getByText } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Question 1')).toBeTruthy();
    expect(getByText('Question 2')).toBeTruthy();
  });

  it('should handle collapsible panels', async () => {
    panelModel.state = 'collapsed';
    
    const { getByTestId, queryByText } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    // Questions should be hidden when collapsed
    expect(queryByText('Question 1')).toBeNull();
    expect(queryByText('Question 2')).toBeNull();

    // Click to expand
    const panelHeader = getByTestId('survey-panel-header');
    fireEvent.press(panelHeader);

    await waitFor(() => {
      expect(queryByText('Question 1')).toBeTruthy();
      expect(queryByText('Question 2')).toBeTruthy();
    });
  });

  it('should show expand/collapse icon for collapsible panels', () => {
    panelModel.state = 'expanded';
    
    const { getByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(getByTestId('survey-panel-expand-icon')).toBeTruthy();
  });

  it('should not render title when not provided', () => {
    panelModel.title = '';
    
    const { queryByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(queryByTestId('survey-panel-title')).toBeNull();
  });

  it('should not render description when not provided', () => {
    panelModel.description = '';
    
    const { queryByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(queryByTestId('survey-panel-description')).toBeNull();
  });

  it('should handle empty panel', () => {
    const emptyPanelModel = new PanelModel('emptyPanel');
    
    const { getByTestId } = render(
      <Panel panel={emptyPanelModel} model={surveyModel} css={{}} />
    );

    expect(getByTestId('survey-panel')).toBeTruthy();
  });

  it('should update when panel visibility changes', async () => {
    const { queryByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(queryByTestId('survey-panel')).toBeTruthy();

    // Make panel invisible
    panelModel.visible = false;

    await waitFor(() => {
      expect(queryByTestId('survey-panel')).toBeNull();
    });
  });

  it('should apply custom CSS classes', () => {
    const customCss = {
      panel: { backgroundColor: 'green' },
      panelTitle: { color: 'white' },
      panelDescription: { fontSize: 14 },
      panelContent: { padding: 20 }
    };

    const { getByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={customCss} />
    );

    const panelContainer = getByTestId('survey-panel');
    expect(panelContainer.props.style).toMatchObject({ backgroundColor: 'green' });
  });

  it('should handle nested panels', () => {
    const nestedPanelModel = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'panel',
          name: 'outerPanel',
          title: 'Outer Panel',
          elements: [{
            type: 'panel',
            name: 'innerPanel',
            title: 'Inner Panel',
            elements: [{
              type: 'text',
              name: 'nestedQuestion',
              title: 'Nested Question'
            }]
          }]
        }]
      }]
    }).getPanelByName('outerPanel') as PanelModel;

    const { getByText } = render(
      <Panel panel={nestedPanelModel} model={surveyModel} css={{}} />
    );

    expect(getByText('Outer Panel')).toBeTruthy();
    expect(getByText('Inner Panel')).toBeTruthy();
    expect(getByText('Nested Question')).toBeTruthy();
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
      <Panel 
        panel={panelModel} 
        model={surveyModel} 
        css={{}} 
        creator={mockCreator as any}
      />
    );

    // Questions should be rendered with creator context
    expect(mockCreator.createQuestionElement).toHaveBeenCalledTimes(2);
  });

  it('should handle panel required state', () => {
    panelModel.isRequired = true;
    
    const { getByTestId } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    const panelTitle = getByTestId('survey-panel-title');
    expect(panelTitle.props.children).toContain('*');
  });

  it('should update when questions are added to panel', async () => {
    const { queryByText } = render(
      <Panel panel={panelModel} model={surveyModel} css={{}} />
    );

    expect(queryByText('New Panel Question')).toBeNull();

    // Add new question to panel
    panelModel.addNewQuestion('text', 'newPanelQuestion');
    const newQuestion = panelModel.getQuestionByName('newPanelQuestion');
    if (newQuestion) {
      newQuestion.title = 'New Panel Question';
    }

    await waitFor(() => {
      expect(queryByText('New Panel Question')).toBeTruthy();
    });
  });
});