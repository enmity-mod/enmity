// Setup asset handler early to capture most assets then initialize enmity

async function init() {
	await import('@api/assets');

	const Core = await import('@core');
	Core.initialize();
}

try {
	init();
} catch (error) {
	alert(`Failed to initialize Enmity: ${error.message}`);
}