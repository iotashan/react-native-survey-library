// Load polyfills first before any React Native imports
import '../../polyfills/setup';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { QuestionDropdownModel } from '../../survey-core-wrapper';
import { SurveyQuestionUncontrolledElement } from '../base/SurveyQuestionElementBase';
import { useQuestionStyles } from '../../hooks/useQuestionStyles';
import { ReactNativeQuestionFactory } from '../../factories/ReactNativeQuestionFactory';

export class SurveyQuestionDropdown extends SurveyQuestionUncontrolledElement<QuestionDropdownModel> {
  constructor(props: any) {
    super(props);
    this.state = { 
      value: this.question.value 
    };
  }

  protected renderElement(): React.ReactElement {
    return <DropdownQuestion question={this.question} onChange={this.updateValueOnEvent} />;
  }

  protected setValueCore(newValue: any) {
    this.question.value = newValue;
  }

  protected getValueCore(): any {
    return this.question.value;
  }
}

interface DropdownQuestionProps {
  question: QuestionDropdownModel;
  onChange: (value: any) => void;
}

function DropdownQuestion({ question, onChange }: DropdownQuestionProps) {
  const { styles } = useQuestionStyles(question);
  const [isOpen, setIsOpen] = useState(false);

  const selectedChoice = question.visibleChoices.find(choice => choice.value === question.value);
  const displayText = selectedChoice ? selectedChoice.locText.renderedHtml : question.placeholder || 'Select an option';

  const handleSelect = (value: any) => {
    onChange(value);
    setIsOpen(false);
  };

  const renderChoice = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        item.value === question.value && styles.dropdownItemSelected
      ]}
      onPress={() => handleSelect(item.value)}
      disabled={question.isReadOnly || !item.isEnabled}
    >
      <Text style={[
        styles.dropdownItemText,
        item.value === question.value && styles.dropdownItemTextSelected,
        (!item.isEnabled || question.isReadOnly) && styles.disabledText
      ]}>
        {item.locText.renderedHtml}
      </Text>
    </TouchableOpacity>
  );

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

  return (
    <View style={styles.root}>
      {renderTitle()}
      {renderDescription()}
      
      <TouchableOpacity
        style={[
          styles.dropdownTrigger,
          question.hasError && styles.error,
          question.isReadOnly && styles.disabled
        ]}
        onPress={() => !question.isReadOnly && setIsOpen(true)}
        disabled={question.isReadOnly}
        accessibilityRole="button"
        accessibilityHint="Opens dropdown menu"
      >
        <Text style={[
          styles.dropdownTriggerText,
          !selectedChoice && styles.placeholderText,
          question.isReadOnly && styles.disabledText
        ]}>
          {displayText}
        </Text>
        <Text style={[styles.dropdownArrow, question.isReadOnly && styles.disabledText]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {renderClearButton()}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>
                {question.processedTitle || 'Select an option'}
              </Text>
              <TouchableOpacity
                style={styles.dropdownCloseButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.dropdownCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={question.visibleChoices}
              renderItem={renderChoice}
              keyExtractor={(item) => String(item.value)}
              style={styles.dropdownList}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {renderErrors()}
    </View>
  );
}

// Register the component
ReactNativeQuestionFactory.Instance.registerQuestion('dropdown', (props) => {
  return React.createElement(SurveyQuestionDropdown, props);
});