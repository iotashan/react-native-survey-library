// Load polyfills first before any React Native imports
import '../../polyfills/setup';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuestionRatingModel } from '../../survey-core-wrapper';
import { SurveyQuestionUncontrolledElement } from '../base/SurveyQuestionElementBase';
import { useQuestionStyles } from '../../hooks/useQuestionStyles';
import { ReactNativeQuestionFactory } from '../../factories/ReactNativeQuestionFactory';

export class SurveyQuestionRating extends SurveyQuestionUncontrolledElement<QuestionRatingModel> {
  constructor(props: any) {
    super(props);
    this.state = { 
      value: this.question.value 
    };
  }

  protected renderElement(): React.ReactElement {
    return <RatingQuestion question={this.question} onChange={this.updateValueOnEvent} />;
  }

  protected setValueCore(newValue: any) {
    this.question.value = newValue;
  }

  protected getValueCore(): any {
    return this.question.value;
  }
}

interface RatingQuestionProps {
  question: QuestionRatingModel;
  onChange: (value: any) => void;
}

function RatingQuestion({ question, onChange }: RatingQuestionProps) {
  const { styles } = useQuestionStyles(question);

  const handlePress = (value: number) => {
    if (!question.isReadOnly) {
      onChange(value);
    }
  };

  const renderRatingItem = (value: number) => {
    const isSelected = question.value === value;
    const rateLabel = question.rateValues?.find(rv => rv.value === value);
    const displayText = rateLabel ? rateLabel.locText.renderedHtml : String(value);

    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.ratingItem,
          isSelected && styles.ratingItemSelected,
          question.isReadOnly && styles.disabledItem
        ]}
        onPress={() => handlePress(value)}
        disabled={question.isReadOnly}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: question.isReadOnly }}
        accessibilityLabel={`Rating ${value}${rateLabel ? `: ${displayText}` : ''}`}
      >
        <Text style={[
          styles.ratingText,
          isSelected && styles.ratingTextSelected,
          question.isReadOnly && styles.disabledText
        ]}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStarRating = () => {
    const rateCount = question.rateCount || 5;
    const stars = [];
    
    for (let i = 1; i <= rateCount; i++) {
      const isSelected = question.value >= i;
      stars.push(
        <TouchableOpacity
          key={i}
          style={[styles.starButton, question.isReadOnly && styles.disabledItem]}
          onPress={() => handlePress(i)}
          disabled={question.isReadOnly}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: question.isReadOnly }}
          accessibilityLabel={`${i} star${i > 1 ? 's' : ''}`}
        >
          <Text style={[
            styles.starText,
            isSelected && styles.starTextSelected,
            question.isReadOnly && styles.disabledText
          ]}>
            {isSelected ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderScale = () => {
    const rateMin = question.rateMin || 1;
    const rateMax = question.rateMax || 5;
    const items = [];
    
    for (let i = rateMin; i <= rateMax; i++) {
      items.push(renderRatingItem(i));
    }
    
    return <View style={styles.scaleContainer}>{items}</View>;
  };

  const renderLabels = () => {
    if (!question.minRateDescription && !question.maxRateDescription) return null;

    return (
      <View style={styles.ratingLabels}>
        {question.minRateDescription && (
          <Text style={styles.ratingLabelMin}>{question.minRateDescription}</Text>
        )}
        <View style={{ flex: 1 }} />
        {question.maxRateDescription && (
          <Text style={styles.ratingLabelMax}>{question.maxRateDescription}</Text>
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
    if (!question.canShowClearButton || !question.value) return null;

    return (
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => onChange(undefined)}
        accessibilityLabel="Clear rating"
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    );
  };

  // Determine if this should render as stars or scale based on displayMode or rateType
  const useStarDisplay = question.displayMode === 'buttons' || question.rateType === 'stars';

  return (
    <View style={styles.root}>
      {renderTitle()}
      {renderDescription()}
      
      <View style={styles.ratingContainer}>
        {renderLabels()}
        {useStarDisplay ? renderStarRating() : renderScale()}
      </View>
      
      {renderClearButton()}
      {renderErrors()}
    </View>
  );
}

// Register the component
ReactNativeQuestionFactory.Instance.registerQuestion('rating', (props) => {
  return React.createElement(SurveyQuestionRating, props);
});