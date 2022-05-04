import { Assets } from '@metro/common';
import Patcher from '@patcher';

export const assets: {
  [id: string]: {
    __packager_asset?: boolean;
    name: string;
    httpServerLocation?: string;
    width: number;
    height: number;
    scales: number[];
    hash: string;
    type: string;
    id: number;
  };
} = {};

Patcher.after('enmity-assets', Assets, 'registerAsset', (_, [asset], id) => {
  assets[asset.name] = { ...asset, id };
});

// Capture all assets that loaded before our patch
for (let id = 1; ; id++) {
  const asset = Assets.getAssetByID(id);
  if (!asset) break;
  if (assets[asset.name]) continue;

  assets[asset.name] = { ...asset, id };
}

export function find(filter) {
  return Object.values(assets).find(filter as any);
}

export function getByName(name: string) {
  return assets[name];
}

export function getByID(id: number) {
  return Assets.getAssetByID(id);
}

export function getIDByName(name: string) {
  return assets[name]?.id;
}

export default { assets, getByName, getByID, getIDByName };