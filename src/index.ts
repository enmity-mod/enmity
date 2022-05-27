declare global {
  interface Window {
    [key: PropertyKey]: any;
    enmity: typeof import('@api').API;
  }
}

try {
  // Setup asset handler early to capture most assets then initialize enmity
  import('@api/assets').then(() => {
    import('@core').then(Enmity => {
      Enmity.initialize();
    });
  });
} catch (error) {
  alert(`Enmity failed to initialize: ${error.message}`);
  console.error(error);
}

export { };