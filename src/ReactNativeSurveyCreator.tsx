import React from 'react';
import { View, Text } from 'react-native';
import type { Question, SurveyModel } from 'survey-core';
import { ReactNativeQuestionFactory, IQuestionComponentProps } from './factories/ReactNativeQuestionFactory';
import { ReactNativeElementFactory } from './factories/ReactNativeElementFactory';
import type { ISurveyCreator } from './types/survey-types';

export class ReactNativeSurveyCreator implements ISurveyCreator {
  private static _instance: ReactNativeSurveyCreator;

  public static get Instance() {
    if (!ReactNativeSurveyCreator._instance) {
      ReactNativeSurveyCreator._instance = new ReactNativeSurveyCreator();
    }
    return ReactNativeSurveyCreator._instance;
  }

  public createQuestionElement(question: Question): React.ReactElement | null {
    const questionType = question.getType();
    const props: IQuestionComponentProps = {
      question: question,
      isDisplayMode: question.isReadOnly || question.isDesignMode,
      creator: this
    };

    const element = ReactNativeQuestionFactory.Instance.createQuestion(questionType, props);
    if (!element) {
      return this.createDefaultQuestion(props);
    }

    return React.cloneElement(element, { key: question.id });
  }

  public renderError(key: string, error: any, cssClasses: any, element?: any): React.ReactElement {
    return ReactNativeElementFactory.Instance.createElement('survey-error', {
      key,
      error,
      cssClasses,
      element
    });
  }

  public createRow(className: string, elements: React.ReactElement[]): React.ReactElement {
    return React.createElement(View, {
      key: className,
      style: { flexDirection: 'row', justifyContent: 'space-between' }
    }, elements);
  }

  public questionTitleLocation(): string {
    return 'top';
  }

  public questionErrorLocation(): string {
    return 'bottom';
  }

  private createDefaultQuestion(props: IQuestionComponentProps): React.ReactElement {
    return (
      <View key={props.question.id} style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 }}>
        <Text style={{ fontStyle: 'italic', color: '#666' }}>
          Question type "{props.question.getType()}" is not supported yet.
        </Text>
      </View>
    );
  }
}