import { Dialog, Native, REST, Toasts, Token, Users, Clipboard, Storage } from '@metro/common';
import * as Plugins from '@managers/plugins';
import * as Themes from '@managers/themes';
import * as Components from '@components';
import * as Commands from '@api/commands';
import * as Settings from '@api/settings';
import * as Assets from '@api/assets';
import * as Clyde from '@api/clyde';
import * as Patcher from '@patcher';
import * as Modules from '@metro';
import React from 'react';

export const API = {
  modules: Modules,
  themer: Themes,
  patcher: Patcher,
  version: '__VERSION__',
  plugins: Plugins,
  clyde: Clyde,
  commands: Commands,
  settings: Settings,
  components: Components,
  native: Native,
  assets: Assets,

  // Legacy modules
  clipboard: Clipboard,
  storage: Storage,
  token: Token,
  users: Users,
  rest: REST,
  react: {
    ...React,
    ...Components,
    React
  },
  dialog: {
    showDialog: Dialog.show
  },
  toasts: {
    showToast: Toasts.open
  }
};

export function initialize(): void {
  window.enmity = API;
}

export default { API, initialize };