import { showToast } from '../api/toast';

declare const nativeLoggingHook: (message: string, level: number) => void;

let socket: WebSocket;

/**
 * Connect to a websocket server
 */
export function connectWebsocket(host: string): void {
  console.log('Connecting to debug ws');

  if (socket !== undefined && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
    socket = null;
  }

  socket = new WebSocket(`ws://${host}`);

  socket.addEventListener('open', () => {
    console.log('Connected with debug websocket');

    showToast({
      content: 'Connected to the websocket server.',
    });
  });

  socket.addEventListener('error', (err: any) => {
    console.log(`Error with debug websocket: ${err.message}`);

    showToast({
      content: 'An error occured with the websocket connection.',
    });
  });

  socket.addEventListener('close', (err: any) => {
    console.log(`Error with debug websocket: ${err.message}`);

    showToast({
      content: 'The websocket connection has been closed.',
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
export function prepareWebsocket(): void {
  const _log = nativeLoggingHook;
  globalThis.nativeLoggingHook = (message: string, level: number): void => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ level, message }));
    return _log(message, level);
  };

  if (window['enmity_debug'] === true) {
    connectWebsocket(`${window['enmity_debug_ip']}:9090`);
  }
}

/**
 * Send a message to the websocket server
 */
export function sendMessage(message: string): void {
  if (socket?.readyState === WebSocket.OPEN) socket.send(message);
}
