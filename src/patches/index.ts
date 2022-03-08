import { patchNavigator } from "./navigator";
import { patchSettings } from "./settings";

function applyPatches() {
  patchNavigator();
  patchSettings();
}

export {
  applyPatches
}