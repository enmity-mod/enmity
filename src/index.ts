import './utils/themes';
import { applyPatches } from './patches';
import { prepareApi } from './api';
import { prepareCommands } from './commands';
import { prepareWebsocket } from './utils/websocket';

try {
  prepareApi();
  applyPatches();
  prepareWebsocket();
  prepareCommands();
} catch (error) {
  console.error(error);
}
