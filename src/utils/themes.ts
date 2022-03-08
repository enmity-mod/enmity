import { getModule, getModuleByProps } from "../utils/modules";
import { sendCommand } from "./native";
import { create } from "./patcher";

const CreateThemedStyleSheet = getModule(m => m.createThemedStyleSheet);
const CreateStyleSheet = getModule(m => m.createStyleSheet);

const Theme = getModule(m => m.default?.theme).default.theme;
const ThemeColorMap = getModule(m => m.default?.HEADER_PRIMARY);
const Colors = getModule(m => m.default?.PRIMARY_DARK);

const theme = window["themes"]?.theme ?? "";
const themes = window["themes"]?.list ?? [];
const currentTheme = getThemeByName(theme);

const colorsKey = ["backgroundColor", "borderBottomColor", "borderColor", "borderEndColor", "borderLeftColor", "borderRightColor", "borderStartColor", "borderTopColor", "color", "shadowColor", "textDecorationColor", "textShadowColor", "tintColor"];
const colorsRegex = /\["(.*?)","(.*?)"\]/g;

const ThemePatcher = create("Themer");

/*if (theme !== "") {
  ThemeColorMap.default = {
    ...ThemeColorMap.default,
    ...currentTheme["theme_color_map"]
  };
}

ThemePatcher.instead(CreateThemedStyleSheet, "createThemedStyleSheet", (self, args, res) => {
  let style = res(...args);
  style = JSON.stringify(style);
  return JSON.parse(style);
});

ThemePatcher.instead(CreateStyleSheet, "createStyleSheet", (self, args, res) => {
  let style = res(...args);
  style = JSON.stringify(style);

  return JSON.parse(style);
});*/

/**
 * Get the currently loaded theme name
 */
function getTheme() {
  return theme;
}

/**
 * Get a theme by name
 */
function getThemeByName(name) {
  return themes.find(t => t.name === name);
}

/**
 * List registered themes
 */
function listThemes() {
  return themes.map(t => t.name);
}

/**
 * Apply a theme to Discord
 */
async function applyTheme(name): Promise<string> {
  return new Promise((resolve, reject) => {
    sendCommand("apply-theme", [name, Theme], (data) => {
      resolve(data);
    });
  });
}

/**
 * Remove the currently applied theme
 */
async function removeTheme(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendCommand("remove-theme", [], (data) => {
      resolve(data);
    });
  });
}

export {
  applyTheme,
  getTheme,
  getThemeByName,
  listThemes,
  removeTheme
}