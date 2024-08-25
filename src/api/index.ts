import * as Plugins from '@managers/plugins';
import * as Themes from '@managers/themes';
import * as Components from '@components';
import * as Commands from '@api/commands';
import * as Settings from '@api/settings';
import * as Utilities from '@utilities';
import * as Assets from '@api/assets';
import * as Native from '@api/native';
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
	utilities: Utilities,
	settings: Settings,
	components: Components,
	native: Native,
	assets: Assets
};

export function initialize(): void {
	window.enmity = API;

	Components.Image.prefetch('https://enmity-mod.github.io/assets/icon.png');
}
