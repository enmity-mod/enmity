import { getModule } from "./modules";

const assetsModule = getModule(m => m.registerAsset);

function getAssetByName(name: string) {
  let asset;

  let counter = 1;
  while(true) {
    asset = assetsModule.getAssetByID(counter);

    if (asset === undefined) break;
    if (asset.name === name) break;
    counter++;
  }

  return {
    id: counter,
    ...asset
  };
}

function getAssets(): Record<string, string>[] {
  const assets = [];

  let counter = 1;
  while(true) {
    const asset = assetsModule.getAssetByID(counter);
    if (asset === undefined) break;

    assets.push({
      id: counter,
      ...asset
    });
    
    counter++;
  }

  return assets;
}

export {
  getAssetByName,
  getAssets
}