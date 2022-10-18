import { build, os, device, version, reload } from '@api/native';
import { Messages, Token, Toasts, Clipboard } from '@metro/common';
import { Command, ApplicationCommandOptionType } from 'enmity/api/commands';
import { sendReply } from '@api/clyde';
import { getIDByName } from "@api/assets";

export default [
  {
    name: 'debug',
    description: 'Print out your device information',
    options : [
      {
        name: "silent",
        displayName: "silent",

        description: "Prints the debug informations in silent mode. Only you will see them.",
        displayDescription: "Prints the debug informations in silent mode. Only you will see them.",

        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ],

    execute: (args, message) => {
      const content = [];

      const Runtime = HermesInternal.getRuntimeProperties();

      content.push('**Debug Info:**\n');
      content.push(`> **Enmity Version:** ${window.enmity.version}`);
      content.push(`> **Discord Version:** ${version} (Build ${build})`);
      content.push(`> **Hermes Version:** ${Runtime['OSS Release Version']}`);
      content.push(`> **Bytecode Version:** ${Runtime['Bytecode Version']}`);
      content.push(`> **Device:** ${device}`);
      content.push(`> **System:** ${os}`);

      const silent = args[args.findIndex(x => x.name === 'silent')];
      const debugInfos = content.join("\n");

      if (silent) {
        Messages.sendMessage(message.channel.id, {
          validNonShortcutEmojis: [],
          content: debugInfos
      });
    } else {
      sendReply(message.channel.id, debugInfos)
    }
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

    options : [
      {
        name: "clipboard",
        displayName: "clipboard",

        description: "Copy your token directly to the clipboard.",
        displayDescription: "Copy your token directly to the clipboard.",

        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ],

    execute: function (args, message) {
      const copyToClip = args[args.findIndex(x => x.name === "clipboard")];
      sendReply(message.channel.id, "This is your Discord token. Please keep it **__REALLY__** safe.");
      sendReply(message.channel.id, Token.getToken());
      if (copyToClip) {
        Clipboard.setString(Token.getToken());
        Toasts.open({
          content: "Token succesfully copied into your clipboard",
          source: getIDByName("Check")
        })
      }
    },
  },
] as Command[];
