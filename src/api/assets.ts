import type { Asset } from 'enmity/api/assets';
import { Assets } from '@metro/common';
import Patcher from '@patcher';

interface Assets {
  [id: string]: Asset;
}

export const assets: Assets = {};

Patcher.after('enmity-assets', Assets, 'registerAsset', (_, [asset]: [Asset], id: number) => {
  assets[asset.name] = { ...asset, id };
});

// Capture all assets that loaded before our patch
for (let id = 1; ; id++) {
  const asset = Assets.getAssetByID(id);
  if (!asset) break;
  if (assets[asset.name]) continue;

  assets[asset.name] = { ...asset, id };
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