import { getModule } from "../utils/modules";

const clydeModule = getModule(m => m.default?.sendBotMessage);

function sendReply(channelID: string, content: string) {
  clydeModule.default.sendBotMessage(channelID, content);
}

export {
  sendReply
}