import { getModule } from '../utils/modules';

const clydeModule = getModule(m => m.default?.receiveMessage);
const createBotMessageModule = getModule(m => m.createBotMessage);
const botAvatarsModule = getModule(m => m.default?.BOT_AVATARS);

botAvatarsModule.default.BOT_AVATARS.enmity = "https://cdn.discordapp.com/attachments/950850316318933004/961398357866217502/101209876.png"

export function sendReply(channelID: string, content: string, username?: string, avatarURL?: string): void {
  let receivedMessage = createBotMessageModule.createBotMessage(channelID, content);

  receivedMessage.author.username = username ?? "Enmity";
  receivedMessage.author.avatar = "enmity"; 
  if (avatarURL) {
    botAvatarsModule.default.BOT_AVATARS[username] = avatarURL;
    receivedMessage.author.avatar = username;
  }
  clydeModule.default.receiveMessage(channelID, receivedMessage);
}
