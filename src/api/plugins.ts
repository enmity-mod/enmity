import { registerCommands, unregisterCommands } from "./commands";
import { Plugin as EnmityPlugin } from "enmity-api/plugins";
import { sendCommand } from "../utils/native";

const plugins: EnmityPlugin[] = [];
const enabled: string[] = window["plugins"].enabled;
const disabled: string[] = window["plugins"].disabled;

function registerPlugin(plugin: EnmityPlugin) {
  plugin.onEnable = () => {
    plugin.onStart();

    if (plugin.commands) {
      registerCommands(plugin.name, plugin.commands);
    }

    console.log(`${plugin.name} has been enabled`);
  }

  plugin.onDisable = () => {
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

function getPlugin(name) {
  return plugins.find(p => p.name === name);
}

function getPlugins() {
  return plugins;
}

function getEnabledPlugins() {
  return enabled;
}

function getDisabledPlugins() {
  return disabled;
}

function disablePlugin(name: string, reply?: (result) => void) {
  if (enabled.includes(name)) {
    enabled.splice(enabled.indexOf(name), 1);
  }

  disabled.push(name);
  getPlugin(name).onDisable();

  sendCommand("disable-plugin", [name], reply);
}

function enablePlugin(name: string, reply?: (result) => void) {
  if (disabled.includes(name)) {
    disabled.splice(disabled.indexOf(name), 1);
  }

  disabled.push(name);
  getPlugin(name).onEnable();

  sendCommand("enable-plugin", [name], reply);
}

export {
  registerPlugin,
  getPlugin,
  getPlugins,
  getEnabledPlugins,
  getDisabledPlugins,

  disablePlugin,
  enablePlugin
}