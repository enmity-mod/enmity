import type { Theme as ThemeType } from 'enmity/managers/themes';
import { Theme, REST, EventEmitter } from '@metro/common';
import { sendCommand } from '@modules/native';

type Theme = ThemeType;

/**
 * Initialize storage
 */
const { applied, list } = window.themes ?? {};

export let themes = list ?? {};
export let theme = applied;

/**
 * Initialize an event emitter for plugins to use
 */
const Events = new EventEmitter();

export const on = Events.on.bind(Events);
export const once = Events.once.bind(Events);
export const off = Events.off.bind(Events);

/**
 * Get a theme by name
 */
export function get(name): Theme {
  return themes[name] || Object.values(themes).find(t => t.name === name);
}

/**
 * List registered themes
 */
export function getAll(): Theme[] {
  return Object.values(themes);
}

/**
 * Install a theme
 */
export function install(url: string, callback?: (data) => void): Promise<void> {
  return new Promise(resolve => {
    resolve();
    // sendCommand('install-theme', [url], data => {
    //   REST.get(url).then(response => {
    //     const theme = JSON.parse(response.text);
    //     if (!theme) {
    //       throw new Error('Invalid theme structure');
    //     }

    //     const index = themes.findIndex(t => t.name === theme.name);
    //     if (index > -1) themes.splice(index, 1);
    //     themes.push(theme);

    //     const res = { theme, url, data, restart: getTheme() === theme.name };
    //     if (callback) callback(res);
    //     Events.emit('installed');
    //     resolve(res as any);
    //   });
    // });
  });
}

/**
 * Apply a theme to Discord
 */
export function apply(name, callback?: (data) => void): Promise<void> {
  return new Promise(resolve => {
    sendCommand('apply-theme', [name, Theme.theme], data => {
      theme = name;
      if (callback) callback(data);
      Events.emit('applied', name);
      resolve(data);
    });
  });
}

/**
 * Remove the currently applied theme
 */
export function remove(callback?: (data) => void): Promise<void> {
  return new Promise(resolve => {
    sendCommand('remove-theme', [], data => {
      theme = '';
      if (callback) callback(data);
      Events.emit('removed');
      resolve(data);
    });
  });
}

/**
 * Uninstall a theme
 */
export async function uninstall(name: string, callback?: (data) => void): Promise<void> {
  if (theme === name) remove();

  return new Promise(resolve => {
    resolve();
    // sendCommand('uninstall-theme', [name], data => {
    //   const index = themes.findIndex(t => t.name === name);
    //   if (index > -1) themes.splice(index, 1);

    //   Events.emit('uninstalled');
    //   if (callback) callback(data);
    //   resolve(data);
    // });
  });
}
