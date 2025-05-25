// Register all question components lazily
export function registerAllComponents() {
  // Import and register components when called
  require('./components/questions/SurveyQuestionText');
  require('./components/questions/SurveyQuestionRadioGroup');
  require('./components/questions/SurveyQuestionCheckbox');
  require('./components/questions/SurveyQuestionDropdown');
  require('./components/questions/SurveyQuestionRating');
  require('./components/questions/SurveyQuestionBoolean');
}

// Auto-register on import
registerAllComponents();