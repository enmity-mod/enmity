import { getModule } from '../utils/modules';

const Messages = getModule(m => m.default?.receiveMessage);
const BotMessages = getModule(m => m.createBotMessage);
const Images = getModule(m => m.default?.BOT_AVATARS);

Images.default.BOT_AVATARS.ENMITY = 'https://github.com/enmity-mod.png';

export function sendReply(channelID: string, content: (string | object), username?: string, avatarURL?: string): void {
  const msg = BotMessages.createBotMessage(channelID, '');

  msg.author.username = username ?? 'Enmity';
  msg.author.avatar = avatarURL ? username : 'ENMITY';

  if (avatarURL) {
    Images.default.BOT_AVATARS[username] = avatarURL;
  }

  if (typeof content === 'string') {
    msg.content = content;
  } else {
    Object.assign(msg, content);
  }

  Messages.default.receiveMessage(channelID, msg);
}
