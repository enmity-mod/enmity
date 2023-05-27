import type { Theme as ThemeType } from 'enmity/managers/themes';
import { sendCommand } from '@modules/native';
import { Theme, REST } from '@metro/common';
import { getByProps } from '@metro';
import writeFile from '@utilities/writeFile';

const { EventEmitter } = getByProps('EventEmitter');
const Events = new EventEmitter();

type Theme = ThemeType;

let theme = window['themes']?.theme ?? '';
let themes: Theme[] = window['themes']?.list ?? [];

export const on = Events.on.bind(Events);
export const once = Events.once.bind(Events);
export const off = Events.off.bind(Events);

/**
 * Get the currently loaded theme name
 */
export function getTheme(): string {
  return theme;
}

/**
 * Get a theme by name
 */
export function getThemeByName(name): ThemeType {
  return themes.find(t => t.name === name);
}

/**
 * List registered themes
 */
export function listThemes(): Theme[] {
  return themes;
}

/**
 * Install a theme
 */
export async function installTheme(url: string, callback?: (data) => void): Promise<void> {
    const resolver = ({ theme, callback, data, resolve }) => {
        const index = themes.findIndex(t => t.name === theme.name);
        if (index > -1) themes.splice(index, 1);
        themes.push(theme);

        const res = { theme, name: theme.name, url, data, restart: getTheme() === theme.name };
        if (callback) callback(res);
        Events.emit('installed');
        resolve(res as any);
    }

    return new Promise(resolve => {
        sendCommand('install-theme', [url], data => {
            REST.get(url).then(response => {
                const theme = JSON.parse(response.text);
                if (!theme) {
                    throw new Error('Invalid theme structure');
                }

                try {
                    const themeName = url.substring(url.lastIndexOf('/') + 1).replace(".json", "");
                    
                    const formattedTheme = {
                        ...theme,
                        displayName: theme.displayName ?? theme.name,
                        name: themeName
                    }
            
                    if (theme.name === themeName) return resolver({ theme, callback, data, resolve });
                    if (data !== "fucky_wucky") writeFile(`Themes/${themeName}.json`, JSON.stringify(formattedTheme, null, 2))
                        .then(() => resolver({ theme: formattedTheme, callback, data, resolve }));
                } catch(e) {
                    console.error(e);
                }
            });
        });
    });
}

/**
 * Apply a theme to Discord
 */
export function applyTheme(name, callback?: (data) => void): Promise<void> {
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
export function removeTheme(callback?: (data) => void): Promise<void> {
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
export async function uninstallTheme(name: string, callback?: (data) => void): Promise<void> {
  if (getTheme() === name) removeTheme();

  return new Promise(resolve => {
    sendCommand('uninstall-theme', [name], data => {
      if (data === "uninstalled_theme") {
        const index = themes.findIndex(t => t.name === name);
        if (index > -1) themes.splice(index, 1);

        Events.emit('uninstalled');
        if (callback) callback(data);
      }

      resolve(data);
    });
  });
}