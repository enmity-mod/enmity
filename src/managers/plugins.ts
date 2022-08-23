import { registerCommands, unregisterCommands } from '@api/commands';
import { Plugin as EnmityPlugin } from 'enmity/managers/plugins';
import { sendCommand } from '@modules/native';
import { getByProps } from '@metro';
import { REST } from '@metro/common';

const EventEmitter = getByProps('EventEmitter').EventEmitter;

let plugins: EnmityPlugin[] = [];
let enabled: string[] = window['plugins'].enabled;
let disabled: string[] = window['plugins'].disabled;

const Events = new EventEmitter();

export function registerPlugin(plugin: EnmityPlugin): void {
  if (!plugin || typeof plugin !== 'object') {
    return;
  }

  plugin.onEnable = (): void => {
    try {
      plugin.onStart();
      if (plugin.commands) {
        registerCommands(plugin.name, plugin.commands);
      }

      console.log(`${plugin.name} has been enabled`);
    } catch (e) {
      console.log(`${plugin.name} failed to load`, e.message);
    }
  };

  plugin.onDisable = (): void => {
    try {
      if (plugin.patches) {
        for (const patch of plugin.patches) {
          patch.unpatchAll();
        }
      }

      if (plugin.commands) {
        unregisterCommands(plugin.name);
      }

      plugin.onStop();
      console.log(`${plugin.name} has been disabled`);
    } catch (e) {
      console.log(`${plugin.name} failed to disable`, e.message);
    }
  };

  if (enabled.includes(plugin.name)) {
    plugin.onEnable();
  }

  if (disabled.includes(plugin.name)) {
    plugin.onDisable();
  }

  if (!getPlugin(plugin.name)) {
    plugins.push(plugin);
  }
}

export const on = Events.on.bind(Events);
export const once = Events.once.bind(Events);
export const off = Events.off.bind(Events);

export function getPlugin(name): EnmityPlugin {
  return plugins.find(p => p.name === name);
}

export function getPlugins(): EnmityPlugin[] {
  return plugins;
}

export function getEnabledPlugins(): string[] {
  return enabled;
}

export function getDisabledPlugins(): string[] {
  return disabled;
}

export function disablePlugin(name: string, onlyUnload = false, callback?: (result) => void): Promise<void> {
  if (enabled.includes(name)) {
    const idx = enabled.indexOf(name);
    if (~idx) enabled.splice(idx, 1);
  }

  if (onlyUnload && disabled.includes(name)) {
    const idx = disabled.indexOf(name);
    if (~idx) disabled.splice(idx, 1);
  }

  if (!onlyUnload) disabled.push(name);
  getPlugin(name).onDisable();

  return new Promise(resolve => {
    sendCommand('disable-plugin', [name], (...data) => {
      if (callback) callback(...data);
      resolve(...data);
    });
  });
}

export function enablePlugin(name: string, callback?: (result) => void): Promise<void> {
  if (disabled.includes(name)) {
    const idx = disabled.indexOf(name);
    if (~idx) disabled.splice(idx, 1);
  }

  enabled.push(name);
  getPlugin(name).onEnable();

  return new Promise(resolve => {
    sendCommand('enable-plugin', [name], (...data) => {
      if (callback) callback(...data);
      resolve(...data);
    });
  });
}

export async function evalPlugin(url: string, enable: boolean = false, update?: () => void): Promise<string> {
  try {
    const response = await REST.get(url);

    const code = response.text;
    const name = url.split('/').pop().split('.')[0];
    const id = Number(Object.keys(window['modules']).pop()) + 1;
    const wrapper = `__d(function(...args) {
        try {
          ${code}
        } catch(err) {
          console.log(err);
        }
      }, ${id}, []);
      __r(${id})`;

    // Try catch this so the plugin doesn't get pushed to enabled when it fails evaluation
    try {
      eval(wrapper);

      if (enable && !enabled.includes(name)) {
        await enablePlugin(name);
      }
    } catch (e) {
      console.log('Failed to eval plugin instance', e.message);
    }

    if (update) update();

    return name;
  } catch (e) {
    console.log('Failed to eval plugin instance', e.message);
  }
}

export function installPlugin(url: string, callback?: (result) => void, update?: () => void): Promise<void> {
  const name = url.split('/').pop().split('.')[0];

  return new Promise(resolve => {
    sendCommand('install-plugin', [url], data => {
      function handleResponse() {
        evalPlugin(url, true).then(name => {
          const res = { name, data, url };
          Events.emit('installed');
          if (callback) callback(res);
          update();
          resolve(res as any);
        });
      }

      if (data === 'overridden_plugin') {
        return disablePlugin(name, true).then(handleResponse);
      }

      return handleResponse();
    });
  });
}

export function uninstallPlugin(name: string, callback?: (result) => void): Promise<void> {
  return new Promise(resolve => {
    disablePlugin(name);

    sendCommand('uninstall-plugin', [name], data => {
      enabled = enabled.filter(p => p !== name);
      disabled = disabled.filter(p => p !== name);

      const index = plugins.findIndex(p => p.name === name);
      if (index > -1) plugins.splice(index, 1);

      Events.emit('uninstalled');
      if (callback) callback(data);
      resolve(data);
    });
  });
}