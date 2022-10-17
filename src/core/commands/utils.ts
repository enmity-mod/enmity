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

      const Runtime = HermesInternal.getRuntimeProperties();

      content.push('**Debug Info:**\n');
      content.push(`> **Enmity Version:** ${window.enmity.version}`);
      content.push(`> **Discord Version:** ${version} (Build ${build})`);
      content.push(`> **Hermes Version:** ${Runtime['OSS Release Version']}`);
      content.push(`> **Bytecode Version:** ${Runtime['Bytecode Version']}`);
      content.push(`> **Device:** ${device}`);
      content.push(`> **System:** ${os}`);

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
      sendReply(message.channel.id, "This is your Discord token. Please keep it **__REALLY__** safe.");
      sendReply(message.channel.id, Token.getToken());
    },
  },
] as Command[];
