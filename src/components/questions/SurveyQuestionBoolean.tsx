// Load polyfills first before any React Native imports
import '../../polyfills/setup';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuestionBooleanModel } from '../../survey-core-wrapper';
import { SurveyQuestionUncontrolledElement } from '../base/SurveyQuestionElementBase';
import { useQuestionStyles } from '../../hooks/useQuestionStyles';
import { ReactNativeQuestionFactory } from '../../factories/ReactNativeQuestionFactory';

export class SurveyQuestionBoolean extends SurveyQuestionUncontrolledElement<QuestionBooleanModel> {
  constructor(props: any) {
    super(props);
    this.state = { 
      value: this.question.value 
    };
  }

  protected renderElement(): React.ReactElement {
    return <BooleanQuestion question={this.question} onChange={this.updateValueOnEvent} />;
  }

  protected setValueCore(newValue: any) {
    this.question.value = newValue;
  }

  protected getValueCore(): any {
    return this.question.value;
  }
}

interface BooleanQuestionProps {
  question: QuestionBooleanModel;
  onChange: (value: any) => void;
}

function BooleanQuestion({ question, onChange }: BooleanQuestionProps) {
  const { styles } = useQuestionStyles(question);

  const handlePress = (value: boolean) => {
    if (!question.isReadOnly) {
      onChange(value);
    }
  };

  const renderToggleSwitch = () => {
    const isTrue = question.value === true;
    const isFalse = question.value === false;
    
    return (
      <View style={styles.booleanToggleContainer}>
        <TouchableOpacity
          style={[
            styles.booleanToggleButton,
            isFalse && styles.booleanToggleButtonSelected,
            question.isReadOnly && styles.disabledItem
          ]}
          onPress={() => handlePress(false)}
          disabled={question.isReadOnly}
          accessibilityRole="button"
          accessibilityState={{ selected: isFalse, disabled: question.isReadOnly }}
        >
          <Text style={[
            styles.booleanToggleText,
            isFalse && styles.booleanToggleTextSelected,
            question.isReadOnly && styles.disabledText
          ]}>
            {question.locLabelFalse?.renderedHtml || 'No'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.booleanToggleButton,
            isTrue && styles.booleanToggleButtonSelected,
            question.isReadOnly && styles.disabledItem
          ]}
          onPress={() => handlePress(true)}
          disabled={question.isReadOnly}
          accessibilityRole="button"
          accessibilityState={{ selected: isTrue, disabled: question.isReadOnly }}
        >
          <Text style={[
            styles.booleanToggleText,
            isTrue && styles.booleanToggleTextSelected,
            question.isReadOnly && styles.disabledText
          ]}>
            {question.locLabelTrue?.renderedHtml || 'Yes'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCheckbox = () => {
    const isChecked = question.value === true;
    
    return (
      <TouchableOpacity
        style={[
          styles.booleanCheckboxContainer,
          question.isReadOnly && styles.disabledItem
        ]}
        onPress={() => handlePress(!question.value)}
        disabled={question.isReadOnly}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled: question.isReadOnly }}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[
          styles.booleanCheckboxLabel,
          question.isReadOnly && styles.disabledText
        ]}>
          {question.locLabel?.renderedHtml || question.processedTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRadioButtons = () => {
    const isTrue = question.value === true;
    const isFalse = question.value === false;
    const isIndeterminate = question.value === null || question.value === undefined;
    
    return (
      <View style={styles.booleanRadioContainer}>
        <TouchableOpacity
          style={[styles.radioItem, question.isReadOnly && styles.disabledItem]}
          onPress={() => handlePress(true)}
          disabled={question.isReadOnly}
          accessibilityRole="radio"
          accessibilityState={{ checked: isTrue, disabled: question.isReadOnly }}
        >
          <View style={[styles.radioButton, isTrue && styles.radioButtonSelected]}>
            {isTrue && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[
            styles.radioLabel,
            question.isReadOnly && styles.disabledText
          ]}>
            {question.locLabelTrue?.renderedHtml || 'Yes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioItem, question.isReadOnly && styles.disabledItem]}
          onPress={() => handlePress(false)}
          disabled={question.isReadOnly}
          accessibilityRole="radio"
          accessibilityState={{ checked: isFalse, disabled: question.isReadOnly }}
        >
          <View style={[styles.radioButton, isFalse && styles.radioButtonSelected]}>
            {isFalse && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[
            styles.radioLabel,
            question.isReadOnly && styles.disabledText
          ]}>
            {question.locLabelFalse?.renderedHtml || 'No'}
          </Text>
        </TouchableOpacity>

        {question.showIndeterminateState && (
          <TouchableOpacity
            style={[styles.radioItem, question.isReadOnly && styles.disabledItem]}
            onPress={() => handlePress(undefined)}
            disabled={question.isReadOnly}
            accessibilityRole="radio"
            accessibilityState={{ checked: isIndeterminate, disabled: question.isReadOnly }}
          >
            <View style={[styles.radioButton, isIndeterminate && styles.radioButtonSelected]}>
              {isIndeterminate && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={[
              styles.radioLabel,
              question.isReadOnly && styles.disabledText
            ]}>
              {question.locIndeterminateLabel?.renderedHtml || 'Don\'t know'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderTitle = () => {
    if (!question.hasTitle) return null;

    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {question.processedTitle}
          {question.isRequired && <Text style={styles.requiredText}> *</Text>}
        </Text>
      </View>
    );
  };

  const renderDescription = () => {
    if (!question.description) return null;

    return (
      <Text style={styles.description}>{question.description}</Text>
    );
  };

  const renderErrors = () => {
    if (!question.hasErrors()) return null;

    return (
      <View style={styles.errorContainer}>
        {question.getAllErrors().map((error, index) => (
          <Text key={index} style={styles.errorText}>
            {error.locText.renderedHtml}
          </Text>
        ))}
      </View>
    );
  };

  const renderClearButton = () => {
    if (!question.canShowClearButton || question.value === undefined) return null;

    return (
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => onChange(undefined)}
        accessibilityLabel="Clear selection"
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    );
  };

  // Determine rendering style based on question properties
  const renderStyle = question.renderAs || 'default';
  
  const renderContent = () => {
    switch (renderStyle) {
      case 'checkbox':
        return renderCheckbox();
      case 'radio':
        return renderRadioButtons();
      default:
        return renderToggleSwitch();
    }
  };

  return (
    <View style={styles.root}>
      {renderTitle()}
      {renderDescription()}
      {renderContent()}
      {renderClearButton()}
      {renderErrors()}
    </View>
  );
}

// Register the component
ReactNativeQuestionFactory.Instance.registerQuestion('boolean', (props) => {
  return React.createElement(SurveyQuestionBoolean, props);
});