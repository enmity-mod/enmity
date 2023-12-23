import { Theme, Dispatcher } from '@metro/common';
import { getByProps } from '@metro';

export default () => {
    const [
        { overrideTheme },
        { setAMOLEDThemeEnabled },
        { useAMOLEDTheme }
    ] = getByProps(
        ["updateTheme", "overrideTheme"],
        ["setAMOLEDThemeEnabled"],
        ["useAMOLEDTheme"],
        { bulk: true }
    );

    const event = function() {
        overrideTheme(Theme?.theme ?? "dark");
        setAMOLEDThemeEnabled && useAMOLEDTheme === 2 && setAMOLEDThemeEnabled(true);
        Dispatcher.unsubscribe("I18N_LOAD_SUCCESS", event);
    };

    Dispatcher.subscribe("I18N_LOAD_SUCCESS", event);
};