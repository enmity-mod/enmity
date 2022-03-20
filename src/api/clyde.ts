import { getModule } from '../utils/modules';

const clydeModule = getModule(m => m.default?.sendBotMessage);

export function sendReply(channelID: string, content: string): void {
  clydeModule.default.sendBotMessage(channelID, content);
}
