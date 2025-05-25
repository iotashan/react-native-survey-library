import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PanelModel, Question } from '../../survey-core-wrapper';
import { SurveyElementBase } from '../base/SurveyElementBase';
import { useSurveyTheme } from '../../hooks/useSurveyTheme';
import type { ISurveyCreator } from '../../types/survey-types';

interface IPanelProps {
  panel: PanelModel;
  survey: any;
  creator: ISurveyCreator;
  css?: any;
}

export class SurveyPanel extends SurveyElementBase<IPanelProps, any> {
  constructor(props: IPanelProps) {
    super(props);
  }

  protected getStateElement() {
    return this.props.panel;
  }

  protected renderElement(): React.ReactElement {
    return <PanelContent {...this.props} />;
  }

  protected canRender(): boolean {
    return !!this.props.panel && this.props.panel.isVisible;
  }
}

function PanelContent({ panel, creator }: IPanelProps) {
  const { theme } = useSurveyTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(panel.isCollapsed);

  React.useEffect(() => {
    setIsCollapsed(panel.isCollapsed);
  }, [panel.isCollapsed]);

  const handleToggleCollapse = () => {
    if (panel.isCollapsed !== undefined) {
      panel.toggleState();
      setIsCollapsed(panel.isCollapsed);
    }
  };

  const renderPanelTitle = () => {
    if (!panel.title || !panel.hasTitle) return null;

    const titleContent = (
      <View style={theme.components.panel.header}>
        <Text style={theme.components.panel.title}>
          {panel.processedTitle}
          {panel.isRequired && <Text style={theme.components.question.requiredText}> *</Text>}
        </Text>
        {panel.description && (
          <Text style={[theme.components.question.description, { marginTop: 4 }]}>
            {panel.description}
          </Text>
        )}
      </View>
    );

    if (panel.isCollapsed !== undefined) {
      return (
        <TouchableOpacity onPress={handleToggleCollapse}>
          {titleContent}
        </TouchableOpacity>
      );
    }

    return titleContent;
  };

  const renderElements = () => {
    if (isCollapsed) return null;

    const rows = panel.rows;
    
    return rows.map((row, rowIndex) => {
      const visibleElements = row.visibleElements;
      if (visibleElements.length === 0) return null;

      return (
        <View key={`row-${rowIndex}`}>
          {visibleElements.map((element, elementIndex) => {
            if (element.isPanel) {
              return (
                <SurveyPanel
                  key={element.id}
                  panel={element as PanelModel}
                  survey={panel.survey}
                  creator={creator}
                />
              );
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

  const renderErrors = () => {
    if (!panel.hasErrors || panel.questionsOrder !== 'default') return null;

    return (
      <View style={{ marginTop: 8 }}>
        {panel.errors.map((error, index) => 
          creator.renderError(`error-${index}`, error, theme.components.question, panel)
        )}
      </View>
    );
  };

  return (
    <View style={theme.components.panel.container}>
      {renderPanelTitle()}
      <View style={theme.components.panel.body}>
        {renderElements()}
        {renderErrors()}
      </View>
    </View>
  );
}