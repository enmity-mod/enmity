import { Settings } from '@metro/common';
import * as WebSocket from '@core/debug/websocket';
import * as CorePatches from '@core/patches';
import * as Commands from '@core/commands';
import * as API from '@api';

export function initialize(): void {
  WebSocket.initialize();
  API.initialize();
  CorePatches.initialize();
  Commands.initialize();

  if (!Settings.get("shownDeprecationWarning", false) && !window["tweak"]) {
    Settings.set({ shownDeprecationWarning: true })
    alert("Your Enmity Tweak/IPA is out of date! Please update soon. You can ignore this warning, we will only show this once.")
  }
}
