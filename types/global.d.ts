import type { InternalPlugin } from '@managers/plugins';

declare global {
	var enmity: typeof import('@api').API;
	var modules: Record<string | number | symbol, any>;

	var React: typeof import('react');
	var ReactNative: typeof import('react-native');

	var HermesInternal: any;
	var nativeLoggingHook: (message: string, level: number) => void;
	var nativeModuleProxy: any;

	var ENMITY_PLUGINS: InternalPlugin[];

	// var themes: {
	// 	theme: string;
	// 	list: ThemeType[];
	// };
	// var tweak: {
	// 	version: string | undefined;
	// 	type: "Regular" | "k2genmity" | string | undefined;
	// };
}

export { };