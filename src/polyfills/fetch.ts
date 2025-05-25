/**
 * Fetch API polyfill for React Native
 * React Native already has fetch, but we ensure it's available globally
 */

export function setupFetchPolyfill(): void {
  // React Native already provides fetch, but ensure it's on window
  if (typeof window !== 'undefined' && typeof window.fetch === 'undefined') {
    // @ts-ignore
    window.fetch = global.fetch;
  }

  // Ensure Headers, Request, Response are available
  if (typeof Headers === 'undefined') {
    // @ts-ignore
    global.Headers = global.Headers || class Headers {
      private headers: { [key: string]: string } = {};

      constructor(init?: HeadersInit) {
        if (init) {
          if (init instanceof Headers) {
            init.forEach((value, key) => {
              this.headers[key.toLowerCase()] = value;
            });
          } else if (Array.isArray(init)) {
            init.forEach(([key, value]) => {
              this.headers[key.toLowerCase()] = value;
            });
          } else {
            Object.entries(init).forEach(([key, value]) => {
              this.headers[key.toLowerCase()] = value;
            });
          }
        }
      }

      append(key: string, value: string): void {
        this.headers[key.toLowerCase()] = value;
      }

      delete(key: string): void {
        delete this.headers[key.toLowerCase()];
      }

      get(key: string): string | null {
        return this.headers[key.toLowerCase()] || null;
      }

      has(key: string): boolean {
        return key.toLowerCase() in this.headers;
      }

      set(key: string, value: string): void {
        this.headers[key.toLowerCase()] = value;
      }

      forEach(callback: (value: string, key: string, parent: Headers) => void): void {
        Object.entries(this.headers).forEach(([key, value]) => {
          callback(value, key, this);
        });
      }

      entries(): IterableIterator<[string, string]> {
        return Object.entries(this.headers)[Symbol.iterator]();
      }

      keys(): IterableIterator<string> {
        return Object.keys(this.headers)[Symbol.iterator]();
      }

      values(): IterableIterator<string> {
        return Object.values(this.headers)[Symbol.iterator]();
      }

      [Symbol.iterator](): IterableIterator<[string, string]> {
        return this.entries();
      }
    };
  }

  // URL and URLSearchParams polyfills
  if (typeof URL === 'undefined') {
    try {
      // Try to use react-native-url-polyfill if available
      require('react-native-url-polyfill/auto');
    } catch (e) {
      // Basic URL polyfill
      // @ts-ignore
      global.URL = class URL {
        href: string;
        protocol: string = '';
        host: string = '';
        hostname: string = '';
        port: string = '';
        pathname: string = '';
        search: string = '';
        hash: string = '';
        username: string = '';
        password: string = '';
        origin: string = '';

        constructor(url: string, base?: string) {
          this.href = url;
          // Very basic URL parsing
          try {
            const match = url.match(/^(https?:)\/\/([^\/]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/);
            if (match) {
              this.protocol = match[1] || '';
              this.host = match[2] || '';
              this.pathname = match[3] || '/';
              this.search = match[4] || '';
              this.hash = match[5] || '';
              
              const hostMatch = this.host.match(/^([^:]+)(:(\d+))?$/);
              if (hostMatch) {
                this.hostname = hostMatch[1];
                this.port = hostMatch[3] || '';
              }
              
              this.origin = `${this.protocol}//${this.host}`;
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }

        toString(): string {
          return this.href;
        }
      };
    }
  }

  if (typeof URLSearchParams === 'undefined') {
    // @ts-ignore
    global.URLSearchParams = class URLSearchParams {
      private params: { [key: string]: string[] } = {};

      constructor(init?: string | Record<string, string> | URLSearchParams) {
        if (typeof init === 'string') {
          init.replace(/^\?/, '').split('&').forEach(pair => {
            const [key, value] = pair.split('=').map(decodeURIComponent);
            this.append(key, value || '');
          });
        } else if (init) {
          Object.entries(init).forEach(([key, value]) => {
            this.append(key, String(value));
          });
        }
      }

      append(key: string, value: string): void {
        if (!this.params[key]) {
          this.params[key] = [];
        }
        this.params[key].push(value);
      }

      delete(key: string): void {
        delete this.params[key];
      }

      get(key: string): string | null {
        return this.params[key]?.[0] || null;
      }

      getAll(key: string): string[] {
        return this.params[key] || [];
      }

      has(key: string): boolean {
        return key in this.params;
      }

      set(key: string, value: string): void {
        this.params[key] = [value];
      }

      toString(): string {
        return Object.entries(this.params)
          .flatMap(([key, values]) => 
            values.map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          )
          .join('&');
      }
    };
  }
}