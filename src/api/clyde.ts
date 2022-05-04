import { Clyde, Messages, Avatars } from '@metro/common';

Avatars.BOT_AVATARS.ENMITY = 'https://github.com/enmity-mod.png';

export function sendReply(channelID: string, content: (string | object), username?: string, avatarURL?: string): void {
  const msg = Clyde.createBotMessage(channelID, '');

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

  Messages.receiveMessage(channelID, msg);
}
