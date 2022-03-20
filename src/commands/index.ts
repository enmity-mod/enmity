
import { registerCommands } from '../api/commands';

import plugins from './plugins';
import themes from './themes';
import utils from './utils';
import websocket from './websocket';

/**
 * Register the built-in Enmity commands
 */
function prepareCommands(): void {
  const commands = [
    ...plugins,
    ...websocket,
    ...utils,
    ...themes,
  ];

  registerCommands('enmity', commands);
}

export {
  prepareCommands,
};
