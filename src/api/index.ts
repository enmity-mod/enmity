import * as Plugins from '@managers/plugins';
import * as Themes from '@managers/themes';
import * as Components from '@components';
import * as Commands from '@api/commands';
import * as Settings from '@api/settings';
import { Native } from '@metro/common';
import * as Assets from '@api/assets';
import * as Clyde from '@api/clyde';
import * as Patcher from '@patcher';
import * as Modules from '@metro';

export const API = {
  modules: Modules,
  themer: Themes,
  patcher: Patcher,
  version: '__VERSION__',
  plugins: Plugins,
  clyde: Clyde,
  commands: Commands,
  settings: Settings,
  components: Components,
  native: Native,
  assets: Assets
};

export function initialize(): void {
  window.enmity = API;
}

export default { API, initialize };