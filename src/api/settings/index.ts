import { SettingsStore } from 'enmity/api/settings';
import { Dispatcher, Flux, React } from '@metro/common';
import Manager from './store';

interface FluxDispatch {
  file: string;
  type: string;
  [key: string]: any;
}

interface Listeners {
  [key: string]: Set<Function>;
}

export const listeners: Listeners = {};

export { settings, store } from './store';

Dispatcher.subscribe('ENMITY_SET_SETTING', ENMITY_SET_SETTING);
Dispatcher.subscribe('ENMITY_TOGGLE_SETTING', ENMITY_TOGGLE_SETTING);

function ENMITY_SET_SETTING(args: FluxDispatch): void {
  return handleSettingsUpdate({ ...args, type: 'set' });
}

function ENMITY_TOGGLE_SETTING(args: FluxDispatch): void {
  return handleSettingsUpdate({ ...args, type: 'toggle' });
}

function handleSettingsUpdate({ file, type, ...args }: FluxDispatch): void {
  const callbacks = listeners[file];
  if (!callbacks) return;

  for (const callback of callbacks.values()) {
    callback({ ...args });
  }
}

export function set(file: string, setting: string, value: any): void {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  }

  return Dispatcher.wait(() => Dispatcher.dispatch({
    type: 'ENMITY_SET_SETTING',
    file,
    setting,
    value
  }));
}

export function get(file: string, setting: string, defaults?: any): any {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  }

  return Manager.getSetting(file, setting, defaults);
}

export function getBoolean(file: string, setting: string, defaults?: boolean): boolean {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  } else if (defaults === void 0 || typeof defaults !== 'boolean') {
    throw new TypeError('the third argument defaults must be of type boolean');
  }

  return Boolean(Manager.getSetting(file, setting, defaults));
}

export function toggle(file: string, setting: string, defaults: boolean): void {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  } else if (defaults === void 0 || typeof defaults !== 'boolean') {
    throw new TypeError('the third argument defaults must be of type boolean');
  }

  return Dispatcher.wait(() => Dispatcher.dispatch({
    type: 'ENMITY_TOGGLE_SETTING',
    file,
    setting,
    defaults
  }));
}

export function connectComponent(component: React.ComponentType, file: string): React.ComponentType {
  if (!component || !['function', 'object'].includes(typeof component)) {
    throw new TypeError('the first argument component must be of type function or object');
  } else if (!file || typeof file !== 'string') {
    throw new TypeError('the second argument file must be of type string');
  }

  const res = (props: any) => {
    const forceUpdate = React.useState({})[1];

    React.useEffect(() => {
      function onSettingsChange() {
        forceUpdate({});
      }

      subscribe(file, onSettingsChange);
      return () => unsubscribe(file, onSettingsChange);
    }, []);

    return React.createElement(component, {
      ...props,
      settings: makeStore(file)
    });
  };

  if (component.displayName) {
    res.displayName = component.displayName;
  }

  if (component.name) {
    res.name = `Connected${component.name}`;
  }

  return res;
};

export function makeStore(file: string): SettingsStore {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  }

  return {
    settings: Manager.get(file),
    set: (key, value) => set(file, key, value),
    get: (key, defaults) => get(file, key, defaults),
    toggle: (key, defaults) => toggle(file, key, defaults),
    getBoolean: (key, defaults) => getBoolean(file, key, defaults)
  };
}

export function subscribe(file: string, callback: (...args) => any): void {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!callback || typeof callback !== 'function') {
    throw new TypeError('the second argument callback must be of type function');
  }

  listeners[file] ??= new Set();
  listeners[file].add(callback);
}

export function unsubscribe(file: string, callback: (...args) => any): void {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!callback || typeof callback !== 'function') {
    throw new TypeError('the second argument callback must be of type function');
  }

  listeners[file]?.delete(callback);
  if (listeners[file]?.size === 0) {
    delete listeners[file];
  }
}

export function connectStores(component: React.ComponentType, file: string): React.ComponentType {
  if (!component || !['function', 'object'].includes(typeof component)) {
    throw new TypeError('the first argument component must be of type function or object');
  } else if (!file || typeof file !== 'string') {
    throw new TypeError('the second argument file must be of type string');
  }

  return Flux.connectStores([Manager.store], () => ({ settings: makeStore(file) }))(component);
}

export default {
  connectComponent,
  connectStores,
  unsubscribe,
  subscribe,
  makeStore,
  listeners,
  toggle,
  get,
  set
};