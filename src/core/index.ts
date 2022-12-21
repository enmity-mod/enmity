import { Settings, Theme } from '@metro/common';
import WebSocket from '@core/debug/websocket';
import CorePatches from '@core/patches';
import Commands from '@core/commands';
import API from '@api';

export function initialize(): void {
  WebSocket.initialize();
  API.initialize();
  CorePatches.initialize();
  Commands.initialize();

  // Update theme state
  Settings.set({ theme_mode: Theme.theme === 'dark' ? 0 : 1 });
}

export default { initialize };