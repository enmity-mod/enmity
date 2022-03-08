import { getModule } from "../utils/modules";

const nativeModules = getModule(m => m.NativeModules).NativeModules;

function reloadDiscord() {
  nativeModules.BundleUpdaterManager.reload();
}

function getVersion() {
  return nativeModules.InfoDictionaryManager.Version;
}

function getBuild() {
  return nativeModules.InfoDictionaryManager.Build;
}

function getDevice() {
  return nativeModules.DCDDeviceManager.device;
}

function getSystemVersion() {
  return nativeModules.DCDDeviceManager.systemVersion;
}

export {
  reloadDiscord,

  getVersion,
  getBuild,
  getDevice,
  getSystemVersion
}