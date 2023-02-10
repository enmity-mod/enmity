import { ApplicationCommandOptionType, Command } from 'enmity/api/commands';
import * as Plugins from '@managers/plugins';
import { sendReply } from '@api/clyde';

export default [
  {
    name: 'plugins list',
    description: 'List installed plugins',

    execute: (_, message) => {
      const channel = message.channel.id;
      const list = Plugins.getPlugins();

      if (list.length === 0) {
        sendReply(channel, 'No plugins installed.');
        return;
      }

      const enabled = Plugins.getEnabledPlugins();
      const disabled = Plugins.getDisabledPlugins();

      let plugins = '';

      if (enabled.length > 0) {
        plugins = `**Enabled plugins (${enabled.length})**:\n`;
        plugins += `> ${enabled.join(', ')}\n`;
      }

      if (disabled.length > 0) {
        plugins += `**Disabled plugins (${disabled.length})**:\n`;
        plugins += `> ${disabled.join(', ')}`;
      }

      sendReply(channel, plugins);
    },
  },
  {
    name: 'plugins install',
    description: 'Install a plugin',
    options: [
      {
        name: 'url',
        displayName: 'url',

        description: 'The URL of the plugin you\'d like to install.',
        displayDescription: 'The URL of the plugin you\'d like to install.',

        required: true,
        type: ApplicationCommandOptionType.String,
      }
    ],

    execute: ([link], message) => {
      const url = link.value;
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

    execute: ([plugin], message) => {
      const name = plugin.value;
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

    execute: ([plugin], message) => {
      const name = plugin.value;
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
