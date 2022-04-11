import { patchSettings } from './settings';

export function applyPatches(): void {
  try {
    patchSettings();
  } catch (e) {
    console.log(e.message);
  }
}
