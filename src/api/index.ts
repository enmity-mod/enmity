import { getAssetByName, getAssets } from '../utils/assets';
import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from './native';
import { getModule, getModuleByIndex, getModuleByProps, getModules } from '../utils/old-modules';

import * as Clipboard from './clipboard';
import * as Clyde from './clyde';
import * as Commands from './commands';
import * as Dialog from './dialog';
import * as Modules from '../utils/modules';
import * as Patcher from '../utils/patcher';
import * as Plugins from './plugins';
import * as REST from './rest';
import * as React from './react';
import * as Settings from './settings';
import * as Storage from './storage';
import * as Themes from './themes';
import * as Toasts from './toast';
import * as Token from './token';
import * as Users from './users';

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
    rest: {
      getAPIBaseURL: REST.getAPIBaseURL,
      get: REST.getRequest,
      put: REST.putRequest,
      post: REST.postRequest,
      delete: REST.deleteRequest,
    },
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
