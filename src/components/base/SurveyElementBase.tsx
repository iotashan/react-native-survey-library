import React, { Component } from 'react';
import type { Base, ArrayChanges, LocalizableString } from 'survey-core';
import { ReactNativeElementFactory } from '../../factories/ReactNativeElementFactory';

export abstract class SurveyElementBase<P, S = any> extends Component<P, S> {
  private changedStatePropNameValue: string | undefined;
  private _allowComponentUpdate = true;
  private prevStateElements: Array<Base> = [];

  constructor(props: P) {
    super(props);
  }

  componentDidMount() {
    this.makeBaseElementsReact();
  }

  componentWillUnmount() {
    this.unMakeBaseElementsReact();
    this.disableStateElementsRerenderEvent(this.getStateElements());
  }

  componentDidUpdate(prevProps: P, prevState: S) {
    this.makeBaseElementsReact();
    const stateElements = this.getStateElements();
    this.disableStateElementsRerenderEvent(
      (this.prevStateElements ?? []).filter(
        el => !stateElements.find(stateElement => stateElement == el)
      )
    );
    this.prevStateElements = [];
    this.getStateElements().forEach((el) => {
      el.afterRender();
    });
  }

  protected allowComponentUpdate() {
    this._allowComponentUpdate = true;
    this.forceUpdate();
  }

  protected denyComponentUpdate() {
    this._allowComponentUpdate = false;
  }

  shouldComponentUpdate(nextProps: P, nextState: S): boolean {
    if (this._allowComponentUpdate) {
      this.unMakeBaseElementsReact();
      this.prevStateElements = this.getStateElements();
    }
    return this._allowComponentUpdate;
  }

  render(): React.ReactElement | null {
    if (!this.canRender()) {
      return null;
    }

    this.startEndRendering(1);
    let res = this.renderElement();
    this.startEndRendering(-1);

    if (res) {
      res = this.wrapElement(res);
    }

    this.changedStatePropNameValue = undefined;
    return res;
  }

  protected wrapElement(element: React.ReactElement): React.ReactElement {
    return element;
  }

  protected get isRendering(): boolean {
    const stateEls: Array<any> = this.getRenderedElements();
    for (let stateEl of stateEls) {
      if (stateEl.reactRendering > 0) return true;
    }
    return false;
  }

  protected getRenderedElements(): Base[] {
    return this.getStateElements();
  }

  private startEndRendering(val: number) {
    const stateEls: Array<any> = this.getRenderedElements();
    for (let stateEl of stateEls) {
      if (!stateEl.reactRendering) stateEl.reactRendering = 0;
      stateEl.reactRendering += val;
    }
  }

  protected canRender(): boolean {
    return true;
  }

  protected abstract renderElement(): React.ReactElement | null;

  protected get changedStatePropName(): string | undefined {
    return this.changedStatePropNameValue;
  }

  private makeBaseElementsReact() {
    const els = this.getStateElements();
    for (let i = 0; i < els.length; i++) {
      els[i].enableOnElementRenderedEvent();
      this.makeBaseElementReact(els[i]);
    }
  }

  private unMakeBaseElementsReact() {
    const els = this.getStateElements();
    this.unMakeBaseElementsReactive(els);
  }

  private unMakeBaseElementsReactive(els: Array<Base>) {
    for (let i = 0; i < els.length; i++) {
      this.unMakeBaseElementReact(els[i]);
    }
  }

  protected disableStateElementsRerenderEvent(els: Array<Base>): void {
    els.forEach(el => {
      el.disableOnElementRenderedEvent();
    });
  }

  protected getStateElements(): Array<Base> {
    const el = this.getStateElement();
    return el ? [el] : [];
  }

  protected getStateElement(): Base | null {
    return null;
  }

  protected get isDisplayMode(): boolean {
    const props: any = this.props;
    return props.isDisplayMode || false;
  }

  protected renderLocString(
    locStr: LocalizableString,
    style?: any,
    key?: string
  ): React.ReactElement {
    return ReactNativeElementFactory.Instance.createElement(locStr.renderAs, {
      locStr: locStr.renderAsData,
      style: style,
      key: key,
    });
  }

  private canMakeReact(stateElement: Base): boolean {
    return !!stateElement && !!stateElement.iteratePropertiesHash;
  }

  private propertyValueChangedHandler = (hash: any, key: string, val: any) => {
    if (hash[key] !== val) {
      hash[key] = val;
      if (!this.canUsePropInState(key)) return;
      if (this.isRendering) return;
      this.changedStatePropNameValue = key;
      this.setState((state: any) => {
        const newState: { [index: string]: any } = {};
        newState[key] = val;
        return newState as S;
      });
    }
  };

  protected isCurrentStateElement(stateElement: Base) {
    return (
      !!stateElement &&
      !!stateElement.setPropertyValueCoreHandler &&
      stateElement.setPropertyValueCoreHandler === this.propertyValueChangedHandler
    );
  }

  private makeBaseElementReact(stateElement: Base) {
    if (!this.canMakeReact(stateElement)) return;
    stateElement.iteratePropertiesHash((hash, key) => {
      if (!this.canUsePropInState(key)) return;
      const val: any = hash[key];
      if (Array.isArray(val)) {
        val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
          if (this.isRendering) return;
          this.changedStatePropNameValue = key;
          this.setState((state: any) => {
            const newState: { [index: string]: any } = {};
            newState[key] = val;
            return newState as S;
          });
        };
      }
    });
    stateElement.setPropertyValueCoreHandler = this.propertyValueChangedHandler;
  }

  protected canUsePropInState(key: string): boolean {
    return true;
  }

  private unMakeBaseElementReact(stateElement: Base) {
    if (!this.canMakeReact(stateElement)) return;
    if (!this.isCurrentStateElement(stateElement)) {
      return;
    }
    stateElement.setPropertyValueCoreHandler = undefined as any;
    stateElement.iteratePropertiesHash((hash, key) => {
      const val: any = hash[key];
      if (Array.isArray(val)) {
        val["onArrayChanged"] = () => { };
      }
    });
  }
}

export class ReactSurveyElement extends SurveyElementBase<any, any> {
  constructor(props: any) {
    super(props);
  }

  protected get cssClasses(): any {
    return this.props.cssClasses;
  }

  protected renderElement(): React.ReactElement | null {
    return null;
  }
}