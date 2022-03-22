import { getModuleByProps } from '../utils/modules';

const SettingsModule = getModuleByProps('watchKeys');

export function getSetting(key: string): string {
  return SettingsModule.get(key);
}

export function setSetting(setting: Record<string, string>): void {
  SettingsModule.set(setting);
}
