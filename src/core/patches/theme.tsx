import { Theme } from '@metro/common';
import { getByProps } from '@metro';

const { overrideTheme } = getByProps("updateTheme", "overrideTheme");
const { setAMOLEDThemeEnabled } = getByProps("setAMOLEDThemeEnabled");
const { useAMOLEDTheme } = getByProps("useAMOLEDTheme");

export default () => {
    overrideTheme(Theme?.theme ?? "dark");
    setAMOLEDThemeEnabled && useAMOLEDTheme === 2 && setAMOLEDThemeEnabled(true);
};