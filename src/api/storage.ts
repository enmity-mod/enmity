import * as Modules from '../utils/modules';

const Storage = Modules.common.storage;

export async function getItem(name): Promise<string | null> {
  return Storage.getItem(name);
}

export async function setItem(name, value): Promise<string | null> {
  return Storage.setItem(name, value);
}

export async function removeItem(name: string): Promise<void> {
  return Storage.removeItem(name);
}
