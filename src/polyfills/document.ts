/**
 * Document object polyfill for React Native
 */

class ElementPolyfill {
  tagName: string;
  id: string = '';
  className: string = '';
  classList: {
    add: (className: string) => void;
    remove: (className: string) => void;
    contains: (className: string) => boolean;
    toggle: (className: string) => boolean;
  };
  style: any = {};
  children: ElementPolyfill[] = [];
  parentElement: ElementPolyfill | null = null;
  innerHTML: string = '';
  textContent: string = '';
  attributes: { [key: string]: string } = {};

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
    
    const classes = new Set<string>();
    this.classList = {
      add: (className: string) => {
        classes.add(className);
        this.className = Array.from(classes).join(' ');
      },
      remove: (className: string) => {
        classes.delete(className);
        this.className = Array.from(classes).join(' ');
      },
      contains: (className: string) => classes.has(className),
      toggle: (className: string) => {
        if (classes.has(className)) {
          classes.delete(className);
          return false;
        } else {
          classes.add(className);
          return true;
        }
      }
    };
  }

  appendChild(child: ElementPolyfill): ElementPolyfill {
    this.children.push(child);
    child.parentElement = this;
    return child;
  }

  removeChild(child: ElementPolyfill): ElementPolyfill {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parentElement = null;
    }
    return child;
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] || null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
    if (name === 'class') {
      this.className = value;
    } else if (name === 'id') {
      this.id = value;
    }
  }

  removeAttribute(name: string): void {
    delete this.attributes[name];
    if (name === 'class') {
      this.className = '';
    } else if (name === 'id') {
      this.id = '';
    }
  }

  addEventListener(): void {
    // No-op for React Native
  }

  removeEventListener(): void {
    // No-op for React Native
  }

  getBoundingClientRect() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0
    };
  }
}

class DocumentPolyfill {
  body: ElementPolyfill;
  documentElement: ElementPolyfill;
  head: ElementPolyfill;

  constructor() {
    this.documentElement = new ElementPolyfill('html');
    this.body = new ElementPolyfill('body');
    this.head = new ElementPolyfill('head');
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }

  createElement(tagName: string): ElementPolyfill {
    return new ElementPolyfill(tagName);
  }

  createTextNode(text: string): any {
    return {
      nodeValue: text,
      textContent: text,
      nodeType: 3 // TEXT_NODE
    };
  }

  getElementById(id: string): ElementPolyfill | null {
    // Simple implementation - in real app would search DOM tree
    return null;
  }

  getElementsByClassName(className: string): ElementPolyfill[] {
    // Simple implementation - in real app would search DOM tree
    return [];
  }

  getElementsByTagName(tagName: string): ElementPolyfill[] {
    // Simple implementation - in real app would search DOM tree
    return [];
  }

  querySelector(selector: string): ElementPolyfill | null {
    // Simple implementation - in real app would parse selector
    return null;
  }

  querySelectorAll(selector: string): ElementPolyfill[] {
    // Simple implementation - in real app would parse selector
    return [];
  }

  addEventListener(): void {
    // No-op for React Native
  }

  removeEventListener(): void {
    // No-op for React Native
  }

  createEvent(type: string): any {
    return {
      type,
      preventDefault: () => {},
      stopPropagation: () => {},
      initEvent: () => {}
    };
  }
}

export function setupDocumentPolyfill(): void {
  if (typeof document === 'undefined') {
    // @ts-ignore - Creating global document object
    global.document = new DocumentPolyfill();
    
    // Also set on window if it exists
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.document = global.document;
    }
  }

  // Add HTMLElement if not present
  if (typeof HTMLElement === 'undefined') {
    // @ts-ignore
    global.HTMLElement = ElementPolyfill;
  }

  // Add Element if not present
  if (typeof Element === 'undefined') {
    // @ts-ignore
    global.Element = ElementPolyfill;
  }

  // Add Node if not present
  if (typeof Node === 'undefined') {
    // @ts-ignore
    global.Node = ElementPolyfill;
  }
}