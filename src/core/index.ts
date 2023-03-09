import { Settings } from '@metro/common';
import WebSocket from '@core/debug/websocket';
import CorePatches from '@core/patches';
import Commands from '@core/commands';
import API from '@api';

export function initialize(): void {
  WebSocket.initialize();
  API.initialize();
  CorePatches.initialize();
  Commands.initialize();

  // go away
  Settings.set({ theme_mode: null });
}

export default { initialize };