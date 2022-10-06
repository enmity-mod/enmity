import patchSettings from './settings';
import patchTracking from './no-track';
import patchConsole from './console';
import patchBadges from './badges';

export function initialize(): void {
  try {
    patchConsole();
    console.log('Patched console.');
  } catch (e) {
    console.log('Failed to patch console: ', e.message);
  }

  try {
    patchSettings();
    console.log('Patched settings.');
  } catch (e) {
    console.log('Failed to patch settings: ', e.message);
  }

  try {
    patchTracking();
    console.log('Patched tracking.');
  } catch (e) {
    console.log('Failed to patch trackers: ', e.message);
  }

  try {
    patchBadges();
    console.log('Patched badges.');
  } catch (e) {
    console.log('Failed to patch badges: ', e.message);
  }

  // try {
  //   patchDownloader();
  // } catch (e) {
  //   console.log('Failed to patch addon downloader: ', e.message);
  // }
}

export default { initialize };
