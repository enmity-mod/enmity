async function init() {
  // Setup asset handler early to capture most assets then initialize enmity
  await import('@api/assets');

  const Enmity = await import('@core');
  Enmity.initialize();
}

try {
  init();
} catch (e) {
  alert(`Enmity failed to initialize: ${e.message}`);
  console.error('Enmity failed to initialize:', e.message);
}