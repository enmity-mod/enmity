
import { registerCommands } from '@api/commands';

import websocket from './websocket';
import plugins from './plugins';
import themes from './themes';
import utils from './utils';

/**
 * Register the built-in Enmity commands
 */
export function initialize(): void {
  const commands = [
    ...plugins,
    ...websocket,
    ...utils,
    ...themes,
  ];

  registerCommands('enmity', commands);
}

export default { initialize };
