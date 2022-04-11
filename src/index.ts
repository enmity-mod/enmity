import './utils/themes';
import { applyPatches } from './patches';
import { prepareApi } from './api';
import { prepareCommands } from './commands';
import { prepareWebsocket } from './utils/websocket';

try {
  prepareWebsocket();
  prepareApi();
  applyPatches();
  prepareCommands();
} catch (error) {
  console.error(error);
}
