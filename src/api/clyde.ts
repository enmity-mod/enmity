import { Clyde, Messages, Avatars } from '@metro/common';
import { getByProps } from '@metro';

const Channels = getByProps('getLastSelectedChannelId');

try {
  Avatars.BOT_AVATARS.ENMITY = 'https://github.com/enmity-mod.png';
} catch { }

export function sendReply(channelID: string, content: (string | object), username?: string, avatarURL?: string): void {
  const channel = channelID ?? Channels?.getChannelId?.();
  const msg = Clyde.createBotMessage(channel, '');

  msg.author.username = username ?? 'Enmity';
  msg.author.avatar = avatarURL ? username : 'ENMITY';

  if (avatarURL) {
    Avatars.BOT_AVATARS[username] = avatarURL;
  }

  if (typeof content === 'string') {
    msg.content = content;
  } else {
    Object.assign(msg, content);
  }

  Messages.receiveMessage(channel, msg);
}
