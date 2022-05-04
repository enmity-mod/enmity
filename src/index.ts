declare global {
  interface Window {
    [key: PropertyKey]: any;
  }
}

// Setup asset handler early to capture most assets
import '@api/assets';
// Initialize Enmity
import Enmity from '@core';

try {
  Enmity.initialize();
} catch (error) {
  alert(`Enmity failed to initialize: ${error.message}`);
  console.error(error);
}
