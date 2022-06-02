import { build, os, device, version, reload } from '@api/native';
import { Messages, Token } from '@metro/common';
import { Command } from 'enmity/api/commands';
import { sendReply } from '@api/clyde';

export default [
  {
    name: 'debug',
    description: 'Print out your device information',

    execute: (_, message) => {
      const content = [];

      content.push('**Debug Info:**');
      content.push(`> Enmity: ${window.enmity.version}`);
      content.push(`> Discord: ${version} (${build})`);
      content.push(`> Device: ${device}`);
      content.push(`> System: ${os}`);

      Messages.sendMessage(message.channel.id, {
        validNonShortcutEmojis: [],
        content: content.join('\n')
      });
    },
  },
  {
    name: 'reload',
    description: 'Reload Discord',

    execute: reload
  },
  {
    name: 'token',
    description: "Show your Discord's token",

    execute: function (_, message) {
      sendReply(message.channel.id, Token.getToken());
    },
  },
] as Command[];
