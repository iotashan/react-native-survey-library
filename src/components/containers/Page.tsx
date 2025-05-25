// Load polyfills first before any React Native imports
import '../../polyfills/setup';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PageModel, Question } from '../../survey-core-wrapper';
import { SurveyElementBase } from '../base/SurveyElementBase';
import { useSurveyTheme } from '../../hooks/useSurveyTheme';
import type { ISurveyCreator } from '../../types/survey-types';

interface IPageProps {
  page: PageModel;
  survey: any;
  creator: ISurveyCreator;
  css?: any;
}

export class SurveyPage extends SurveyElementBase<IPageProps, any> {
  constructor(props: IPageProps) {
    super(props);
  }

  protected getStateElement() {
    return this.props.page;
  }

  protected renderElement(): React.ReactElement {
    return <PageContent {...this.props} />;
  }

  protected canRender(): boolean {
    return !!this.props.page && this.props.page.isVisible;
  }
}

function PageContent({ page, creator }: IPageProps) {
  const { styles, theme } = useSurveyTheme();

  const renderPageTitle = () => {
    if (!page.title || !page.hasTitle) return null;
    
    return (
      <View style={{ marginBottom: theme.variables['--panel-spacing'] }}>
        <Text style={[styles.questionTitle, { fontSize: 20, fontWeight: 'bold' }]}>
          {page.processedTitle}
        </Text>
        {page.description && (
          <Text style={styles.questionDescription}>{page.description}</Text>
        )}
      </View>
    );
  };

  const renderElements = () => {
    const rows = page.rows;
    
    return rows.map((row, rowIndex) => {
      const visibleElements = row.visibleElements;
      if (visibleElements.length === 0) return null;

      return (
        <View key={`row-${rowIndex}`} style={{ marginBottom: 8 }}>
          {visibleElements.map((element, elementIndex) => {
            if (element.isPanel) {
              // Will be replaced with Panel component
              return <View key={element.id} />;
            }
            
            if (element.isQuestion) {
              return creator.createQuestionElement(element as Question);
            }
            
            return null;
          })}
        </View>
      );
    });
  };

  return (
    <View>
      {renderPageTitle()}
      {renderElements()}
    </View>
  );
}