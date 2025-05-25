import React from 'react';
import { Text, View } from 'react-native';

export interface IElementCreatorProps {
  [key: string]: any;
}

export class ReactNativeElementFactory {
  private static _instance: ReactNativeElementFactory;
  private creatorHash: { [key: string]: (props: IElementCreatorProps) => React.ReactElement } = {};

  public static get Instance() {
    if (!ReactNativeElementFactory._instance) {
      ReactNativeElementFactory._instance = new ReactNativeElementFactory();
      ReactNativeElementFactory._instance.initializeDefaultElements();
    }
    return ReactNativeElementFactory._instance;
  }

  private initializeDefaultElements() {
    // Register default elements
    this.registerElement('text', (props) => {
      const { locStr, style, ...rest } = props;
      const text = locStr?.text || locStr || '';
      return React.createElement(Text, { style, ...rest }, text);
    });

    this.registerElement('div', (props) => {
      return React.createElement(View, props);
    });

    this.registerElement('span', (props) => {
      return React.createElement(Text, props);
    });

    this.registerElement('survey-error', (props) => {
      const { error, cssClasses } = props;
      return React.createElement(Text, { 
        style: cssClasses?.error || { color: '#e60a3e', fontSize: 14 } 
      }, error?.text || '');
    });
  }

  public registerElement(
    elementType: string,
    elementCreator: (props: IElementCreatorProps) => React.ReactElement
  ) {
    this.creatorHash[elementType] = elementCreator;
  }

  public unregisterElement(elementType: string) {
    delete this.creatorHash[elementType];
  }

  public createElement(elementType: string, props: IElementCreatorProps): React.ReactElement {
    const creator = this.creatorHash[elementType];
    if (!creator) {
      // Default to View for unknown elements
      return React.createElement(View, props);
    }
    return creator(props);
  }

  public getAllElementTypes(): string[] {
    return Object.keys(this.creatorHash);
  }

  public hasElement(elementType: string): boolean {
    return !!this.creatorHash[elementType];
  }

  public clear() {
    this.creatorHash = {};
    this.initializeDefaultElements();
  }
}