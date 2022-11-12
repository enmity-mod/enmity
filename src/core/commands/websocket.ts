import { ApplicationCommandOptionType, Command } from 'enmity/api/commands';
import { connectWebsocket, sendMessage } from '@core/debug/websocket';
import { sendReply } from '@api/clyde';

export default [
  {
    name: 'websocket',
    description: 'Connect to the websocket server',
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

    execute: ([host]) => connectWebsocket(host.value)
  },
  {
    name: 'dump',
    description: "Dump Discord's modules",

    execute: (_, message) => {
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
  },
] as Command[];
