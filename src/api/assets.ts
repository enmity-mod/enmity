import type { Asset } from 'enmity/api/assets';
import { Assets } from '@metro/common';
import Patcher from '@patcher';

interface Assets {
  [id: string]: Asset;
}

export const assets: Assets = {};

try {
  Patcher.after('enmity-assets', Assets, 'registerAsset', (_, [asset]: [Asset], id: number) => {
    assets[asset.name] = Object.assign(asset, { id });
  });

  // Capture all assets that loaded before our patch
  for (let id = 1; ; id++) {
    const asset = Assets.getAssetByID(id);
    if (!asset) break;
    if (assets[asset.name]) continue;

    assets[asset.name] = Object.assign(asset, { id });
  }
} catch { }

export function find(filter): Asset | null {
  return Object.values(assets).find(filter as any);
}

export function getByName(name: string): Asset | null {
  return assets[name];
}

export function getByID(id: number): Asset | null {
  return Assets.getAssetByID(id);
}

export function getIDByName(name: string): number | null {
  return assets[name]?.id;
}

export const Icons = new Proxy({}, {
  get: (_, name: string) => {
    return getIDByName(name);
  }
})

export default { assets, getByName, getByID, getIDByName };