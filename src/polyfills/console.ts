/**
 * Console polyfill to ensure all console methods are available
 * React Native's console might be missing some methods
 */

export function setupConsolePolyfill(): void {
  // Ensure all standard console methods exist
  const methods = [
    'log', 'info', 'warn', 'error', 'debug', 'trace',
    'assert', 'clear', 'count', 'countReset', 'group',
    'groupCollapsed', 'groupEnd', 'table', 'time', 'timeEnd',
    'timeLog', 'dir', 'dirxml', 'profile', 'profileEnd'
  ];

  methods.forEach(method => {
    if (typeof console[method as keyof Console] !== 'function') {
      // @ts-ignore
      console[method] = (...args: any[]) => {
        // Default to console.log if method doesn't exist
        if (console.log) {
          console.log(`[${method}]`, ...args);
        }
      };
    }
  });

  // Ensure console.table exists with basic implementation
  if (!console.table || typeof console.table !== 'function') {
    console.table = (data: any) => {
      console.log('Table:', data);
    };
  }

  // Ensure timing functions work
  const timers: { [key: string]: number } = {};

  if (!console.time || typeof console.time !== 'function') {
    console.time = (label: string = 'default') => {
      timers[label] = Date.now();
    };
  }

  if (!console.timeEnd || typeof console.timeEnd !== 'function') {
    console.timeEnd = (label: string = 'default') => {
      const start = timers[label];
      if (start) {
        console.log(`${label}: ${Date.now() - start}ms`);
        delete timers[label];
      }
    };
  }

  if (!console.timeLog || typeof console.timeLog !== 'function') {
    console.timeLog = (label: string = 'default', ...args: any[]) => {
      const start = timers[label];
      if (start) {
        console.log(`${label}: ${Date.now() - start}ms`, ...args);
      }
    };
  }

  // Counter implementation
  const counters: { [key: string]: number } = {};

  if (!console.count || typeof console.count !== 'function') {
    console.count = (label: string = 'default') => {
      counters[label] = (counters[label] || 0) + 1;
      console.log(`${label}: ${counters[label]}`);
    };
  }

  if (!console.countReset || typeof console.countReset !== 'function') {
    console.countReset = (label: string = 'default') => {
      delete counters[label];
    };
  }

  // Group implementation
  let groupIndent = 0;
  const originalLog = console.log;

  const indentedLog = (method: string) => (...args: any[]) => {
    const indent = '  '.repeat(groupIndent);
    originalLog.call(console, indent + (method !== 'log' ? `[${method}]` : ''), ...args);
  };

  if (!console.group || typeof console.group !== 'function') {
    console.group = (...label: any[]) => {
      if (label.length > 0) {
        console.log(...label);
      }
      groupIndent++;
    };
  }

  if (!console.groupCollapsed || typeof console.groupCollapsed !== 'function') {
    console.groupCollapsed = console.group;
  }

  if (!console.groupEnd || typeof console.groupEnd !== 'function') {
    console.groupEnd = () => {
      if (groupIndent > 0) {
        groupIndent--;
      }
    };
  }

  // Ensure assert exists
  if (!console.assert || typeof console.assert !== 'function') {
    console.assert = (condition: boolean, ...args: any[]) => {
      if (!condition) {
        console.error('Assertion failed:', ...args);
      }
    };
  }
}