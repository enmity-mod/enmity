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
  Moment
} = common;
 
if (ColorMap?.["colors"]) {
  ColorMap["ThemeColorMap"] = StyleSheet["ThemeColorMap"] = Constants["ThemeColorMap"] = ColorMap["colors"];
}

if (ColorMap?.["unsafe_rawColors"]) {
  Constants["Colors"] = ColorMap["unsafe_rawColors"];
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
