import { build, os, device, version, reload } from '@api/native';
import { Command } from 'enmity/api/commands';
import { sendReply } from '@api/clyde';
import { Token } from '@metro/common';

export default [
  {
    name: 'debug',
    description: 'Print out your device information',

    execute: () => {
      let content = '**Debug Info:**\n';
      content += `> Enmity: ${window['enmity'].version}\n`;
      content += `> Discord: ${version} (${build})\n`;
      content += `> Device: ${device}\n`;
      content += `> System: ${os}\n`;

      return {
        content,
      };
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
