import React from 'react';
import { View } from 'react-native';
import type { Question, SurveyModel, Helpers } from 'survey-core';
import { SurveyElementBase } from './SurveyElementBase';
import type { ISurveyCreator } from '../../types/survey-types';

export abstract class SurveyQuestionElementBase extends SurveyElementBase<any, any> {
  control: any;
  content: any;

  constructor(props: any) {
    super(props);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }

  componentDidMount() {
    super.componentDidMount();
    this.updateDomElement();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.questionBase) {
      const contentElement = this.content || this.control;
      this.questionBase.beforeDestroyQuestionElement(contentElement);
    }
  }

  protected updateDomElement() {
    const contentElement = this.content || this.control;
    if (contentElement) {
      this.questionBase.afterRenderQuestionElement(contentElement);
    }
  }

  protected get questionBase(): Question {
    return this.props.question;
  }

  protected getRenderedElements(): Base[] {
    return [this.questionBase];
  }

  protected get creator(): ISurveyCreator {
    return this.props.creator;
  }

  protected canRender(): boolean {
    return !!this.questionBase && !!this.creator;
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;

    return (
      !this.questionBase.customWidget ||
      !!this.questionBase.customWidgetData.isNeedRender ||
      !!this.questionBase.customWidget.widgetJson.isDefaultRender ||
      !!this.questionBase.customWidget.widgetJson.render
    );
  }

  protected get isDisplayMode(): boolean {
    const props: any = this.props;
    return (
      props.isDisplayMode ||
      (!!this.questionBase && this.questionBase.isInputReadOnly) ||
      false
    );
  }

  protected wrapCell(
    cell: any,
    element: React.ReactElement,
    reason: string
  ): React.ReactElement {
    if (!reason) {
      return element;
    }
    const survey: SurveyModel = this.questionBase.survey as SurveyModel;
    // In React Native, we don't have the wrapper concept, so return element as is
    return element;
  }

  public setControl(element: any | null): void {
    if (element) {
      this.control = element;
    }
  }

  public setContent(element: any | null): void {
    if (element) {
      this.content = element;
    }
  }
}

export abstract class SurveyQuestionUncontrolledElement<
  T extends Question
> extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.updateValueOnEvent = this.updateValueOnEvent.bind(this);
  }

  protected get question(): T {
    return this.questionBase as T;
  }

  updateValueOnEvent = (value: any) => {
    if (!this.isTwoValueEquals(this.questionBase.value, value)) {
      this.setValueCore(value);
    }
  };

  protected setValueCore(newValue: any) {
    this.questionBase.value = newValue;
  }

  protected getValueCore(): any {
    return this.questionBase.value;
  }

  protected updateDomElement() {
    if (this.control) {
      const newValue = this.getValueCore();
      const controlValue = this.control.props?.value || this.control.props?.defaultValue;
      if (!this.isTwoValueEquals(newValue, controlValue)) {
        // In React Native, we update through props, not direct DOM manipulation
        this.forceUpdate();
      }
    }
    super.updateDomElement();
  }

  private getValue(val: any): any {
    if (this.isValueEmpty(val)) return "";
    return val;
  }

  private isTwoValueEquals(val1: any, val2: any): boolean {
    // Simple equality check - can be enhanced based on survey-core's Helpers.isTwoValueEquals
    return val1 === val2;
  }

  private isValueEmpty(val: any): boolean {
    return val === null || val === undefined || val === "";
  }
}