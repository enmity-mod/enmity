import { registerCommands, unregisterCommands } from './commands';
import { Plugin as EnmityPlugin } from 'enmity-api/plugins';
import { getRequest } from './rest';
import { sendCommand } from '../utils/native';

const plugins: EnmityPlugin[] = [];
let enabled: string[] = window['plugins'].enabled;
let disabled: string[] = window['plugins'].disabled;

export function registerPlugin(plugin: EnmityPlugin): void {
  plugin.onEnable = (): void => {
    plugin.onStart();

    if (plugin.commands) {
      registerCommands(plugin.name, plugin.commands);
    }

    console.log(`${plugin.name} has been enabled`);
  };

  plugin.onDisable = (): void => {
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
  };

  if (enabled.includes(plugin.name)) {
    plugin.onEnable();
  }

  if (disabled.includes(plugin.name)) {
    plugin.onDisable();
  }

  plugins.push(plugin);
}

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

export function disablePlugin(name: string, reply?: (result) => void): void {
  if (enabled.includes(name)) {
    enabled.splice(enabled.indexOf(name), 1);
  }

  disabled.push(name);
  getPlugin(name).onDisable();

  sendCommand('disable-plugin', [name], reply);
}

export function enablePlugin(name: string, reply?: (result) => void): void {
  if (disabled.includes(name)) {
    disabled.splice(disabled.indexOf(name), 1);
  }

  disabled.push(name);
  getPlugin(name).onEnable();

  sendCommand('enable-plugin', [name], reply);
}

export function evalPlugin(url: string): void {
  getRequest(url)
    .then(response => {
      const code = response.text;
      const name = url
        .split('/')
        .pop()
        .split('.')[0];
      const id = Number(Object.keys(window['modules']).pop()) + 1;
      const wrapper = `__d(function(...args) {
        try {
          ${code}
        } catch(err) {
          console.log(err);
        }
      }, ${id}, []);
      __r(${id})`;

      enabled.push(name);
      eval(wrapper);
    })
    .catch(err => {
      console.error(err);
    });
}

export function installPlugin(url: string, reply?: (result) => void): void {
  sendCommand('install-plugin', [url], data => {
    evalPlugin(url);
    reply(data);
  });
}

export function uninstallPlugin(name: string, reply?: (result) => void): void {
  disablePlugin(name);

  enabled = enabled.filter(p => p !== name);
  disabled = disabled.filter(p => p !== name);

  sendCommand('uninstall-plugin', [name], data => {
    reply(data);
  });
}
