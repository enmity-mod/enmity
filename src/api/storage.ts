import { getModule } from "../utils/modules";

const storageModule = getModule(m => m.getItem);

async function getItem(name) {
  return storageModule.getItem(name);
}

async function setItem(name, value) {
  return storageModule.setItem(name, value);
}

async function removeItem(name: string) {
  return storageModule.removeItem(name);
}

export {
  getItem,
  setItem,
  removeItem
}