import { common, getByProps } from '@metro';

const {
    Clipboard,
    Assets,
    Messages,
    Clyde,
    Avatars,
    Native,
    Dispatcher,
    Storage,
    AsyncUsers,
    Toasts,
    Dialog,
    Token,
    REST,
    Settings,
    Users,
    Theme,
    Linking,
    StyleSheet,
    Components,
    Locale,
    Constants,
    Profiles,
    ColorMap,
    Logger,
    Lodash,
    Flux,
    SVG,
    Scenes,
    Navigation,
    NavigationNative,
    NavigationStack,
    Moment,
    ReactNative
} = common;

if (!StyleSheet.createThemedStyleSheet) {
    // Inspired by the Vendetta implementation
    // https://github.com/vendetta-mod/Vendetta/blob/rewrite/src/lib/metro/common.ts#L11-L25
    StyleSheet.createThemedStyleSheet = function (sheet: Record<string, any>) {
        for (const key in sheet) {
            sheet[key] = new Proxy(ReactNative.StyleSheet.flatten(sheet[key]), {
                get(target, prop, receiver) {
                    const res = Reflect.get(target, prop, receiver);

                    if ((ColorMap.meta ?? ColorMap.internal).isSemanticColor(res)) {
                        return (ColorMap.meta ?? ColorMap.internal).resolveSemanticColor(Theme.theme, res)
                    }

                    return res;
                }
            });
        }

        return sheet;
    }
}

if (ColorMap?.["colors"]) {
    ColorMap["ThemeColorMap"] = StyleSheet["ThemeColorMap"] = Constants["ThemeColorMap"] = ColorMap["colors"];
}

if (ColorMap?.["unsafe_rawColors"]) {
    Constants["Colors"] = ColorMap["unsafe_rawColors"];
}

if (ColorMap?.["internal"]) {
    ColorMap["meta"] = ColorMap["internal"];
}

export const React = common.React as typeof import('react');

export {
    Clipboard,
    Assets,
    Messages,
    Clyde,
    Avatars,
    Native,
    Dispatcher,
    Storage,
    AsyncUsers,
    Toasts,
    Dialog,
    Token,
    REST,
    Settings,
    Users,
    Theme,
    Linking,
    StyleSheet,
    ColorMap,
    Components,
    Locale,
    Constants,
    Profiles,
    Logger,
    Lodash,
    Flux,
    SVG,
    Scenes,
    Navigation,
    NavigationNative,
    NavigationStack,
    Moment
};
