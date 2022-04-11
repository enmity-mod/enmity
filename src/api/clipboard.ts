import * as Modules from '../utils/modules';

const Clipboard = Modules.common.clipboard;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setString(text: string): any {
  return Clipboard.setString(text);
}

export async function getString(): Promise<string> {
  return Clipboard.getString();
}
