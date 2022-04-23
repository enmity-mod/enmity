import patchSettings from './settings';
import patchTracking from './no-track';

export function applyPatches(): void {
  try {
    patchSettings();
  } catch (e) {
    console.log('Failed to patch settings: ', e.message);
  }

  try {
    patchTracking();
  } catch (e) {
    console.log('Failed to patch trackers: ', e.message);
  }
}
