import patchDownloader from './downloader';
import patchSettings from './settings';
import patchTracking from './no-track';

export function initialize(): void {
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

  try {
    patchDownloader();
  } catch (e) {
    console.log('Failed to patch addon downloader: ', e.message);
  }
}

export default { initialize };
