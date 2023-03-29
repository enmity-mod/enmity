import { Command, ApplicationCommandOptionType } from 'enmity/api/commands';
import { Messages, Token, Toasts, Clipboard } from '@metro/common';
import { build, os, device, version, reload } from '@api/native';
import { getIDByName } from "@api/assets";
import { sendReply } from '@api/clyde';

const Icons = {
  Checkmark: getIDByName('Check')
}

export default [
  {
    name: 'debug',
    description: 'Print out your device information',
    options : [
      {
        name: 'silent',
        displayName: 'silent',

        description: 'Prints the debug informations in silent mode. Only you will see them.',
        displayDescription: 'Prints the debug informations in silent mode. Only you will see them.',

        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ],

    execute: (args, message) => {
      const silent = args.find(a => a.name === "silent")?.value;
      const content = [];

      const Runtime = HermesInternal.getRuntimeProperties();

      content.push('**Debug Info:**\n');
      content.push(`> **Enmity:** ${window.enmity.version}`);
      content.push(`> **Tweak:** ${window["tweak"]?.version ?? "N/A"}`);
      content.push(`> **Discord:** ${version} (Build ${build})`);
      content.push(`> **Hermes:** ${Runtime['OSS Release Version']}`);
      content.push(`> **Bytecode:** ${Runtime['Bytecode Version']}`);
      content.push(`> **Device:** ${device}`);
      content.push(`> **System:** ${os}`);
      
      const payload = content.join('\n');

      if (!silent) return {
        validNonShortcutEmojis: [],
        content: payload 
      }
      sendReply(message.channel.id, payload)
      return {}
    },
  },
  {
    name: 'reload',
    description: 'Reload Discord',

    execute: reload
  },
  {
    name: 'token',
    description: 'Displays your account\'s token.',

    options : [
      {
        name: 'clipboard',
        displayName: 'clipboard',

        description: 'Copy your token directly to the clipboard.',
        displayDescription: 'Copy your token directly to the clipboard.',

        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ],

    execute: ([clipboard = { value: false }], message) => {
      sendReply(message.channel.id, [
        'This is your Discord token. It can grant full access to your account, messages and anything else you keep on Discord.',
        'If someone is asking you to give this token to them, they are most likely attempting to get access to your account in a malicious manner',
        'Keep your token safe, and don\'t share it with **anyone**',
        Token.getToken()
      ].join('\n'));

      if (clipboard.value) {
        Clipboard.setString(Token.getToken());
        Toasts.open({
          content: 'Token succesfully copied into your clipboard',
          source: Icons.Checkmark
        })
      }
    },
  },
] as Command[];
