# React Native Survey Library Project Context

## Project Goal
Create a React Native module that ports SurveyJS Form Library to React Native with new architecture support.

## Current Status
- Initial research completed
- Architecture planned
- Ready to begin implementation

## Key Technical Decisions
1. **New Architecture**: Build with TurboModules/Fabric from start
2. **TypeScript**: Full TypeScript support with proper types
3. **Survey Core**: Reuse survey-core for business logic
4. **Example App**: Include comprehensive example app for testing

## Development Guidelines
- Follow React Native module best practices
- Maintain API compatibility with SurveyJS where possible
- Prioritize mobile UX patterns
- Test on both iOS and Android

## Next Steps
1. Set up module with create-react-native-library
2. Implement basic Survey component
3. Port question types incrementally
4. Add native modules as needed

## Important Links
- SurveyJS Docs: https://surveyjs.io/documentation
- SurveyJS GitHub: https://github.com/surveyjs/survey-library
- React Implementation: packages/survey-react-ui

## Commands to Remember
```bash
# When setting up
npx create-react-native-library react-native-survey-library --type module-new

# Testing
cd example && yarn ios
cd example && yarn android

# Building
yarn prepare
```