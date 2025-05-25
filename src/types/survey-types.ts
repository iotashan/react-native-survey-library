import type { ReactElement } from 'react';
import type { Question, SurveyError, SurveyModel } from '../survey-core-wrapper';

export interface ISurveyCreator {
  createQuestionElement(question: Question): ReactElement | null;
  renderError(
    key: string,
    error: SurveyError,
    cssClasses: any,
    element?: any
  ): ReactElement;
  questionTitleLocation(): string;
  questionErrorLocation(): string;
}

export interface IQuestionProps {
  question: Question;
  isDisplayMode: boolean;
  creator: ISurveyCreator;
}

export interface ISurveyProps {
  model: SurveyModel;
  css?: any;
  onComplete?: (survey: SurveyModel) => void;
  onPartialSend?: (survey: SurveyModel) => void;
  onValueChanged?: (survey: SurveyModel, options: any) => void;
  onCurrentPageChanged?: (survey: SurveyModel, options: any) => void;
  onVisibleChanged?: (survey: SurveyModel, options: any) => void;
}

export interface IElementProps {
  element: any;
  css?: any;
  cssClasses?: any;
}