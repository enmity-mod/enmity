
import { registerCommands } from "../api/commands";
import plugins from "./plugins";
import websocket from "./websocket";
import utils from "./utils";
import themes from "./themes";

/**
 * Register the built-in Enmity commands
 */
function prepareCommands() {
  const commands = [
    ...plugins,
    ...websocket,
    ...utils,
    ...themes,
  ];

  registerCommands("enmity", commands);
}

export {
  prepareCommands
};