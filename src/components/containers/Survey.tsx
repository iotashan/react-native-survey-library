// Load polyfills first before any React Native imports
import '../../polyfills/setup';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Button } from 'react-native';
import { SurveyModel, PageModel } from '../../survey-core-wrapper';
import { SurveyPage } from './Page';
import { ReactNativeSurveyCreator } from '../../ReactNativeSurveyCreator';

export interface SurveyProps {
  model: SurveyModel;
  css?: any;
  onComplete?: (survey: SurveyModel) => void;
  onValueChanged?: (survey: SurveyModel, options: any) => void;
}

export function Survey({ model, css, onComplete, onValueChanged }: SurveyProps) {
  const [, forceUpdate] = useState({});
  const survey = model;

  useEffect(() => {
    // Set up survey callbacks
    const renderCallback = () => {
      forceUpdate({});
    };

    survey.onValueChanged.add((sender, options) => {
      onValueChanged?.(sender, options);
      forceUpdate({});
    });

    survey.onComplete.add((sender) => {
      onComplete?.(sender);
      forceUpdate({});
    });

    // Trigger re-renders when survey state changes
    survey.renderCallback = renderCallback;

    return () => {
      // Cleanup
      survey.renderCallback = undefined as any;
      survey.onValueChanged.clear();
      survey.onComplete.clear();
    };
  }, [survey, onComplete, onValueChanged]);

  // Render based on survey state
  if (survey.state === 'loading') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{survey.loadingHtml || 'Loading...'}</Text>
      </View>
    );
  }

  if (survey.state === 'completed') {
    return (
      <View style={[styles.container, styles.completedContainer]}>
        <Text style={styles.completedText}>
          {survey.completedHtml || 'Thank you for completing the survey!'}
        </Text>
      </View>
    );
  }

  if (survey.state === 'empty') {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>
          {survey.emptySurveyText || 'There are no questions in this survey.'}
        </Text>
      </View>
    );
  }

  const activePage = survey.activePage;
  if (!activePage) return null;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Survey Title */}
        {survey.title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{survey.title}</Text>
          </View>
        )}

        {/* Survey Description */}
        {survey.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{survey.description}</Text>
          </View>
        )}

        {/* Page Content */}
        <SurveyPage
          page={activePage}
          survey={survey}
          creator={ReactNativeSurveyCreator.Instance}
          css={css}
        />

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <View style={styles.navigationButtons}>
            {!survey.isFirstPage && (
              <Button
                title="Previous"
                onPress={() => survey.prevPage()}
              />
            )}
            <View style={{ flex: 1 }} />
            {!survey.isLastPage && (
              <Button
                title="Next"
                onPress={() => survey.nextPage()}
              />
            )}
            {survey.isLastPage && (
              <Button
                title="Complete"
                onPress={() => survey.completeLastPage()}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  completedContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  pageContainer: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  questionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  questionPlaceholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  navigationContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});