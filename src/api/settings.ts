import * as Modules from '../utils/modules';

const Settings = Modules.common.settings;

export function getSetting(key: string): string {
  return Settings.get(key);
}

export function setSetting(setting: Record<string, string>): void {
  Settings.set(setting);
}
