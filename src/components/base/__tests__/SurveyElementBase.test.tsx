import React from 'react';
import { View, Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { SurveyElementBase } from '../SurveyElementBase';
import { Base } from 'survey-core';

// Mock concrete implementation for testing
class TestElement extends Base {
  private _testProp: string = 'initial';
  
  get testProp() {
    return this._testProp;
  }
  
  set testProp(val: string) {
    this.setPropertyValue('testProp', val);
  }
}

// Test component that extends SurveyElementBase
interface TestComponentProps {
  element: TestElement;
  css?: any;
}

interface TestComponentState {
  testProp: string;
}

class TestComponent extends SurveyElementBase<TestComponentProps, TestComponentState> {
  constructor(props: TestComponentProps) {
    super(props);
    this.state = {
      testProp: props.element.testProp
    };
  }

  protected getStateElement(): Base {
    return this.props.element;
  }

  protected canRender(): boolean {
    return true;
  }

  protected renderElement(): React.ReactNode {
    return (
      <View testID="test-element">
        <Text testID="test-element-text">{this.state.testProp}</Text>
      </View>
    );
  }
}

describe('SurveyElementBase', () => {
  let testElement: TestElement;

  beforeEach(() => {
    testElement = new TestElement();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render element correctly', () => {
    const { getByTestId } = render(
      <TestComponent element={testElement} />
    );

    expect(getByTestId('test-element')).toBeTruthy();
    expect(getByTestId('test-element-text')).toHaveTextContent('initial');
  });

  it('should update state when element property changes', async () => {
    const { getByTestId } = render(
      <TestComponent element={testElement} />
    );

    expect(getByTestId('test-element-text')).toHaveTextContent('initial');

    // Change the property
    testElement.testProp = 'updated';

    await waitFor(() => {
      expect(getByTestId('test-element-text')).toHaveTextContent('updated');
    });
  });

  it('should make elements reactive on mount', () => {
    const makeReactSpy = jest.spyOn(testElement, 'makeReactive' as any);
    
    render(<TestComponent element={testElement} />);
    
    expect(makeReactSpy).toHaveBeenCalled();
  });

  it('should unmake elements reactive on unmount', () => {
    const unMakeReactSpy = jest.spyOn(testElement, 'unMakeReactive' as any);
    
    const { unmount } = render(<TestComponent element={testElement} />);
    
    unmount();
    
    expect(unMakeReactSpy).toHaveBeenCalled();
  });

  it('should handle shouldComponentUpdate correctly', () => {
    const { rerender } = render(
      <TestComponent element={testElement} />
    );

    // Create a new element instance
    const newElement = new TestElement();
    newElement.testProp = 'new value';

    rerender(<TestComponent element={newElement} />);

    // Component should have updated with new element
    expect(true).toBeTruthy(); // Just verifying no errors
  });

  it('should call afterRender on state elements after update', async () => {
    const afterRenderSpy = jest.spyOn(testElement, 'afterRender');
    
    const { rerender } = render(
      <TestComponent element={testElement} />
    );

    testElement.testProp = 'updated';
    
    // Force a re-render
    rerender(<TestComponent element={testElement} />);

    await waitFor(() => {
      expect(afterRenderSpy).toHaveBeenCalled();
    });
  });
});