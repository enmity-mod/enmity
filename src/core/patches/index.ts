// import patchDownloader from './downloader';
import patchSettings from './settings';
import patchTracking from './no-track';
import patchConsole from './console';
import patchBadges from './badges';

export function initialize(): void {
  try {
    patchConsole();
  } catch (e) {
    console.log('Failed to patch console: ', e.message);
  }

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

  // try {
  //   patchBadges();
  // } catch (e) {
  //   console.log('Failed to patch badges: ', e.message);
  // }

  // try {
  //   patchDownloader();
  // } catch (e) {
  //   console.log('Failed to patch addon downloader: ', e.message);
  // }
}

export default { initialize };
