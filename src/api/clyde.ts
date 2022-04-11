import * as Modules from '../utils/modules';

const Messages = Modules.common.messages;
const BotMessages = Modules.common.clyde;
const Images = Modules.common.avatars;

Images.BOT_AVATARS.ENMITY = 'https://github.com/enmity-mod.png';

export function sendReply(channelID: string, content: (string | object), username?: string, avatarURL?: string): void {
  const msg = BotMessages.createBotMessage(channelID, '');

  msg.author.username = username ?? 'Enmity';
  msg.author.avatar = avatarURL ? username : 'ENMITY';

  if (avatarURL) {
    Images.BOT_AVATARS[username] = avatarURL;
  }

  if (typeof content === 'string') {
    msg.content = content;
  } else {
    Object.assign(msg, content);
  }

  Messages.receiveMessage(channelID, msg);
}
