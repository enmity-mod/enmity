import { getModule } from './modules';

const assetsModule = getModule(m => m.registerAsset);

export function getAssetByName(name: string): Record<string, any> {
  let asset;

  let counter = 1;
  while (true) {
    asset = assetsModule.getAssetByID(counter);

    if (asset === undefined) break;
    if (asset.name === name) break;
    counter += 1;
  }

  return {
    id: counter,
    ...asset,
  };
}

export function getAssets(): Record<string, string>[] {
  const assets = [];

  let counter = 1;
  while (true) {
    const asset = assetsModule.getAssetByID(counter);
    if (asset === undefined) break;

    assets.push({
      id: counter,
      ...asset,
    });

    counter += 1;
  }

  return assets;
}
