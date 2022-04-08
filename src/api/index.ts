import { after, before, create, instead, unpatchAll } from '../utils/patcher';
import { getAssetByName, getAssets } from '../utils/assets';
import { getModule, getModuleByIndex, getModuleByProps, getModules } from '../utils/modules';

import * as React from './react';
import { applyTheme, getTheme, getThemeByName, listThemes, removeTheme } from './themes';
import { deleteRequest, getAPIBaseURL, getRequest, patchRequest, postRequest, putRequest } from './rest';
import { disablePlugin, enablePlugin, getDisabledPlugins, getEnabledPlugins, getPlugin, getPlugins, registerPlugin } from './plugins';
import { fetchCurrentUser, fetchProfile, getUser } from './users';
import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from './native';
import { getItem, removeItem, setItem } from './storage';
import { getSetting, setSetting } from './settings';
import { getString, setString } from './clipboard';
import { getToken, hideToken, removeToken, setToken, showToken } from './token';
import { registerCommands, unregisterCommands } from './commands';
import { sendReply } from './clyde';
import { showDialog } from './dialog';
import { showToast } from './toast';

export function prepareApi(): void {
  window['enmity'] = {
    'getModule': getModule,
    'getModules': getModules,
    'getModuleByProps': getModuleByProps,
    'getModuleByIndex': getModuleByIndex,
    'getAssetByName': getAssetByName,
    'getAssets': getAssets,
    'version': '__VERSION__',

    'themer': {
      getTheme,
      getThemeByName,
      listThemes,
      applyTheme,
      removeTheme,
    },

    'patcher': {
      create,
      before,
      instead,
      after,
      unpatchAll
    },

    'plugins': {
      enabled: [],
      disabled: [],

      registerPlugin,
      getPlugin,
      getPlugins,
      getEnabledPlugins,
      getDisabledPlugins,

      disablePlugin,
      enablePlugin,
    },

    'clipboard': {
      setString,
      getString,
    },

    'clyde': {
      sendReply,
    },

    'commands': {
      registerCommands,
      unregisterCommands,
    },

    'dialog': {
      showDialog,
    },

    'native': {
      reloadDiscord,
      getVersion,
      getBuild,
      getDevice,
      getSystemVersion,
    },

    'rest': {
      get: getRequest,
      post: postRequest,
      put: putRequest,
      patch: patchRequest,
      delete: deleteRequest,
      getAPIBaseURL,
    },

    'react': {
      ...React,
    },

    'settings': {
      get: getSetting,
      set: setSetting,
    },

    'storage': {
      getItem,
      setItem,
      removeItem,
    },

    'toast': {
      showToast,
    },

    'token': {
      getToken,
      setToken,
      hideToken,
      showToken,
      removeToken,
    },

    'users': {
      fetchCurrentUser,
      fetchProfile,
      getUser,
    },
  };
}
