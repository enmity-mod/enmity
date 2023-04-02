import { Native } from '@metro/common';

export const infoDictionary: any = Native.InfoDictionaryManager ?? Native.RTNClientInfoManager

export const bundle: string = infoDictionary.Identifier;
export const reload: () => void = Native.BundleUpdaterManager.reload;
export const version: string = Native.InfoDictionaryManager.Version;
export const os: string = Native.DCDDeviceManager.systemVersion;
export const build: string = infoDictionary.Build;
export const device: string = Native.DCDDeviceManager.device;