import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Survey } from '../../components/containers/Survey';
import { Model } from 'survey-core';

describe('Survey Examples Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Survey Example', () => {
    let basicSurvey: Model;

    beforeEach(() => {
      basicSurvey = new Model({
        title: 'Customer Feedback Survey',
        pages: [
          {
            name: 'page1',
            elements: [
              {
                type: 'text',
                name: 'name',
                title: 'What is your name?',
                isRequired: true
              },
              {
                type: 'text',
                name: 'email',
                title: 'What is your email?',
                inputType: 'email',
                validators: [{ type: 'email' }]
              }
            ]
          }
        ]
      });
    });

    it('should complete basic survey flow', async () => {
      const onComplete = jest.fn();
      const { getByTestId, getByText } = render(
        <Survey model={basicSurvey} onComplete={onComplete} />
      );

      // Check survey title
      expect(getByText('Customer Feedback Survey')).toBeTruthy();

      // Fill in name
      const nameInput = getByTestId('survey-text-input');
      fireEvent.changeText(nameInput, 'John Doe');

      // Fill in email
      const inputs = getByTestId('survey-page').findAllByType('TextInput');
      fireEvent.changeText(inputs[1], 'john@example.com');

      // Complete survey
      const completeButton = getByTestId('survey-nav-complete');
      fireEvent.press(completeButton);

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith(basicSurvey);
        expect(basicSurvey.data).toEqual({
          name: 'John Doe',
          email: 'john@example.com'
        });
      });
    });
  });

  describe('Multi-Page Survey Example', () => {
    let multiPageSurvey: Model;

    beforeEach(() => {
      multiPageSurvey = new Model({
        title: 'Employee Satisfaction Survey',
        pages: [
          {
            name: 'personalInfo',
            title: 'Personal Information',
            elements: [
              {
                type: 'text',
                name: 'firstName',
                title: 'First Name',
                isRequired: true
              },
              {
                type: 'text',
                name: 'lastName',
                title: 'Last Name',
                isRequired: true
              }
            ]
          },
          {
            name: 'workInfo',
            title: 'Work Information',
            elements: [
              {
                type: 'text',
                name: 'department',
                title: 'Department'
              },
              {
                type: 'text',
                name: 'position',
                title: 'Position'
              }
            ]
          }
        ],
        showProgressBar: 'top'
      });
    });

    it('should navigate through multiple pages', async () => {
      const { getByTestId, getByText } = render(
        <Survey model={multiPageSurvey} />
      );

      // Check first page
      expect(getByText('Personal Information')).toBeTruthy();
      expect(getByText('First Name')).toBeTruthy();

      // Fill required fields
      const inputs = getByTestId('survey-page').findAllByType('TextInput');
      fireEvent.changeText(inputs[0], 'John');
      fireEvent.changeText(inputs[1], 'Doe');

      // Navigate to next page
      const nextButton = getByTestId('survey-nav-next');
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(getByText('Work Information')).toBeTruthy();
        expect(getByText('Department')).toBeTruthy();
      });

      // Navigate back
      const prevButton = getByTestId('survey-nav-prev');
      fireEvent.press(prevButton);

      await waitFor(() => {
        expect(getByText('Personal Information')).toBeTruthy();
      });
    });
  });

  describe('Validation Survey Example', () => {
    let validationSurvey: Model;

    beforeEach(() => {
      validationSurvey = new Model({
        pages: [
          {
            elements: [
              {
                type: 'text',
                name: 'age',
                title: 'What is your age?',
                inputType: 'number',
                validators: [
                  { type: 'numeric', minValue: 18, maxValue: 100 }
                ],
                isRequired: true
              },
              {
                type: 'text',
                name: 'email',
                title: 'Email Address',
                inputType: 'email',
                validators: [
                  { type: 'email' },
                  { type: 'regex', regex: '^[^@]+@company\\.com$', text: 'Please use company email' }
                ]
              }
            ]
          }
        ]
      });
    });

    it('should validate numeric input', async () => {
      const { getByTestId, getByText, queryByText } = render(
        <Survey model={validationSurvey} />
      );

      const ageInput = getByTestId('survey-text-input');
      
      // Test invalid age (too young)
      fireEvent.changeText(ageInput, '15');
      validationSurvey.validate();

      await waitFor(() => {
        expect(queryByText(/must be at least 18/i)).toBeTruthy();
      });

      // Test valid age
      fireEvent.changeText(ageInput, '25');
      validationSurvey.validate();

      await waitFor(() => {
        expect(queryByText(/must be at least 18/i)).toBeNull();
      });
    });

    it('should validate email format and pattern', async () => {
      const { getByTestId, queryByText } = render(
        <Survey model={validationSurvey} />
      );

      const inputs = getByTestId('survey-page').findAllByType('TextInput');
      const emailInput = inputs[1];

      // Test invalid email format
      fireEvent.changeText(emailInput, 'invalid-email');
      validationSurvey.validate();

      await waitFor(() => {
        expect(queryByText(/valid email/i)).toBeTruthy();
      });

      // Test valid format but wrong domain
      fireEvent.changeText(emailInput, 'test@gmail.com');
      validationSurvey.validate();

      await waitFor(() => {
        expect(queryByText(/company email/i)).toBeTruthy();
      });

      // Test valid company email
      fireEvent.changeText(emailInput, 'test@company.com');
      validationSurvey.validate();

      await waitFor(() => {
        expect(queryByText(/company email/i)).toBeNull();
      });
    });
  });

  describe('Conditional Logic Survey Example', () => {
    let conditionalSurvey: Model;

    beforeEach(() => {
      conditionalSurvey = new Model({
        pages: [
          {
            elements: [
              {
                type: 'text',
                name: 'hasKids',
                title: 'Do you have children?',
                choices: ['Yes', 'No']
              },
              {
                type: 'text',
                name: 'kidsCount',
                title: 'How many children do you have?',
                visibleIf: '{hasKids} = "Yes"',
                inputType: 'number'
              },
              {
                type: 'text',
                name: 'schoolInfo',
                title: 'What schools do they attend?',
                visibleIf: '{hasKids} = "Yes" and {kidsCount} > 0'
              }
            ]
          }
        ]
      });
    });

    it('should show/hide questions based on conditions', async () => {
      const { getByTestId, getByText, queryByText } = render(
        <Survey model={conditionalSurvey} />
      );

      // Initially only first question visible
      expect(getByText('Do you have children?')).toBeTruthy();
      expect(queryByText('How many children do you have?')).toBeNull();

      // Select "Yes"
      const hasKidsInput = getByTestId('survey-text-input');
      fireEvent.changeText(hasKidsInput, 'Yes');

      await waitFor(() => {
        expect(queryByText('How many children do you have?')).toBeTruthy();
      });

      // Enter number of kids
      const inputs = getByTestId('survey-page').findAllByType('TextInput');
      fireEvent.changeText(inputs[1], '2');

      await waitFor(() => {
        expect(queryByText('What schools do they attend?')).toBeTruthy();
      });

      // Change answer to "No"
      fireEvent.changeText(hasKidsInput, 'No');

      await waitFor(() => {
        expect(queryByText('How many children do you have?')).toBeNull();
        expect(queryByText('What schools do they attend?')).toBeNull();
      });
    });
  });

  describe('Styling and Theming Example', () => {
    let themedSurvey: Model;

    beforeEach(() => {
      themedSurvey = new Model({
        title: 'Styled Survey',
        pages: [{
          elements: [{
            type: 'text',
            name: 'styledQuestion',
            title: 'This is a styled question'
          }]
        }]
      });

      // Apply theme variables
      themedSurvey.themeVariables = {
        '--primary-color': '#ff6b6b',
        '--font-size': '18px',
        '--spacing-medium': '24px'
      };
    });

    it('should apply custom theme styles', () => {
      const customCss = {
        survey: { backgroundColor: '#f0f0f0' },
        question: { padding: 20 },
        questionTitle: { color: '#333', fontSize: 20 }
      };

      const { getByTestId } = render(
        <Survey model={themedSurvey} css={customCss} />
      );

      const surveyContainer = getByTestId('survey-container');
      const questionContainer = getByTestId('survey-question');

      expect(surveyContainer.props.style).toMatchObject({ backgroundColor: '#f0f0f0' });
      expect(questionContainer.props.style).toMatchObject({ padding: 20 });
    });
  });
});