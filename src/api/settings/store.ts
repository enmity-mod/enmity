import { Lodash, Settings, Dispatcher, Flux } from '@metro/common';

interface SettingsInstance {
  [file: string]: {
    [key: string]: any;
  };
}

export const settings = Settings.get('enmity') ?? {};

export function getSetting(file: string, setting: string, defaults: any): any {
  return settings[file]?.[setting] ?? defaults;
}

export function get(file: string): any {
  return settings[file] ?? {};
}

export function getAll(): SettingsInstance {
  return settings;
}

const Events: Record<string, (...args) => any> = {
  'ENMITY_GET_SETTING': ({ file, setting, defaults }) => {
    return settings[file][setting] ?? defaults;
  },

  'ENMITY_SET_SETTING': ({ file, setting, value }) => {
    if (!settings[file]) settings[file] = {};

    if (value == void 0) {
      delete settings[file][setting];
    } else {
      settings[file][setting] = value;
    }
  },

  'ENMITY_TOGGLE_SETTING': ({ file, setting, defaults }) => {
    if (!settings[file]) settings[file] = {};

    if (settings[file][setting] === void 0) {
      settings[file][setting] = !Boolean(defaults);
    } else {
      settings[file][setting] = !Boolean(settings[file][setting]);
    }
  }
};

export const store = new Flux.Store(Dispatcher, Events);

store.addChangeListener(Lodash.debounce(() => Settings.set({ enmity: settings }), 200));

export default { store, getAll, getSetting, get };