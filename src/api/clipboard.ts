import { getModuleByProps } from '../utils/modules';

const ClipboardModule = getModuleByProps('setString', 'getString');

export function setString(text: string): void {
  ClipboardModule.setString(text);
}

export async function getString(): Promise<string> {
  return ClipboardModule.getString();
}
