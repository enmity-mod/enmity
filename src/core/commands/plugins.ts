import { section } from '@api/commands';
import { sendReply } from '@api/clyde';

import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from 'enmity-api/commands';
import { disablePlugin, enablePlugin, getDisabledPlugins, getEnabledPlugins, getPlugins, installPlugin, uninstallPlugin } from '../../managers/plugins';

/**
 * List installed plugins
 */
const list: Command = {
  id: 'installed-plugins',
  applicationId: section.id,

  name: 'plugins',
  displayName: 'plugins',
  description: 'List installed plugins',
  displayDescription: 'List installed plugins',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: (args, message) => {
    const channel = message.channel.id;
    const pluginsList = getPlugins();

    if (pluginsList.length === 0) {
      sendReply(channel, 'No plugins installed.');
      return;
    }

    const enabledPlugins = getEnabledPlugins();
    const disabledPlugins = getDisabledPlugins();

    let plugins = '';

    if (enabledPlugins.length > 0) {
      plugins = `**Enabled plugins (${enabledPlugins.length})**:\n`;
      plugins += `> ${enabledPlugins.join(', ')}\n`;
    }

    if (disabledPlugins.length > 0) {
      plugins += `**Disabled plugins (${disabledPlugins.length})**:\n`;
      plugins += `> ${disabledPlugins.join(', ')}`;
    }

    sendReply(channel, plugins);
  },
};

/**
 * Install a plugin
 */
const install: Command = {
  id: 'install-plugin',
  applicationId: section.id,

  name: 'install',
  displayName: 'install',

  description: 'Install a plugin',
  displayDescription: 'Install a plugin',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  options: [
    {
      name: 'plugin',
      displayName: 'plugin',

      description: 'Plugin url',
      displayDescription: 'Plugin url',

      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  execute: (args, message) => {
    const url = args[0].value;
    const channel = message.channel.id;

    installPlugin(url, data => {
      sendReply(channel, data);
    });
  },
};

/**
 * Uninstall a plugin
 */
const uninstall: Command = {
  id: 'uninstall-plugin',
  applicationId: section.id,

  name: 'uninstall',
  displayName: 'uninstall',

  description: 'Uninstall a plugin',
  displayDescription: 'Uninstall a plugin',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  options: [
    {
      name: 'plugin',
      displayName: 'plugin',

      description: 'Plugin name',
      displayDescription: 'Plugin name',

      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  execute: (args, message) => {
    const name = args[0].value;
    const channel = message.channel.id;

    uninstallPlugin(name, data => {
      sendReply(channel, data);
    });
  },
};

/**
 * Enable a plugin
 */
const disable: Command = {
  id: 'disable-plugin',
  applicationId: section.id,

  name: 'disable',
  displayName: 'disable',

  description: 'Disable a plugin',
  displayDescription: 'Disable a plugin',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  options: [
    {
      name: 'plugin',
      displayName: 'plugin',

      description: 'Plugin name',
      displayDescription: 'Plugin name',

      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  execute: (args, message) => {
    const name = args[0].value;
    const channel = message.channel.id;

    // @ts-ignore
    disablePlugin(name, result => {
      if (result === 'yes') {
        sendReply(channel, `**${name}** has been disabled.`);
        return;
      }

      sendReply(channel, `Error when disabling **${name}**.`);
    });
  },
};

/**
 * Disable a plugin
 */
const enable: Command = {
  id: 'enable-plugin',
  applicationId: section.id,

  name: 'enable',
  displayName: 'enable',

  description: 'Enable a plugin',
  displayDescription: 'Enable a plugin',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  options: [
    {
      name: 'plugin',
      displayName: 'plugin',

      description: 'Plugin name',
      displayDescription: 'Plugin name',

      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  execute: (args, message) => {
    const name = args[0].value;
    const channel = message.channel.id;

    enablePlugin(name, result => {
      if (result === 'yes') {
        sendReply(channel, `**${name}** has been enabled.`);
        return;
      }

      sendReply(channel, `Error when enabling **${name}**.`);
    });
  },
};

export default [list, install, uninstall, disable, enable];
