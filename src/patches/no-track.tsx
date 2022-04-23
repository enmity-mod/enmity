import { getModules } from '../utils/modules';
import { create } from '../utils/patcher';

const Patcher = create('no-track');

const blacklist = [
  'useAndTrack',
  'TextTrack',
  'useAnalyticsContext'
];

const Trackers = getModules(m => typeof m === 'object' && Object.keys(m)?.some(e => (~e.toLowerCase().indexOf('track') || ~e.toLowerCase().indexOf('analytics')) && !blacklist.some(b => ~e.indexOf(b))));
const Reporters = getModules(m => typeof m === 'object' && Object.keys(m)?.some(e => ~e.toLowerCase().indexOf('crashreport') && !blacklist.some(b => ~e.indexOf(b))));

export default function () {
  for (let i = 0; i < Trackers.length; i++) {
    traverse(Trackers[i], key => (~e.toLowerCase().indexOf('track') || ~e.toLowerCase().indexOf('analytics')) && !blacklist.some(b => ~key.indexOf(b)));
  }

  for (let i = 0; i < Reporters.length; i++) {
    traverse(Reporters[i], key => ~key.toLowerCase().indexOf('crashreport') && !blacklist.some(b => ~key.indexOf(b)));
  }

  const Sentry = {
    main: (window as any).__SENTRY__?.hub,
    client: (window as any).__SENTRY__?.hub?.getClient()
  };

  if (Sentry.main && Sentry.client) {
    Sentry.client.close(0);
    Sentry.main.getStackTop().scope.clear();
    Sentry.main.getScope().clear();
    Patcher.instead(Sentry.main, 'addBreadcrumb', () => { });

    (window as any).__oldConsole = window.console;

    for (const method of ['debug', 'info', 'warn', 'error', 'log', 'assert']) {
      const instance = console[method];
      if (!instance) continue;

      if (instance.__sentry_original__) {
        console[method] = instance.__sentry_original__;
      } else if (instance.__REACT_DEVTOOLS_ORIGINAL_METHOD__) {
        const original = instance.__REACT_DEVTOOLS_ORIGINAL_METHOD__.__sentry_original__;
        console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__ = original;
      }
    }
  }
}

function traverse(object, filter) {
  const keys = [...Object.keys(object), ...Object.keys(object.__proto__)].filter(filter);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!~['function', 'object'].indexOf(typeof object[key])) {
      continue;
    }

    if (typeof object[key] === 'object') {
      traverse(object[key], filter);
    } else {
      try {
        Patcher.instead(object, key, () => { });
      } catch { }
    }
  }
};