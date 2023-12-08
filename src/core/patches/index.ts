import settings from './settings';
import tracking from './no-track';
import inspect from './inspect';
import badges from './badges';
import theme from './theme';
import toasts from './toasts';

const handlePatch = (patchType: string, patch: () => any | void) => {
    try {
        patch();
    } catch (e) {
        console.warn(`Failed to patch ${patchType}: ${e.message ?? e}`)
    }
}

export function initialize(): void {
    const patches = {
        inspect,
        settings,
        tracking,
        badges,
        theme,
        toasts
    }

    Object.entries(patches).forEach(entry => handlePatch(...entry));
}

export default { initialize };
