import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuestionCheckboxModel } from 'survey-core';
import { SurveyQuestionUncontrolledElement } from '../base/SurveyQuestionElementBase';
import { useQuestionStyles } from '../../hooks/useQuestionStyles';
import { ReactNativeQuestionFactory } from '../../factories/ReactNativeQuestionFactory';

export class SurveyQuestionCheckbox extends SurveyQuestionUncontrolledElement<QuestionCheckboxModel> {
  constructor(props: any) {
    super(props);
    this.state = { 
      value: this.question.value || []
    };
  }

  protected renderElement(): React.ReactElement {
    return <CheckboxQuestion question={this.question} onChange={this.updateValueOnEvent} />;
  }

  protected setValueCore(newValue: any) {
    this.question.value = newValue;
  }

  protected getValueCore(): any {
    return this.question.value || [];
  }
}

interface CheckboxQuestionProps {
  question: QuestionCheckboxModel;
  onChange: (value: any[]) => void;
}

function CheckboxQuestion({ question, onChange }: CheckboxQuestionProps) {
  const { styles } = useQuestionStyles(question);

  const handlePress = (itemValue: any) => {
    if (question.isReadOnly) return;

    const currentValue = question.value || [];
    const newValue = [...currentValue];
    const index = newValue.indexOf(itemValue);

    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(itemValue);
    }

    onChange(newValue);
  };

  const renderCheckboxItem = (item: any, index: number) => {
    const isChecked = (question.value || []).includes(item.value);
    const isDisabled = question.isReadOnly || !item.isEnabled;

    return (
      <TouchableOpacity
        key={item.value}
        style={[styles.checkboxItem, isDisabled && styles.disabledItem]}
        onPress={() => handlePress(item.value)}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.checkboxLabel, isDisabled && styles.disabledText]}>
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

  const renderSelectAll = () => {
    if (!question.hasSelectAll) return null;

    const allSelected = question.isAllSelected;

    return (
      <TouchableOpacity
        style={[styles.selectAllButton, question.isReadOnly && styles.disabledItem]}
        onPress={() => {
          if (!question.isReadOnly) {
            if (allSelected) {
              onChange([]);
            } else {
              onChange(question.visibleChoices.map(choice => choice.value));
            }
          }
        }}
        disabled={question.isReadOnly}
      >
        <Text style={[styles.selectAllText, question.isReadOnly && styles.disabledText]}>
          {allSelected ? 'Deselect All' : 'Select All'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOther = () => {
    if (!question.hasOther || !(question.value || []).includes(question.otherItem.value)) return null;

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
      {renderSelectAll()}
      <View style={styles.itemsContainer}>
        {question.visibleChoices.map((item, index) => renderCheckboxItem(item, index))}
      </View>
      {renderOther()}
      {renderErrors()}
    </View>
  );
}

// Register the component
ReactNativeQuestionFactory.Instance.registerQuestion('checkbox', (props) => {
  return React.createElement(SurveyQuestionCheckbox, props);
});