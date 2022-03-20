import { getModule } from './modules';
import { v4 as uuidv4 } from 'uuid';

const linkingModule = getModule(m => m.openURL);

interface URL {
  url: string;
}

interface Response {
  id: string;
  data: string;
}

const replies = {};

linkingModule.addEventListener('url', (url: URL) => {
  let responseUrl = url.url;
  responseUrl = decodeURIComponent(responseUrl.replace('com.hammerandchisel.discord://', ''));

  try {
    const response: Response = JSON.parse(responseUrl);
    if (response.data === undefined) return;

    if (replies[response.id]) {
      replies[response.id](response.data);
      delete replies[response.id];
    }
  } catch (e) {
    return;
  }
});

/**
 * Send a command to the native handler of Enmity
 * @param name
 * @param params
 */
export function sendCommand(name: string, params: string[] = [], reply?: (data) => void): void {
  const id = uuidv4();

  linkingModule.openURL(`com.hammerandchisel.discord://enmity?id=${id}&command=${name}&params=${params.join(',')}`).then(() => {
    if (reply) {
      replies[id] = reply;
    }
  });
}
