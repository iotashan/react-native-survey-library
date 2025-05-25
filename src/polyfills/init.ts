/**
 * Initialize polyfills immediately when this module is imported
 */
import { ensurePolyfills } from './browser-polyfills';

// Run polyfills immediately
ensurePolyfills();