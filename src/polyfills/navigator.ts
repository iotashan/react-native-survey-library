/**
 * Navigator object polyfill for React Native
 */

import { Platform } from 'react-native';

class NavigatorPolyfill implements Partial<Navigator> {
  userAgent: string;
  platform: string;
  language: string;
  languages: readonly string[];
  onLine: boolean = true;
  cookieEnabled: boolean = false;
  maxTouchPoints: number;

  constructor() {
    // Create a user agent string that identifies React Native
    const osName = Platform.OS;
    const osVersion = Platform.Version;
    const rnVersion = Platform.constants?.reactNativeVersion;
    
    this.userAgent = `ReactNative/${rnVersion?.major || '0'}.${rnVersion?.minor || '0'}.${rnVersion?.patch || '0'} (${osName}; ${osVersion})`;
    this.platform = osName === 'ios' ? 'iPhone' : 'Android';
    this.language = 'en-US'; // Default, could be made dynamic
    this.languages = ['en-US'];
    this.maxTouchPoints = 10; // Most mobile devices support multi-touch
  }

  // Clipboard API stub
  clipboard = {
    writeText: async (text: string): Promise<void> => {
      // Could integrate with @react-native-clipboard/clipboard
      console.warn('Clipboard.writeText not implemented in React Native polyfill');
    },
    readText: async (): Promise<string> => {
      console.warn('Clipboard.readText not implemented in React Native polyfill');
      return '';
    }
  };

  // Geolocation API stub
  geolocation = {
    getCurrentPosition: (
      successCallback: PositionCallback,
      errorCallback?: PositionErrorCallback,
      options?: PositionOptions
    ): void => {
      // Could integrate with react-native-geolocation-service
      console.warn('Geolocation not implemented in React Native polyfill');
      if (errorCallback) {
        errorCallback({
          code: 2,
          message: 'Geolocation not available',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        } as GeolocationPositionError);
      }
    },
    watchPosition: (): number => {
      console.warn('Geolocation.watchPosition not implemented in React Native polyfill');
      return 0;
    },
    clearWatch: (): void => {
      console.warn('Geolocation.clearWatch not implemented in React Native polyfill');
    }
  };

  // Vibration API
  vibrate(pattern?: number | number[]): boolean {
    // Could integrate with React Native's Vibration API
    console.warn('Navigator.vibrate not implemented in React Native polyfill');
    return false;
  }

  // Share API stub
  share = async (data: ShareData): Promise<void> => {
    // Could integrate with React Native's Share API
    console.warn('Navigator.share not implemented in React Native polyfill');
  };

  // Permissions API stub
  permissions = {
    query: async (permissionDesc: any): Promise<any> => {
      console.warn('Navigator.permissions not implemented in React Native polyfill');
      return { state: 'denied' };
    }
  };
}

export function setupNavigatorPolyfill(): void {
  if (typeof navigator === 'undefined') {
    // @ts-ignore - Creating global navigator object
    global.navigator = new NavigatorPolyfill();
    
    // Also set on window if it exists
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.navigator = global.navigator;
    }
  } else {
    // Extend existing navigator with missing properties
    const navPoly = new NavigatorPolyfill();
    
    if (!navigator.userAgent) {
      // @ts-ignore
      navigator.userAgent = navPoly.userAgent;
    }
    
    if (!navigator.platform) {
      // @ts-ignore
      navigator.platform = navPoly.platform;
    }
    
    if (!navigator.language) {
      // @ts-ignore
      navigator.language = navPoly.language;
    }
  }
}