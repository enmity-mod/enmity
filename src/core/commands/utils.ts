import { ApplicationCommandInputType, ApplicationCommandType, Command } from 'enmity-api/commands';
import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from '@api/native';
import { section } from '@api/commands';

import { Token } from '@metro/common';
import { sendReply } from '@api/clyde';

/**
 * Print out debug information
 */
const debug: Command = {
  id: 'debug-command',

  name: 'debug',
  displayName: 'debug',

  description: 'Print out your device information',
  displayDescription: 'Print out your device information',

  applicationId: section.id,

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltInText,

  execute: () => {
    let content = '**Debug Info:**\n';
    content += `> Enmity: ${window['enmity'].version}\n`;
    content += `> Discord: ${getVersion()} (${getBuild()})\n`;
    content += `> Device: ${getDevice()}\n`;
    content += `> System: ${getSystemVersion()}\n`;

    return {
      content,
    };
  },
};

/**
 * Reload Discord
 */
const reload: Command = {
  id: 'reload-command',

  name: 'reload',
  displayName: 'reload',

  description: 'Reload Discord',
  displayDescription: 'Reload Discord',

  applicationId: section.id,

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: function (args) {
    reloadDiscord();
  },
};

/**
 * Print your token
 */
const getToken: Command = {
  id: 'token-command',

  name: 'token',
  displayName: 'token',

  description: "Show your Discord's token",
  displayDescription: "Show your Discord's token",

  applicationId: section.id,

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: function (args, message) {
    sendReply(message.channel.id, Token.getToken());
  },
};

export default [
  debug,
  reload,
  getToken,
];
