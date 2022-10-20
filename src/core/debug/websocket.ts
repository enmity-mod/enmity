import { getIDByName } from '@api/assets';
import { Toasts } from '@metro/common';
import Settings from '@api/settings';
import { getByName } from '@metro';

declare const nativeLoggingHook: (message: string, level: number) => void;

const Logger = getByName('Logger');
const EnmityLogger = new Logger('Enmity');
export let socket: WebSocket;

/**
 * Connect to a websocket server
 */
export function connectWebsocket(host?: string): void {
  console.log('Connecting to debug WebSocket');

  if (socket !== undefined && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
    socket = null;
  }

  const address = Boolean(Settings.get('enmity', 'autoConnectWS', false)) && Settings.get('enmity', 'debugWSAddress');
  if (!address && !host) return;
  socket = new WebSocket(`ws://${host ?? address}`);

  socket.addEventListener('open', () => {
    console.log('Connected with debug websocket');

    Toasts.open({
      content: `Connected to the WebSocket server.`,
      source: getIDByName('Check')
    });
  });

  socket.addEventListener('error', (err: any) => {
    console.log(`Error with debug websocket: ${err.message}`);

    Toasts.open({
      content: `An error occured with the websocket connection.`,
      source: getIDByName('toast_copy_link')
    });
  });

  socket.addEventListener('close', (err: any) => {
    console.log(`Error with debug websocket: ${err.message}`);

    Toasts.open({
      content: `The websocket connection has been closed.`,
      source: getIDByName('toast_copy_link')
    });
  });

  socket.addEventListener('message', message => {
    try {
      console.log(eval(message.data));
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Hook the log function to the websocket server and connect to it
 */
export function initialize(): void {
  const oNativeLoggingHook = nativeLoggingHook;
  global.nativeLoggingHook = function (message: string, level: number): void {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ level, message }));
    }

    EnmityLogger.log(message);
    return oNativeLoggingHook.apply(this, arguments);
  };

  if (Settings.get('enmity', 'autoConnectWS', false)) {
    connectWebsocket();
  }
}

/**
 * Send a message to the websocket server
 */
export function sendMessage(message: string): void {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
}

export default { initialize, sendMessage, connectWebsocket, socket };