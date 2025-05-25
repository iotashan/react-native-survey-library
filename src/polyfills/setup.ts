/**
 * Setup polyfills for browser APIs in React Native
 * This should be imported at the very top of the app before any other imports
 */

// Check if we're in React Native environment (without importing RN modules)
const isReactNative = typeof global !== 'undefined' && 
  global.navigator && 
  typeof global.navigator.product === 'string';

if (isReactNative || typeof global !== 'undefined') {
  // Window setup
  if (typeof global !== 'undefined' && !global.window) {
    (global as any).window = global;
  }

  // Event handling
  const eventListeners: { [key: string]: Function[] } = {};
  
  if (typeof window !== 'undefined') {
    if (!window.addEventListener) {
      (window as any).addEventListener = function(type: string, listener: Function) {
        if (!eventListeners[type]) {
          eventListeners[type] = [];
        }
        eventListeners[type].push(listener);
      };
    }

    if (!window.removeEventListener) {
      (window as any).removeEventListener = function(type: string, listener: Function) {
        if (eventListeners[type]) {
          const index = eventListeners[type].indexOf(listener);
          if (index > -1) {
            eventListeners[type].splice(index, 1);
          }
        }
      };
    }

    if (!window.dispatchEvent) {
      (window as any).dispatchEvent = function(event: any) {
        const listeners = eventListeners[event.type];
        if (listeners) {
          listeners.forEach(listener => listener(event));
        }
        return true;
      };
    }

    // Location
    if (!window.location) {
      (window as any).location = {
        href: 'http://localhost/',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
        reload: () => {},
        assign: () => {},
        replace: () => {},
      };
    }

    // Window dimensions - use static defaults to avoid importing RN too early
    if (!window.innerWidth) {
      (window as any).innerWidth = 375; // Default iPhone width
    }
    if (!window.innerHeight) {
      (window as any).innerHeight = 667; // Default iPhone height
    }

    // Animation frames
    if (!window.requestAnimationFrame) {
      (window as any).requestAnimationFrame = (callback: Function) => {
        return setTimeout(callback, 16);
      };
    }
    if (!window.cancelAnimationFrame) {
      (window as any).cancelAnimationFrame = clearTimeout;
    }

    // getComputedStyle polyfill
    if (!window.getComputedStyle) {
      (window as any).getComputedStyle = (element: any) => {
        return element.style || {};
      };
    }

    // Document
    if (!window.document && typeof global !== 'undefined') {
      (global as any).document = {
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          attributes: {},
          appendChild: () => {},
          removeChild: () => {},
          setAttribute: () => {},
          getAttribute: () => null,
          addEventListener: () => {},
          removeEventListener: () => {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {},
          },
        }),
        createTextNode: (text: string) => ({ nodeValue: text }),
        createDocumentFragment: () => ({
          appendChild: () => {},
          querySelector: () => null,
          querySelectorAll: () => [],
        }),
        getElementById: () => null,
        getElementsByClassName: () => [],
        getElementsByTagName: () => [],
        querySelector: () => null,
        querySelectorAll: () => [],
        body: {
          appendChild: () => {},
          removeChild: () => {},
          style: {},
        },
        head: {
          appendChild: () => {},
        },
        documentElement: {
          style: {},
        },
        addEventListener: () => {},
        removeEventListener: () => {},
        createEvent: () => ({
          initEvent: () => {},
        }),
      };
      (window as any).document = (global as any).document;
    }

    // Navigator - use minimal polyfill without RN dependencies
    if (!window.navigator && typeof global !== 'undefined') {
      (global as any).navigator = {
        userAgent: 'ReactNative',
        platform: 'ReactNative',
        language: 'en-US',
        languages: ['en-US'],
        onLine: true,
        cookieEnabled: false,
        appCodeName: 'Mozilla',
        appName: 'Netscape',
        appVersion: '5.0',
        product: 'ReactNative',
        productSub: '20030107',
        vendor: '',
        vendorSub: '',
      };
      if (!window.navigator) {
        (window as any).navigator = (global as any).navigator;
      }
    }

    // Storage
    const storage: { [key: string]: string } = {};
    const createStorage = () => ({
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = String(value); },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(key => delete storage[key]); },
      key: (index: number) => Object.keys(storage)[index] || null,
      get length() { return Object.keys(storage).length; },
    });

    if (!window.localStorage) {
      (window as any).localStorage = createStorage();
    }
    if (!window.sessionStorage) {
      (window as any).sessionStorage = createStorage();
    }

    // Global constructors
    if (typeof global !== 'undefined') {
      if (!global.HTMLElement) {
        (global as any).HTMLElement = class HTMLElement {};
      }
      if (!global.Element) {
        (global as any).Element = class Element {};
      }
      if (!global.Node) {
        (global as any).Node = class Node {};
      }
      if (!global.Event) {
        (global as any).Event = class Event {
          constructor(public type: string) {}
        };
      }
      if (!global.CustomEvent) {
        (global as any).CustomEvent = class CustomEvent extends (global as any).Event {
          constructor(type: string, public detail?: any) {
            super(type);
          }
        };
      }
    }
  }
}