import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from './native';
import { getModule, getModuleByIndex, getModuleByProps, getModules } from '../utils/old-modules';
import { getAssetByName, getAssets } from '../utils/assets';

import * as Patcher from '../utils/patcher';
import * as React from './react';
import * as Themes from './themes';
import * as REST from './rest';
import * as Plugins from './plugins';
import * as Users from './users';
import * as Storage from './storage';
import * as Settings from './settings';
import * as Clipboard from './clipboard';
import * as Token from './token';
import * as Commands from './commands';
import * as Clyde from './clyde';
import * as Dialog from './dialog';
import * as Toasts from './toast';
import * as Modules from '../utils/modules';

export function prepareApi(): void {
  window.enmity = {
    modules: Modules,
    themer: Themes,
    patcher: Patcher,
    version: '__VERSION__',
    plugins: Plugins,
    clipboard: Clipboard,
    clyde: Clyde,
    commands: Commands,
    dialog: Dialog,
    rest: REST,
    react: React,
    settings: Settings,
    storage: Storage,
    toast: Toasts,
    token: Token,
    users: Users,
    components: Modules.common.components,
    native: {
      reloadDiscord,
      getVersion,
      getBuild,
      getDevice,
      getSystemVersion,
    },

    /* Legacy Modules */
    getModule,
    getModules,
    getModuleByProps,
    getModuleByIndex,
    getAssetByName,
    getAssets,
  };
}
