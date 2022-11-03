import { Native } from '@metro/common';

export const bundle: string = Native.InfoDictionaryManager.Identifier;
export const reload: () => void = Native.BundleUpdaterManager.reload;
export const version: string = Native.InfoDictionaryManager.Version;
export const os: string = Native.DCDDeviceManager.systemVersion;
export const build: string = Native.InfoDictionaryManager.Build;
export const device: string = Native.DCDDeviceManager.device;