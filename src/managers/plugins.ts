import { registerCommands, unregisterCommands } from 'enmity/api/commands';
import { Plugin as EnmityPlugin } from 'enmity/managers/plugins';
import { makeStore } from '@api/settings';
import { getByProps } from '@metro';

const Files = nativeModuleProxy['DCDFileManager'] ?? nativeModuleProxy['RTNFileManager'];
const { EventEmitter } = getByProps('EventEmitter');
const Settings = makeStore('enmity');

export interface InternalPlugin {
	instance?: EnmityPlugin;
	started?: boolean;
	filename: string;
	bundle: string;
	path: string;
}

const plugins: InternalPlugin[] = window.ENMITY_PLUGINS ?? [];
const Events = new EventEmitter();

export const on = Events.on.bind(Events);
export const once = Events.once.bind(Events);
export const off = Events.off.bind(Events);

export function initialize() {
	for (const plugin of plugins) {
		loadPlugin(plugin);
	}
}

export function getPlugin(name): InternalPlugin {
	return plugins.find(p => p.instance?.name === name);
}

export function getPlugins(): EnmityPlugin[] {
	return plugins.map(p => p.instance).filter(Boolean);
}

export function getEnabledPlugins(): string[] {
	return Settings.get('enabledPlugins', []) as string[];
}

export function isEnabled(name: string): boolean {
	const enabled = getEnabledPlugins();

	return enabled.includes(name);
}

export function getDisabledPlugins(): string[] {
	const enabled = getEnabledPlugins();
	const disabled = plugins.filter(p => p.instance && !enabled.includes(p.instance.name));

	return disabled.filter(Boolean).map(p => p.instance.name);
}

export function loadPlugin(plugin: InternalPlugin) {
	try {
		if (!plugin.instance) {
			const script = plugin.bundle.replace(/window\.enmity\.plugins\.registerPlugin\((.+?)\)/gmi, 'return $1');
			const res = eval(script);

			plugin.instance = res.default ?? res;

			if (!plugin.instance) throw new Error('Plugin has no instance');
		}

		console.log(`${plugin.filename} loaded.`);

		if (isEnabled(plugin.instance.name)) {
			startPlugin(plugin);
		}

		Events.emit('loaded');
	} catch (e) {
		console.error(`${plugin.filename} failed to load:`, e.message);
	}
}

export function startPlugin(plugin: InternalPlugin) {
	try {
		plugin.instance.onStart();

		if (plugin.instance.commands) {
			registerCommands(plugin.instance.name, plugin.instance.commands);
		}

		plugin.started = true;

		console.log(`${plugin.filename} started.`);
		return true;
	} catch (e) {
		console.error(`${plugin.filename} failed to start:`, e.message);
		return false;
	}
}

export function stopPlugin(plugin: InternalPlugin) {
	try {
		if (!plugin.instance) return true;

		plugin.instance.onStop();

		if (plugin.instance.patches) {
			for (const patch of plugin.instance.patches) {
				patch.unpatchAll();
			}
		}

		if (plugin.instance.commands) {
			unregisterCommands(plugin.instance.name);
		}

		plugin.started = false;

		console.log(`${plugin.filename} stopped.`);
		return true;
	} catch (e) {
		console.error(`${plugin.filename} failed to stop:`, e.message);
		return false;
	}
}

export function disablePlugin(name: string) {
	const enabled = getEnabledPlugins();
	const plugin = getPlugin(name);
	if (!plugin) return;

	if (plugin.started) {
		stopPlugin(plugin);
	}

	const idx = enabled.indexOf(name);
	if (idx > -1) enabled.splice(idx, 1);

	Settings.set('enabledPlugins', enabled);
}

export function enablePlugin(name: string) {
	const enabled = getEnabledPlugins();
	const plugin = getPlugin(name);
	if (!plugin) return;

	if (!plugin.started) {
		startPlugin(plugin);
	}

	Settings.set('enabledPlugins', [...enabled, name]);
}

export async function installPlugin(url: string) {
	try {
		const name = url.split('/').pop();

		const res = await fetch(url, { cache: 'no-cache' });
		const bundle = await res.text();

		if (res.status !== 200) {
			console.error('Failed to install plugin:', res.status, bundle);
			return false;
		} else {
			await Files.writeFile('documents', `Plugins/${name}`, bundle, 'utf8');

			const plugin = { filename: name, path: 'oops', bundle };

			plugins.push(plugin);
			loadPlugin(plugin);
			Events.emit('installed');
			return true;
		}
	} catch (e) {
		console.error('Failed to install plugin:', e);
		return false;
	}
}

export async function uninstallPlugin(name: string) {
	const plugin = getPlugin(name);

	try {
		await Files.removeFile('documents', `Plugins/${plugin.filename}`);

		if (plugin.started) {
			plugin.instance.onDisable();
		}

		const idx = plugins.indexOf(plugin);
		if (idx > -1) plugins.splice(idx, 1);

		Events.emit('uninstalled');
		return true;
	} catch (e) {
		console.error('Failed to uninstall plugin:', e);
		return false;
	}
}

/* DEPRECATED */
export function registerPlugin(plugin: EnmityPlugin): void {
	return alert(plugin.name + ' tried to load through deprecated method.');
}