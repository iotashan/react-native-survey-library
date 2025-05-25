import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { SurveyQuestionElementBase } from '../SurveyQuestionElementBase';
import { Model, Question } from 'survey-core';
import { createMockSurveyModel } from '../../../__tests__/test-utils';

// Test question component that extends SurveyQuestionElementBase
class TestQuestionComponent extends SurveyQuestionElementBase {
  protected renderElement(): React.ReactNode {
    const question = this.questionBase;
    
    return (
      <View 
        testID="test-question"
        ref={(el) => { this.control = el; }}
      >
        <Text testID="question-title">{question.title}</Text>
        <TextInput
          testID="question-input"
          value={question.value || ''}
          onChangeText={(text) => { question.value = text; }}
        />
      </View>
    );
  }
  
  protected getStateElement() {
    return this.questionBase;
  }
}

describe('SurveyQuestionElementBase', () => {
  let surveyModel: Model;
  let question: Question;

  beforeEach(() => {
    surveyModel = createMockSurveyModel({
      pages: [{
        name: 'page1',
        elements: [{
          type: 'text',
          name: 'testQuestion',
          title: 'Test Question Title',
          defaultValue: 'default'
        }]
      }]
    });
    question = surveyModel.getQuestionByName('testQuestion');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render question correctly', () => {
    const { getByTestId } = render(
      <TestQuestionComponent question={question} model={surveyModel} />
    );

    expect(getByTestId('test-question')).toBeTruthy();
    expect(getByTestId('question-title')).toHaveTextContent('Test Question Title');
    expect(getByTestId('question-input').props.value).toBe('default');
  });

  it('should update when question value changes', async () => {
    const { getByTestId, rerender } = render(
      <TestQuestionComponent question={question} model={surveyModel} />
    );

    expect(getByTestId('question-input').props.value).toBe('default');

    // Change the question value
    question.value = 'updated value';

    await waitFor(() => {
      rerender(<TestQuestionComponent question={question} model={surveyModel} />);
      expect(getByTestId('question-input').props.value).toBe('updated value');
    });
  });

  it('should call afterRenderQuestionElement on mount', () => {
    const afterRenderSpy = jest.spyOn(question, 'afterRenderQuestionElement');
    
    render(<TestQuestionComponent question={question} model={surveyModel} />);
    
    expect(afterRenderSpy).toHaveBeenCalled();
  });

  it('should call beforeDestroyQuestionElement on unmount', () => {
    const beforeDestroySpy = jest.spyOn(question, 'beforeDestroyQuestionElement');
    
    const { unmount } = render(
      <TestQuestionComponent question={question} model={surveyModel} />
    );
    
    unmount();
    
    expect(beforeDestroySpy).toHaveBeenCalled();
  });

  it('should update DOM element after component update', async () => {
    const afterRenderSpy = jest.spyOn(question, 'afterRenderQuestionElement');
    
    const { rerender } = render(
      <TestQuestionComponent question={question} model={surveyModel} />
    );

    // Clear the spy count from initial mount
    afterRenderSpy.mockClear();

    // Force update by changing question title
    question.title = 'Updated Title';
    
    rerender(<TestQuestionComponent question={question} model={surveyModel} />);

    await waitFor(() => {
      expect(afterRenderSpy).toHaveBeenCalled();
    });
  });

  it('should provide access to question base', () => {
    const component = new TestQuestionComponent({ question, model: surveyModel });
    expect(component['questionBase']).toBe(question);
  });

  it('should return question in getRenderedElements', () => {
    const component = new TestQuestionComponent({ question, model: surveyModel });
    const renderedElements = component['getRenderedElements']();
    
    expect(renderedElements).toHaveLength(1);
    expect(renderedElements[0]).toBe(question);
  });

  it('should handle missing control/content gracefully', () => {
    class MinimalQuestionComponent extends SurveyQuestionElementBase {
      protected renderElement(): React.ReactNode {
        return <View testID="minimal-question" />;
      }
      
      protected getStateElement() {
        return this.questionBase;
      }
    }

    const { getByTestId } = render(
      <MinimalQuestionComponent question={question} model={surveyModel} />
    );

    expect(getByTestId('minimal-question')).toBeTruthy();
  });
});