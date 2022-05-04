import { Linking } from '@metro/common';
import uuid from '@utilities/uuid';

interface URL {
  url: string;
}

interface Response {
  id: string;
  data: string;
}

const replies = {};

Linking.addEventListener('url', (url: URL) => {
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
  const id = uuid();

  Linking.openURL(`com.hammerandchisel.discord://enmity?id=${id}&command=${name}&params=${params.join(',')}`).then(() => {
    if (reply) {
      replies[id] = reply;
    }
  });
}
