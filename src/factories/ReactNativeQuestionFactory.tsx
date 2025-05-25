import React from 'react';
import type { Question } from 'survey-core';

export interface IQuestionComponentProps {
  question: Question;
  isDisplayMode: boolean;
  creator: any;
}

export class ReactNativeQuestionFactory {
  private static _instance: ReactNativeQuestionFactory;
  private creatorHash: { [key: string]: (props: IQuestionComponentProps) => React.ReactElement } = {};

  public static get Instance() {
    if (!ReactNativeQuestionFactory._instance) {
      ReactNativeQuestionFactory._instance = new ReactNativeQuestionFactory();
    }
    return ReactNativeQuestionFactory._instance;
  }

  public registerQuestion(
    questionType: string,
    questionCreator: (props: IQuestionComponentProps) => React.ReactElement
  ) {
    this.creatorHash[questionType] = questionCreator;
  }

  public unregisterQuestion(questionType: string) {
    delete this.creatorHash[questionType];
  }

  public createQuestion(questionType: string, props: IQuestionComponentProps): React.ReactElement | null {
    const creator = this.creatorHash[questionType];
    if (!creator) {
      // Return empty question for unregistered types
      return this.createDefaultQuestion(props);
    }
    return creator(props);
  }

  public getAllQuestionTypes(): string[] {
    return Object.keys(this.creatorHash);
  }

  public hasQuestion(questionType: string): boolean {
    return !!this.creatorHash[questionType];
  }

  private createDefaultQuestion(props: IQuestionComponentProps): React.ReactElement {
    // This will be replaced with actual EmptyQuestion component
    return React.createElement('View', { key: props.question.id }, 
      React.createElement('Text', {}, `Question type "${props.question.getType()}" is not supported yet.`)
    );
  }

  public clear() {
    this.creatorHash = {};
  }
}