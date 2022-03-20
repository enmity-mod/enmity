import { getModule } from '../utils/modules';

const nativeModules = getModule(m => m.NativeModules).NativeModules;

export function reloadDiscord(): void {
  nativeModules.BundleUpdaterManager.reload();
}

export function getVersion(): string {
  return nativeModules.InfoDictionaryManager.Version;
}

export function getBuild(): string {
  return nativeModules.InfoDictionaryManager.Build;
}

export function getDevice(): string {
  return nativeModules.DCDDeviceManager.device;
}

export function getSystemVersion(): string {
  return nativeModules.DCDDeviceManager.systemVersion;
}
