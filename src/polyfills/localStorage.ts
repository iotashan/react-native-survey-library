/**
 * LocalStorage polyfill for React Native using AsyncStorage
 */

import { Platform } from 'react-native';

class LocalStoragePolyfill implements Storage {
  private data: { [key: string]: string } = {};
  private asyncStorageAvailable = false;

  constructor() {
    // Check if AsyncStorage is available
    try {
      // AsyncStorage might be available via @react-native-async-storage/async-storage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage) {
        this.asyncStorageAvailable = true;
        this.initializeFromAsyncStorage(AsyncStorage);
      }
    } catch (e) {
      console.warn('AsyncStorage not available, using in-memory storage');
    }
  }

  private async initializeFromAsyncStorage(AsyncStorage: any): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      items.forEach(([key, value]: [string, string | null]) => {
        if (value !== null) {
          this.data[key] = value;
        }
      });
    } catch (e) {
      console.warn('Failed to initialize from AsyncStorage:', e);
    }
  }

  get length(): number {
    return Object.keys(this.data).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.data);
    return keys[index] || null;
  }

  getItem(key: string): string | null {
    return this.data[key] || null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = String(value);
    
    // Try to persist to AsyncStorage if available
    if (this.asyncStorageAvailable) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.setItem(key, value).catch((e: any) => {
          console.warn('Failed to persist to AsyncStorage:', e);
        });
      } catch (e) {
        // Ignore errors
      }
    }
  }

  removeItem(key: string): void {
    delete this.data[key];
    
    // Try to remove from AsyncStorage if available
    if (this.asyncStorageAvailable) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.removeItem(key).catch((e: any) => {
          console.warn('Failed to remove from AsyncStorage:', e);
        });
      } catch (e) {
        // Ignore errors
      }
    }
  }

  clear(): void {
    this.data = {};
    
    // Try to clear AsyncStorage if available
    if (this.asyncStorageAvailable) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.clear().catch((e: any) => {
          console.warn('Failed to clear AsyncStorage:', e);
        });
      } catch (e) {
        // Ignore errors
      }
    }
  }
}

// SessionStorage can use the same implementation
class SessionStoragePolyfill extends LocalStoragePolyfill {
  // Session storage doesn't persist between app launches
  constructor() {
    super();
    // Don't use AsyncStorage for session storage
    this.asyncStorageAvailable = false;
  }
}

export function setupLocalStoragePolyfill(): void {
  if (typeof localStorage === 'undefined') {
    // @ts-ignore - Creating global localStorage object
    global.localStorage = new LocalStoragePolyfill();
    
    // Also set on window if it exists
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.localStorage = global.localStorage;
    }
  }

  if (typeof sessionStorage === 'undefined') {
    // @ts-ignore - Creating global sessionStorage object
    global.sessionStorage = new SessionStoragePolyfill();
    
    // Also set on window if it exists
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.sessionStorage = global.sessionStorage;
    }
  }
}