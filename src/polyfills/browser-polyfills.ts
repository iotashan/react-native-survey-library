/**
 * Browser API polyfills for React Native
 * Based on common patterns from react-native-polyfill-globals and expo/browser-polyfill
 */

// TypeScript declarations for our polyfills
declare global {
  interface Window {
    addEventListener: typeof addEventListener;
    removeEventListener: typeof removeEventListener;
    dispatchEvent: typeof dispatchEvent;
    location: Location;
    navigator: Navigator;
    document: Document;
    localStorage: Storage;
    sessionStorage: Storage;
    innerWidth: number;
    innerHeight: number;
    requestAnimationFrame: typeof requestAnimationFrame;
    cancelAnimationFrame: typeof cancelAnimationFrame;
    getComputedStyle: typeof getComputedStyle;
  }
}

let isSetup = false;

export function ensurePolyfills() {
  if (isSetup) {
    return;
  }

  isSetup = true;
  
  console.log('[Polyfills] Starting setup...');
  console.log('[Polyfills] window exists?', typeof window !== 'undefined');
  console.log('[Polyfills] global exists?', typeof global !== 'undefined');

  // Set up global.window if it doesn't exist
  // This is the standard pattern used by React Native polyfills
  if (typeof global !== 'undefined') {
    if (!global.window) {
      // Create window as an alias to global
      global.window = global;
      console.log('[Polyfills] Created global.window');
    }

    // Now work with the window object
    const win = global.window as any;

    // Event system implementation
    const eventListeners: { [key: string]: Array<EventListenerOrEventListenerObject> } = {};

    console.log('[Polyfills] win.addEventListener exists?', typeof win.addEventListener);
    
    if (!win.addEventListener) {
      console.log('[Polyfills] Adding addEventListener to window');
      win.addEventListener = function(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void {
        if (!eventListeners[type]) {
          eventListeners[type] = [];
        }
        eventListeners[type].push(listener);
      };
    }

    if (!win.removeEventListener) {
      win.removeEventListener = function(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
      ): void {
        if (eventListeners[type]) {
          const index = eventListeners[type].indexOf(listener);
          if (index > -1) {
            eventListeners[type].splice(index, 1);
          }
        }
      };
    }

    if (!win.dispatchEvent) {
      win.dispatchEvent = function(event: Event): boolean {
        const listeners = eventListeners[event.type];
        if (listeners) {
          listeners.forEach(listener => {
            if (typeof listener === 'function') {
              listener(event);
            } else if (listener && typeof listener.handleEvent === 'function') {
              listener.handleEvent(event);
            }
          });
        }
        return !event.defaultPrevented;
      };
    }

    // Location object
    if (!win.location) {
      win.location = {
        href: 'http://localhost/',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
        origin: 'http://localhost',
        reload: () => {},
        assign: (url: string) => {},
        replace: (url: string) => {},
        toString: () => 'http://localhost/'
      };
    }

    // Window dimensions (static values, can be updated with Dimensions API if needed)
    if (!win.innerWidth) {
      win.innerWidth = 375; // iPhone default
    }
    if (!win.innerHeight) {
      win.innerHeight = 667; // iPhone default
    }

    // Animation frames
    if (!win.requestAnimationFrame) {
      let lastTime = 0;
      win.requestAnimationFrame = function(callback: FrameRequestCallback): number {
        const currentTime = Date.now();
        const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
        const id = setTimeout(() => {
          callback(currentTime + timeToCall);
        }, timeToCall);
        lastTime = currentTime + timeToCall;
        return id;
      };
    }

    if (!win.cancelAnimationFrame) {
      win.cancelAnimationFrame = function(id: number): void {
        clearTimeout(id);
      };
    }

    // getComputedStyle
    if (!win.getComputedStyle) {
      win.getComputedStyle = function(element: Element, pseudoElt?: string | null): CSSStyleDeclaration {
        return (element as any).style || {} as CSSStyleDeclaration;
      };
    }

    // Document polyfill
    if (!win.document) {
      const documentPolyfill = {
        createElement: (tagName: string) => {
          return {
            tagName: tagName.toUpperCase(),
            style: {},
            attributes: {},
            childNodes: [],
            appendChild: (child: any) => child,
            removeChild: (child: any) => child,
            setAttribute: (name: string, value: string) => {},
            getAttribute: (name: string) => null,
            addEventListener: () => {},
            removeEventListener: () => {},
            classList: {
              add: () => {},
              remove: () => {},
              contains: () => false,
              toggle: () => {}
            }
          };
        },
        createTextNode: (text: string) => ({ nodeValue: text, nodeType: 3 }),
        createDocumentFragment: () => ({
          appendChild: () => {},
          querySelector: () => null,
          querySelectorAll: () => []
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
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {}
          }
        },
        head: {
          appendChild: () => {}
        },
        documentElement: {
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {}
          }
        },
        addEventListener: () => {},
        removeEventListener: () => {},
        createEvent: (type: string) => ({
          initEvent: () => {},
          type
        })
      };

      win.document = documentPolyfill;
      global.document = documentPolyfill;
    }

    // Navigator polyfill
    if (!win.navigator) {
      win.navigator = {
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
        vendorSub: ''
      };
    }

    // Storage polyfill
    const createStorage = (): Storage => {
      const storage: { [key: string]: string } = {};
      return {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
          storage[key] = String(value);
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
        clear: () => {
          Object.keys(storage).forEach(key => delete storage[key]);
        },
        key: (index: number) => Object.keys(storage)[index] || null,
        get length() {
          return Object.keys(storage).length;
        }
      } as Storage;
    };

    if (!win.localStorage) {
      win.localStorage = createStorage();
    }
    if (!win.sessionStorage) {
      win.sessionStorage = createStorage();
    }

    // Global constructors
    if (!global.HTMLElement) {
      global.HTMLElement = class HTMLElement {};
    }
    if (!global.Element) {
      global.Element = class Element {};
    }
    if (!global.Node) {
      global.Node = class Node {};
    }
    if (!global.Event) {
      global.Event = class Event {
        type: string;
        defaultPrevented = false;
        constructor(type: string, eventInit?: EventInit) {
          this.type = type;
        }
        preventDefault() {
          this.defaultPrevented = true;
        }
      };
    }
    if (!global.CustomEvent) {
      global.CustomEvent = class CustomEvent extends global.Event {
        detail: any;
        constructor(type: string, eventInit?: CustomEventInit) {
          super(type, eventInit);
          this.detail = eventInit?.detail;
        }
      };
    }
  }
}