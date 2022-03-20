import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from 'enmity-api/commands';

import { applyTheme, getThemeByName, listThemes, removeTheme } from '../api/themes';
import { section } from '../api/commands';
import { sendReply } from '../api/clyde';

const themes: Command = {
  id: 'list-themes',
  applicationId: section.id,

  name: 'themes',
  displayName: 'themes',

  description: 'List available themes',
  displayDescription: 'List available themes',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: (args, message) => {
    const themes = listThemes();

    if (themes.length === 0) {
      sendReply(message.channel.id, 'No themes installed.');
      return;
    }

    sendReply(message.channel.id, `**Installed themes (${themes.length})**: ${themes.join(', ')}`);
  },
};

const apply: Command = {
  id: 'apply-theme',
  applicationId: section.id,

  name: 'apply',
  displayName: 'apply',

  description: 'Apply a theme',
  displayDescription: 'Apply a theme',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  options: [
    {
      name: 'name',
      displayName: 'name',

      description: "Theme's name",
      displayDescription: "Theme's name",

      type: ApplicationCommandOptionType.String,
      required: true,

      choices: listThemes().map(t => ({
        name: t,
        displayName: t,
        value: t,
      })),
    },
  ],

  execute: (args, message) => {
    const name = args[0].value;
    const theme = getThemeByName(name);

    if (!theme) {
      sendReply(message.channel.id, "Theme couldn't be found.");
    }

    applyTheme(name).then(response => {
      sendReply(message.channel.id, response);
    });
  },
};

const clear: Command = {
  id: 'clear-theme',
  applicationId: section.id,

  name: 'clear',
  displayName: 'clear',

  description: 'Remove applied theme',
  displayDescription: 'Remove applied theme',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: (args, message) => {
    removeTheme().then(response => {
      sendReply(message.channel.id, response);
    });
  },
};

export default [
  themes,
  apply,
  clear,
];
