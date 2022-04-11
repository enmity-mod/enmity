import * as Modules from '../utils/modules';
import { Theme } from 'enmity-api/themes';
import { getRequest } from '../api/rest';
import { sendCommand } from './native';

const Settings = Modules.common.theme;

const theme = window['themes']?.theme ?? '';
let themes: Theme[] = window['themes']?.list ?? [];

/**
 * Get the currently loaded theme name
 */
export function getTheme(): string {
  return theme;
}

/**
 * Get a theme by name
 */
export function getThemeByName(name): Theme {
  return themes.find(t => t.name === name);
}

/**
 * List registered themes
 */
export function listThemes(): string[] {
  return themes.map(t => t.name);
}

/**
 * Install a theme
 */
export async function installTheme(url: string, reply?: (data) => void): Promise<void> {
  sendCommand('install-theme', [url], data => {
    reply(data);
    getRequest(url)
      .then(response => {
        const theme = JSON.parse(response.text);
        themes.push(theme);
      })
      .catch(err => {
        console.error(err);
      });
  });
}

/**
 * Apply a theme to Discord
 */
export async function applyTheme(name, reply?: (data) => void): Promise<void> {
  sendCommand('apply-theme', [name, Settings.theme], data => {
    reply(data);
  });
}

/**
 * Remove the currently applied theme
 */
export async function removeTheme(reply?: (data) => void): Promise<void> {
  sendCommand('remove-theme', [], data => {
    reply(data);
  });
}

/**
 * Uninstall a theme
 */
export async function uninstallTheme(name: string, reply?: (data) => void): Promise<void> {
  sendCommand('uninstall-theme', [name], data => {
    reply(data);
    themes = themes.filter(t => t.name !== name);
  });
}
