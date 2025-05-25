import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import { QuestionTextModel } from 'survey-core';
import { SurveyQuestionUncontrolledElement } from '../base/SurveyQuestionElementBase';
import { useQuestionStyles } from '../../hooks/useQuestionStyles';
import { ReactNativeQuestionFactory } from '../../factories/ReactNativeQuestionFactory';

export class SurveyQuestionText extends SurveyQuestionUncontrolledElement<QuestionTextModel> {
  constructor(props: any) {
    super(props);
    this.state = { 
      isEmpty: this.question.isEmpty(),
      isFocused: false 
    };
  }

  protected renderElement(): React.ReactElement {
    return <TextQuestion question={this.question} onChange={this.updateValueOnEvent} />;
  }

  protected setValueCore(newValue: any) {
    this.question.value = newValue;
  }

  protected getValueCore(): any {
    return this.question.value || '';
  }
}

interface TextQuestionProps {
  question: QuestionTextModel;
  onChange: (value: string) => void;
}

function TextQuestion({ question, onChange }: TextQuestionProps) {
  const { styles } = useQuestionStyles(question);
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    onChange(text);
  };

  const handleFocus = (event: any) => {
    setIsFocused(true);
    question.onFocus(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    question.onBlur(event);
  };

  const renderInput = () => {
    const baseInputStyle = [
      styles.input || styles.default,
      question.inputType === 'comment' && styles.multiline,
      isFocused && styles.focused,
      question.hasError && styles.error,
      question.isReadOnly && styles.disabled,
    ].filter(Boolean);

    return (
      <TextInput
        style={baseInputStyle}
        value={question.value || ''}
        onChangeText={handleChangeText}
        placeholder={question.placeHolder}
        placeholderTextColor="#999"
        editable={!question.isReadOnly}
        multiline={question.inputType === 'comment'}
        numberOfLines={question.inputType === 'comment' ? 4 : 1}
        keyboardType={getKeyboardType(question.inputType)}
        autoCapitalize={getAutoCapitalize(question.inputType)}
        autoCorrect={question.inputType !== 'email' && question.inputType !== 'url'}
        autoComplete={getAutoComplete(question.inputType)}
        secureTextEntry={question.inputType === 'password'}
        maxLength={question.getMaxLength() || undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        testID={question.inputId}
        accessibilityLabel={question.locTitle.renderedHtml}
        accessibilityHint={question.locDescription.renderedHtml}
        {...(Platform.OS === 'web' ? { id: question.inputId } : {})}
      />
    );
  };

  const renderClearButton = () => {
    if (!question.allowClear || !question.value) return null;

    return (
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => onChange('')}
        accessibilityLabel="Clear"
      >
        <Text style={styles.clearButtonText}>✕</Text>
      </TouchableOpacity>
    );
  };

  const renderCounter = () => {
    const maxLength = question.getMaxLength();
    if (!maxLength) return null;

    const currentLength = (question.value || '').length;
    const remaining = maxLength - currentLength;

    return (
      <Text style={styles.remainingCharacterCounter}>
        {remaining} {question.locRemainingCharacterText.renderedHtml}
      </Text>
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

  return (
    <View style={styles.root}>
      {renderTitle()}
      {renderDescription()}
      <View style={styles.wrapper}>
        {renderInput()}
        {renderClearButton()}
      </View>
      {renderCounter()}
      {renderErrors()}
    </View>
  );
}

// Helper functions
function getKeyboardType(inputType: string): any {
  switch (inputType) {
    case 'number':
      return 'numeric';
    case 'email':
      return 'email-address';
    case 'tel':
      return 'phone-pad';
    case 'url':
      return 'url';
    default:
      return 'default';
  }
}

function getAutoCapitalize(inputType: string): any {
  switch (inputType) {
    case 'email':
    case 'url':
      return 'none';
    case 'text':
    case 'comment':
      return 'sentences';
    default:
      return 'none';
  }
}

function getAutoComplete(inputType: string): any {
  switch (inputType) {
    case 'email':
      return 'email';
    case 'tel':
      return 'tel';
    case 'url':
      return 'url';
    case 'password':
      return 'password';
    default:
      return 'off';
  }
}

// Register the component
ReactNativeQuestionFactory.Instance.registerQuestion('text', (props) => {
  return React.createElement(SurveyQuestionText, props);
});

ReactNativeQuestionFactory.Instance.registerQuestion('comment', (props) => {
  return React.createElement(SurveyQuestionText, props);
});