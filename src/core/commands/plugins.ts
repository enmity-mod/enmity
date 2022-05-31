import { ApplicationCommandOptionType, Command } from 'enmity/api/commands';
import * as Plugins from '@managers/plugins';
import { sendReply } from '@api/clyde';

export default [
  {
    name: 'plugins list',
    description: 'List installed plugins',

    execute: (_, message) => {
      const channel = message.channel.id;
      const pluginsList = Plugins.getPlugins();

      if (pluginsList.length === 0) {
        sendReply(channel, 'No plugins installed.');
        return;
      }

      const enabledPlugins = Plugins.getEnabledPlugins();
      const disabledPlugins = Plugins.getDisabledPlugins();

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
  },
  {
    name: 'plugins install',
    description: 'Install a plugin',
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

      Plugins.installPlugin(url, data => {
        sendReply(channel, data);
      });
    },
  },
  {
    name: 'plugins uninstall',
    description: 'Uninstall a plugin',
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

      Plugins.uninstallPlugin(name, data => {
        sendReply(channel, data);
      });
    },
  },
  {
    name: 'plugins disable',
    description: 'Disable a plugin',
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
  },
  {
    name: 'plugins enable',
    description: 'Enable a plugin',
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

      Plugins.enablePlugin(name, result => {
        if (result === 'yes') {
          sendReply(channel, `**${name}** has been enabled.`);
          return;
        }

        sendReply(channel, `Error when enabling **${name}**.`);
      });
    },
  }
] as Command[];
