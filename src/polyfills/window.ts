/**
 * Window object polyfill for React Native
 */

interface EventListenerMap {
  [key: string]: Array<EventListener | EventListenerObject>;
}

class WindowPolyfill {
  private eventListeners: EventListenerMap = {};

  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(listener);
  }

  removeEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    if (!this.eventListeners[type]) {
      return;
    }
    const index = this.eventListeners[type].indexOf(listener);
    if (index > -1) {
      this.eventListeners[type].splice(index, 1);
    }
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.eventListeners[event.type];
    if (!listeners) {
      return true;
    }

    listeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(event);
      } else if (listener && typeof listener.handleEvent === 'function') {
        listener.handleEvent(event);
      }
    });

    return !event.defaultPrevented;
  }
}

export function setupWindowPolyfill(): void {
  if (typeof window === 'undefined') {
    // @ts-ignore - Creating global window object
    global.window = global;
  }

  const windowPoly = new WindowPolyfill();

  // Add event handling methods
  if (!window.addEventListener) {
    window.addEventListener = windowPoly.addEventListener.bind(windowPoly);
  }

  if (!window.removeEventListener) {
    window.removeEventListener = windowPoly.removeEventListener.bind(windowPoly);
  }

  if (!window.dispatchEvent) {
    window.dispatchEvent = windowPoly.dispatchEvent.bind(windowPoly);
  }

  // Add location object
  if (!window.location) {
    window.location = {
      href: 'http://localhost/',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      pathname: '/',
      search: '',
      hash: ''
    };
  }

  // Add other common window properties
  if (!window.innerWidth) {
    // @ts-ignore
    window.innerWidth = 375; // Default iPhone width
  }

  if (!window.innerHeight) {
    // @ts-ignore
    window.innerHeight = 667; // Default iPhone height
  }

  // Add requestAnimationFrame if not present
  if (!window.requestAnimationFrame) {
    // @ts-ignore
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return setTimeout(callback, 16); // ~60fps
    };
  }

  if (!window.cancelAnimationFrame) {
    // @ts-ignore
    window.cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };
  }
}