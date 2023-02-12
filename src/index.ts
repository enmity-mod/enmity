import '@api/assets';
import Core from '@core';

try {
  // Setup asset handler early to capture most assets then initialize enmity
  Core.initialize();
} catch (error) {
  alert(`Enmity failed to initialize: ${error.message}`);
  console.error(error);
}

export { };