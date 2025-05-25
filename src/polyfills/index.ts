/**
 * Polyfills for browser APIs that survey-core expects but don't exist in React Native
 * This file should be imported before any survey-core imports
 */

import { setupWindowPolyfill } from './window';
import { setupDocumentPolyfill } from './document';
import { setupNavigatorPolyfill } from './navigator';
import { setupLocalStoragePolyfill } from './localStorage';
import { setupFetchPolyfill } from './fetch';
import { setupConsolePolyfill } from './console';

// Global type augmentations
declare global {
  interface Window {
    addEventListener: (type: string, listener: EventListener | EventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: (type: string, listener: EventListener | EventListenerObject, options?: boolean | EventListenerOptions) => void;
    dispatchEvent: (event: Event) => boolean;
    location: {
      href: string;
      protocol: string;
      host: string;
      hostname: string;
      port: string;
      pathname: string;
      search: string;
      hash: string;
    };
    navigator: Navigator;
    document: Document;
    localStorage: Storage;
  }
}

/**
 * Initialize all polyfills needed for survey-core in React Native
 */
export function initializePolyfills(): void {
  // Only run in React Native environment
  if (typeof window === 'undefined' || typeof document !== 'undefined') {
    return;
  }

  setupWindowPolyfill();
  setupDocumentPolyfill();
  setupNavigatorPolyfill();
  setupLocalStoragePolyfill();
  setupFetchPolyfill();
  setupConsolePolyfill();
}

// Auto-initialize polyfills when this module is imported
initializePolyfills();