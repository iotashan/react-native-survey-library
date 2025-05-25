/* eslint-env jest */
// Jest setup file for React Native Survey Library

// Set up global window object for survey-core
global.window = global.window || {};
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();
global.navigator = global.navigator || {};
global.document = global.document || {};

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native modules that might not be available in test environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Override any problematic components or APIs
  RN.NativeModules = {
    ...RN.NativeModules,
  };

  return RN;
});

// Survey-core will be loaded normally, not mocked

// Global test utilities
global.mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeAll(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
};