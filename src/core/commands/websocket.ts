import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from 'enmity-api/commands';
import { connectWebsocket, sendMessage } from '@core/debug/websocket';
import { section } from '@api/commands';
import { sendReply } from '@api/clyde';

/**
 * Connect to the websocket server
 */
const connect: Command = {
  id: 'websocket-devtools',
  applicationId: section.id,

  name: 'websocket',
  displayName: 'websocket',

  description: 'Connect to the websocket server',
  displayDescription: 'Connect to the websocket server',

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  options: [
    {
      name: 'host',
      displayName: 'host',

      description: 'Host of the debugger',
      displayDescription: 'Host of the debugger',

      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  execute: args => {
    const host = args[0].value;
    connectWebsocket(host);
  },
};

/**
 * Dump Discord's modules
 */
const dump: Command = {
  id: 'dump-command',
  applicationId: section.id,

  name: 'dump',
  displayName: 'dump',

  description: "Dump Discord's modules",
  displayDescription: "Dump Discord's modules",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: function (args, message) {
    const channeld = message.channel.id;
    const modules = window['modules'];

    function parseValue(value): any {
      if (typeof value === 'function') {
        return value.toString();
      } else if (Array.isArray(value)) {
        return value.map(parseValue);
      } else if (typeof value === 'object') {
        const output = {};

        for (const key in value) {
          output[key] = parseValue(value[key]);
        }

        return output;
      }

      return value;
    }

    for (const m of Object.keys(modules)) {
      try {
        const module = modules[m];
        const dumpedModule = { id: m };

        if (!module.publicModule?.exports) continue;

        const exports = module.publicModule.exports;

        for (const key of Object.keys(module.publicModule.exports)) {
          dumpedModule[key] = parseValue(exports[key]);
        }

        sendMessage(JSON.stringify(dumpedModule, null, '\t'));
      } catch (err) {
        console.log(`Couldn't dump module ${m}`);
        console.log(err);
      }
    }

    sendReply(channeld, 'Modules has been dumped.');
  },
};

export default [
  connect,
  dump,
];
