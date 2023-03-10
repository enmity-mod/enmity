import { common } from '@metro';

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
} = common;

Constants["ThemeColorMap"] = ColorMap?.["colors"];
Constants["Colors"] = ColorMap?.["unsafe_rawColors"];
ColorMap["ThemeColorMap"] = ColorMap?.["colors"];
StyleSheet["ThemeColorMap"] = ColorMap?.["colors"];

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
