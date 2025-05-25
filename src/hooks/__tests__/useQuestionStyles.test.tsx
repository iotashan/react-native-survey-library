import { renderHook } from '@testing-library/react-native';
import { useQuestionStyles } from '../useQuestionStyles';
import { CSSClassMapper } from '../../styles/CSSClassMapper';
import { Question } from 'survey-core';
import { createMockSurveyModel } from '../../__tests__/test-utils';

describe('useQuestionStyles Hook', () => {
  let mockQuestion: Question;

  beforeEach(() => {
    CSSClassMapper.clear();
    
    // Register some test styles
    CSSClassMapper.registerStyles({
      'sv_q_text': { padding: 10 },
      'sv_q_title': { fontSize: 16 },
      'sv_q_required': { color: 'red' },
      'sv_q_description': { fontSize: 12 },
      'sv_q_error': { color: 'red', fontSize: 14 }
    });

    const model = createMockSurveyModel();
    mockQuestion = model.getQuestionByName('question1');
    mockQuestion.cssClasses = {
      root: 'sv_q_text',
      title: 'sv_q_title',
      requiredText: 'sv_q_required',
      description: 'sv_q_description',
      error: 'sv_q_error'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return styles for all question parts', () => {
    const { result } = renderHook(() => useQuestionStyles(mockQuestion));

    expect(result.current.containerStyle).toEqual({ padding: 10 });
    expect(result.current.titleStyle).toEqual({ fontSize: 16 });
    expect(result.current.requiredStyle).toEqual({ color: 'red' });
    expect(result.current.descriptionStyle).toEqual({ fontSize: 12 });
    expect(result.current.errorStyle).toEqual({ color: 'red', fontSize: 14 });
  });

  it('should merge custom CSS styles', () => {
    const customCss = {
      question: { backgroundColor: 'blue' },
      questionTitle: { color: 'white' }
    };

    const { result } = renderHook(() => useQuestionStyles(mockQuestion, customCss));

    expect(result.current.containerStyle).toEqual({
      padding: 10,
      backgroundColor: 'blue'
    });
    expect(result.current.titleStyle).toEqual({
      fontSize: 16,
      color: 'white'
    });
  });

  it('should handle missing cssClasses', () => {
    mockQuestion.cssClasses = {};

    const { result } = renderHook(() => useQuestionStyles(mockQuestion));

    expect(result.current.containerStyle).toEqual({});
    expect(result.current.titleStyle).toEqual({});
    expect(result.current.requiredStyle).toEqual({});
    expect(result.current.descriptionStyle).toEqual({});
    expect(result.current.errorStyle).toEqual({});
  });

  it('should handle null question', () => {
    const { result } = renderHook(() => useQuestionStyles(null as any));

    expect(result.current.containerStyle).toEqual({});
    expect(result.current.titleStyle).toEqual({});
    expect(result.current.requiredStyle).toEqual({});
    expect(result.current.descriptionStyle).toEqual({});
    expect(result.current.errorStyle).toEqual({});
  });

  it('should update styles when question cssClasses change', () => {
    const { result, rerender } = renderHook(
      ({ question }) => useQuestionStyles(question),
      { initialProps: { question: mockQuestion } }
    );

    expect(result.current.containerStyle).toEqual({ padding: 10 });

    // Update CSS class
    mockQuestion.cssClasses.root = 'sv_q_text sv_q_required';

    rerender({ question: mockQuestion });

    expect(result.current.containerStyle).toEqual({
      padding: 10,
      color: 'red'
    });
  });

  it('should handle space-separated CSS classes', () => {
    mockQuestion.cssClasses.root = 'sv_q_text sv_q_required';

    const { result } = renderHook(() => useQuestionStyles(mockQuestion));

    expect(result.current.containerStyle).toEqual({
      padding: 10,
      color: 'red'
    });
  });

  it('should prioritize custom CSS over mapped styles', () => {
    const customCss = {
      question: { padding: 20 }
    };

    const { result } = renderHook(() => useQuestionStyles(mockQuestion, customCss));

    expect(result.current.containerStyle).toEqual({
      padding: 20 // Custom CSS overrides mapped style
    });
  });

  it('should return input styles', () => {
    CSSClassMapper.registerStyle('sv_q_text_input', {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8
    });

    mockQuestion.cssClasses.textInput = 'sv_q_text_input';

    const { result } = renderHook(() => useQuestionStyles(mockQuestion));

    expect(result.current.inputStyle).toEqual({
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8
    });
  });

  it('should merge custom input styles', () => {
    CSSClassMapper.registerStyle('sv_q_text_input', {
      borderWidth: 1,
      borderColor: '#ccc'
    });

    mockQuestion.cssClasses.textInput = 'sv_q_text_input';

    const customCss = {
      textInput: { borderColor: 'blue' }
    };

    const { result } = renderHook(() => useQuestionStyles(mockQuestion, customCss));

    expect(result.current.inputStyle).toEqual({
      borderWidth: 1,
      borderColor: 'blue' // Custom CSS overrides
    });
  });
});