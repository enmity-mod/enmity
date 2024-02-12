import WebSocket from '@core/debug/websocket';
import * as Plugins from '@managers/plugins';
import { Settings } from '@metro/common';
import CorePatches from '@core/patches';
import Commands from '@core/commands';
import API from '@api';

export function initialize(): void {
	WebSocket.initialize();
	API.initialize();
	CorePatches.initialize();
	Commands.initialize();
	Plugins.initialize();

	if (!Settings.get("shownDeprecationWarning", false) && !window["tweak"]) {
		Settings.set({ shownDeprecationWarning: true });
		alert("Your Enmity Tweak/IPA is out of date! Please update soon. You can ignore this warning, we will only show this once.");
	}
}

export default { initialize };