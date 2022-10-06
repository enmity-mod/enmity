import type { Asset } from 'enmity/api/assets';
import { Assets } from '@metro/common';
import Patcher from '@patcher';

interface Assets {
  [id: string]: Asset;
}

export const assets: Assets = {};

try {
  Patcher.after('enmity-assets', Assets, 'registerAsset', (_, [asset]: [Asset], id: number) => {
    asset.id = id;
    assets[asset.name] = asset;
  });

  // Capture all assets that loaded before our patch
  for (let id = 1; ; id++) {
    const asset = Assets.getAssetByID(id);
    if (!asset) break;
    if (assets[asset.name]) continue;

    asset.id = id;
    assets[asset.name] = asset;
  }
} catch (e) {
  console.error('Failed to initialize Asset interceptor.', e.message);
}

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

export default { assets, getByName, getByID, getIDByName };