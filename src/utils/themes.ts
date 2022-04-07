import { getModule, getModuleByProps } from '../utils/modules';
import { Theme } from 'enmity-api/themes';
import { sendCommand } from './native';

const Theme = getModule(m => m.default?.theme).default.theme;

const theme = window['themes']?.theme ?? '';
const themes: Theme[] = window['themes']?.list ?? [];

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
 * Apply a theme to Discord
 */
export async function applyTheme(name): Promise<string> {
   return new Promise((resolve, reject) => {
      sendCommand('apply-theme', [name, Theme], data => {
         resolve(data);
      });
   });
}

/**
 * Remove the currently applied theme
 */
export async function removeTheme(): Promise<string> {
   return new Promise((resolve, reject) => {
      sendCommand('remove-theme', [], data => {
         resolve(data);
      });
   });
}
