import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuestionRadiogroupModel } from 'survey-core';
import { SurveyQuestionUncontrolledElement } from '../base/SurveyQuestionElementBase';
import { useQuestionStyles } from '../../hooks/useQuestionStyles';
import { ReactNativeQuestionFactory } from '../../factories/ReactNativeQuestionFactory';

export class SurveyQuestionRadioGroup extends SurveyQuestionUncontrolledElement<QuestionRadiogroupModel> {
  constructor(props: any) {
    super(props);
    this.state = { 
      value: this.question.value 
    };
  }

  protected renderElement(): React.ReactElement {
    return <RadioGroupQuestion question={this.question} onChange={this.updateValueOnEvent} />;
  }

  protected setValueCore(newValue: any) {
    this.question.value = newValue;
  }

  protected getValueCore(): any {
    return this.question.value;
  }
}

interface RadioGroupQuestionProps {
  question: QuestionRadiogroupModel;
  onChange: (value: any) => void;
}

function RadioGroupQuestion({ question, onChange }: RadioGroupQuestionProps) {
  const { styles } = useQuestionStyles(question);

  const handlePress = (value: any) => {
    if (!question.isReadOnly) {
      onChange(value);
    }
  };

  const renderRadioItem = (item: any, index: number) => {
    const isSelected = question.value === item.value;
    const isDisabled = question.isReadOnly || !item.isEnabled;

    return (
      <TouchableOpacity
        key={item.value}
        style={[styles.radioItem, isDisabled && styles.disabledItem]}
        onPress={() => handlePress(item.value)}
        disabled={isDisabled}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      >
        <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={[styles.radioLabel, isDisabled && styles.disabledText]}>
          {item.locText.renderedHtml}
        </Text>
      </TouchableOpacity>
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
    if (!question.canShowClearButton || !question.value) return null;

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

  const renderOther = () => {
    if (!question.hasOther || question.value !== question.otherItem.value) return null;

    return (
      <View style={styles.otherContainer}>
        <Text style={styles.otherLabel}>Please specify:</Text>
        {/* Other text input would go here - can be implemented later */}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderTitle()}
      {renderDescription()}
      <View style={styles.itemsContainer}>
        {question.visibleChoices.map((item, index) => renderRadioItem(item, index))}
      </View>
      {renderOther()}
      {renderClearButton()}
      {renderErrors()}
    </View>
  );
}

// Register the component
ReactNativeQuestionFactory.Instance.registerQuestion('radiogroup', (props) => {
  return React.createElement(SurveyQuestionRadioGroup, props);
});