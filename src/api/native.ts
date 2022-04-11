import * as Modules from '../utils/modules';

const Native = Modules.common.native;

export function reloadDiscord(): void {
  Native.BundleUpdaterManager.reload();
}

export function getVersion(): string {
  return Native.InfoDictionaryManager.Version;
}

export function getBuild(): string {
  return Native.InfoDictionaryManager.Build;
}

export function getDevice(): string {
  return Native.DCDDeviceManager.device;
}

export function getSystemVersion(): string {
  return Native.DCDDeviceManager.systemVersion;
}
