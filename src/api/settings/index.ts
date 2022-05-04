import { Dispatcher, Flux } from '@metro/common';
import Manager from './store';
import React from 'react';


export const listeners = {};

export { settings, store } from './store';

Dispatcher.subscribe('ENMITY_SET_SETTING', ENMITY_SET_SETTING);
Dispatcher.subscribe('ENMITY_TOGGLE_SETTING', ENMITY_TOGGLE_SETTING);

function ENMITY_SET_SETTING(args) {
  return handleSettingsUpdate({ ...args, type: 'set' });
}

function ENMITY_TOGGLE_SETTING(args) {
  return handleSettingsUpdate({ ...args, type: 'toggle' });
}

function handleSettingsUpdate({ file, type, ...args }) {
  const callbacks = listeners[file];
  if (!callbacks) return;

  for (const callback of callbacks.values()) {
    callback({ ...args });
  }
}

export function set(file, setting, value) {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  }

  return Dispatcher.dirtyDispatch({
    type: 'ENMITY_SET_SETTING',
    file,
    setting,
    value
  });
}

export function get(file, setting, defaults?) {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  }

  return Manager.getSetting(file, setting, defaults);
}

export function getBoolean(file, setting, defaults) {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  }

  return Boolean(Manager.getSetting(file, setting, defaults));
}

export function toggle(file, setting, defaults) {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!setting || typeof setting !== 'string') {
    throw new TypeError('the second argument setting must be of type string');
  } else if (defaults === void 0 || typeof defaults !== 'boolean') {
    throw new TypeError('the third argument defaults must be of type boolean');
  }

  return Dispatcher.dirtyDispatch({
    type: 'ENMITY_TOGGLE_SETTING',
    file,
    setting,
    defaults
  });
}

export function connectComponent(component, file) {
  if (!component || !['function', 'object'].includes(typeof component)) {
    throw new TypeError('the first argument component must be of type function or object');
  } else if (!file || typeof file !== 'string') {
    throw new TypeError('the second argument file must be of type string');
  }

  const res = (props) => {
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

  if (component.displayName) res.displayName = component.displayName;
  if (component.name) res.name = `Connected${component.name}`;

  return res;
};

export function makeStore(file) {
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

export function subscribe(file, callback) {
  if (!file || typeof file !== 'string') {
    throw new TypeError('the first argument file must be of type string');
  } else if (!callback || typeof callback !== 'function') {
    throw new TypeError('the second argument callback must be of type function');
  }

  listeners[file] ??= new Set();
  listeners[file].add(callback);
}

export function unsubscribe(file, callback) {
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

export function connectStores(file) {
  return Flux.connectStores([Manager.store], () => ({ settings: makeStore(file) }));
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