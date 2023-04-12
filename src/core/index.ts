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

  if (!Settings.get("shownDeprecationWarning", false) && !window["tweak"]) {
    Settings.set({ shownDeprecationWarning: true })
    alert("Your Enmity Tweak/IPA is out of date! Please update soon. You can ignore this warning, we will only show this once.")
  }

  // go away
  Settings.set({ theme_mode: null });
}

export default { initialize };