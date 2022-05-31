import { ApplicationCommandOptionType, Command } from 'enmity/api/commands';
import * as Themes from '@managers/themes';
import { sendReply } from '@api/clyde';

export default [
  {
    name: 'themes list',
    description: 'List available themes',

    execute: (_, message) => {
      const themes = Themes.listThemes();

      if (themes.length === 0) {
        sendReply(message.channel.id, 'No themes installed.');
        return;
      }

      sendReply(message.channel.id, `**Installed themes (${themes.length})**: ${themes.join(', ')}`);
    },
  },
  {
    name: 'themes apply',
    description: 'Apply a theme',
    options: [
      {
        name: 'name',
        displayName: 'name',

        description: "Theme's name",
        displayDescription: "Theme's name",

        type: ApplicationCommandOptionType.String,
        required: true,

        choices: Themes.listThemes().map(t => ({
          name: t.name,
          displayName: t.name,
          value: t.name,
        })),
      },
    ],

    execute: (args, message) => {
      const name = args[0].value;
      const theme = Themes.getThemeByName(name);

      if (!theme) {
        sendReply(message.channel.id, "Theme couldn't be found.");
      }

      Themes.applyTheme(name).then(response => {
        sendReply(message.channel.id, response as any);
      });
    },
  },
  {
    name: 'themes clear',
    description: 'Remove applied theme',

    execute: (_, message) => {
      Themes.removeTheme().then(response => {
        sendReply(message.channel.id, response as any);
      });
    },
  }
] as Command[];
