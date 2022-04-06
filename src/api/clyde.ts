import { getModule } from '../utils/modules';

const clydeModule = getModule(m => m.default?.receiveMessage);
const createBotMessageModule = getModule(m => m.createBotMessage);
const botAvatarsModule = getModule(m => m.default?.BOT_AVATARS);

botAvatarsModule.default.BOT_AVATARS.enmity = "https://cdn.discordapp.com/attachments/950850316318933004/961398357866217502/101209876.png"

export function sendReply(channelID: string, content: (string | object), username?: string, avatarURL?: string): void {
  let receivedMessage = createBotMessageModule.createBotMessage(channelID, '');

  receivedMessage.author.username = username ?? "Enmity";
  receivedMessage.author.avatar = username ? username.toLowerCase() : "enmity"; 
  if (avatarURL) {
    botAvatarsModule.default.BOT_AVATARS[username] = avatarURL;
    receivedMessage.author.avatar = username;
  }
  
  if (typeof content === "string") {
    receivedMessage.content = content;
  } else {
    receivedMessage.embeds.push(content);
  }
  clydeModule.default.receiveMessage(channelID, receivedMessage);
}
