import { getModule } from '../utils/modules';

const storageModule = getModule(m => m.getItem);

export async function getItem(name): Promise<string | null> {
  return storageModule.getItem(name);
}

export async function setItem(name, value): Promise<string | null> {
  return storageModule.setItem(name, value);
}

export async function removeItem(name: string): Promise<void> {
  return storageModule.removeItem(name);
}
