# React Native Survey Library Architecture

## Overview
A React Native module that ports SurveyJS Form Library functionality to React Native, with full support for the new architecture (TurboModules/Fabric).

## Module Type
- **Type**: React Native Module (npm package)
- **Architecture**: New Architecture (TurboModules/Fabric) with backwards compatibility
- **Language**: TypeScript
- **Platform Support**: iOS & Android

## Project Structure
```
react-native-survey-library/
├── src/                          # TypeScript source
│   ├── components/              # Survey components
│   │   ├── questions/          # Question type components
│   │   ├── navigation/         # Survey navigation
│   │   └── common/             # Shared components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript definitions
│   ├── specs/                  # TurboModule/Fabric specs
│   └── index.tsx               # Main exports
├── ios/                         # iOS native code
│   └── RNSurveyLibrary.mm     # TurboModule implementation
├── android/                     # Android native code
│   └── src/.../RNSurveyLibrary.java
├── example/                     # Example app
│   ├── ios/
│   ├── android/
│   ├── src/
│   └── package.json
├── lib/                        # Compiled output
├── package.json
├── tsconfig.json
└── react-native.config.js
```

## Key Design Decisions

### 1. New Architecture First
- Use Fabric for custom view components
- TurboModules for native functionality
- Codegen for type safety
- Support old architecture via compatibility layer

### 2. Component Strategy
- Pure JS/TS for most question types
- Native modules only for:
  - Signature pad (canvas drawing)
  - File picker integration
  - Camera/gallery access
  - Performance-critical matrix views

### 3. Survey Core Integration
- Reuse `survey-core` for model/logic
- Implement React Native-specific renderers
- Maintain API compatibility

### 4. Testing Strategy
- Example app with all question types
- Jest for unit tests
- Detox for E2E tests
- Manual testing on physical devices

## Implementation Phases

### Phase 1: Module Setup
- Initialize with create-react-native-library
- Configure TypeScript and new architecture
- Set up example app
- Basic Survey component

### Phase 2: Core Components
- Text input questions
- Choice questions (radio/checkbox)
- Basic navigation
- Theme system

### Phase 3: Advanced Components
- Matrix questions
- Dynamic panels
- File/image handling
- Signature pad

### Phase 4: Native Modules
- TurboModule for file operations
- Fabric component for signature
- Platform-specific optimizations

### Phase 5: Polish & Release
- Performance optimization
- Accessibility
- Documentation
- npm publication