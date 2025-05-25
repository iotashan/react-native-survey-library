/**
 * Wrapper for survey-core that ensures polyfills are loaded first
 */
import { ensurePolyfills } from './polyfills/browser-polyfills';

// Ensure polyfills are set up
ensurePolyfills();

// Import survey-core types and classes
// We need to be explicit about what we export to avoid hoisting issues
export type {
  SurveyModel as SurveyModelType,
  Question,
  PageModel,
  PanelModel,
  SurveyError,
  Base,
  ArrayChanges,
} from 'survey-core';

// Create a wrapper class for SurveyModel
let _SurveyCore: any;

function getSurveyCore() {
  if (!_SurveyCore) {
    ensurePolyfills();
    _SurveyCore = require('survey-core');
  }
  return _SurveyCore;
}

export class SurveyModel {
  private _model: any;
  
  constructor(json?: any) {
    const surveyCore = getSurveyCore();
    this._model = new surveyCore.Model(json);
    
    // Proxy all properties and methods to the actual model
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          return (target as any)[prop];
        }
        const value = target._model[prop];
        if (typeof value === 'function') {
          return value.bind(target._model);
        }
        return value;
      },
      set(target, prop, value) {
        target._model[prop] = value;
        return true;
      }
    });
  }
  
  // Expose commonly used properties for TypeScript
  get data(): any { return this._model.data; }
  get state(): string { return this._model.state; }
  get currentPageNo(): number { return this._model.currentPageNo; }
  get isFirstPage(): boolean { return this._model.isFirstPage; }
  get isLastPage(): boolean { return this._model.isLastPage; }
  get activePage(): any { return this._model.activePage; }
  get title(): string { return this._model.title; }
  get description(): string { return this._model.description; }
  get completedHtml(): string { return this._model.completedHtml; }
  get loadingHtml(): string { return this._model.loadingHtml; }
  get emptySurveyText(): string { return this._model.emptySurveyText; }
  
  // Expose commonly used methods
  nextPage(): void { this._model.nextPage(); }
  prevPage(): void { this._model.prevPage(); }
  completeLastPage(): void { this._model.completeLastPage(); }
  complete(): void { this._model.complete(); }
  
  // Event properties
  get onValueChanged(): any { return this._model.onValueChanged; }
  get onComplete(): any { return this._model.onComplete; }
  get onCurrentPageChanged(): any { return this._model.onCurrentPageChanged; }
}