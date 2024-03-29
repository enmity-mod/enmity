const modules = {
    Constants: {
        props: ['Endpoints', 'Fonts']
    },

    Clipboard: {
        props: ['setString', 'getString', 'setImage', 'getImage'],
    },

    Assets: {
        props: ['registerAsset'],
    },

    Messages: {
        props: ['receiveMessage', 'sendMessage'],
    },

    Clyde: {
        props: ['createBotMessage'],
    },

    Avatars: {
        props: ['BOT_AVATARS'],
    },

    Native: {
        props: ['NativeModules'],
        export: 'NativeModules',
    },

    React: {
        props: ['createElement'],
    },

    Dispatcher: {
        props: ['_dispatch', 'dispatch'],
    },

    Storage: {
        props: ['getItem'],
    },

    Toasts: {
        props: ['open', 'close'],
        ensure: m => m.open && m.close && !m.startDrag && !m.init && !m.openReplay && !m.setAlwaysOnTop && !m.updateGuildNotificationSettings
    },

    Dialog: {
        props: ['show', 'openLazy', 'close'],
    },

    Token: {
        props: ['getToken'],
    },

    REST: {
        props: ['getAPIBaseURL'],
    },

    Settings: {
        props: ['watchKeys'],
    },

    Users: {
        props: ['getCurrentUser'],
    },

    AsyncUsers: {
        props: ['getUser', 'fetchProfile']
    },

    Navigation: {
        props: ['pushLazy'],
    },

    NavigationNative: {
        props: ['NavigationContainer'],
    },

    NavigationStack: {
        props: ['createStackNavigator'],
    },

    Theme: {
        props: ['theme'],
    },

    Linking: {
        props: ['openURL'],
    },

    StyleSheet: {
        props: [
            ['createStyles'],
            ['createThemedStyleSheet']
        ],
        ensure: m => !m.ActionSheet
    },

    ColorMap: {
        props: [
            ['colors'],
            ['ThemeColorMap']
        ],
        ensure: m => m?.meta || m?.internal
    },

    Components: {
        multiple: true,
        props: {
            Forms: ['Form', 'FormSection'],
            General: ['Button', 'Text', 'View'],
        },
    },

    Locale: {
        props: ['Messages'],
    },

    Profiles: {
        props: ['showUserProfile']
    },

    Lodash: {
        props: ['debounce', 'throttle']
    },

    Logger: {
        name: 'Logger'
    },

    Flux: {
        props: [
            ['Store', 'connectStores'],
            ['useStateFromStoresObject']
        ]
    },

    SVG: {
        props: ['Svg']
    },

    Scenes: {
        name: 'getScreens',
        default: false
    },

    Moment: {
        props: ['isMoment']
    },

    ReactNative: {
        props: ['View', 'Text']
    }
};

export default modules as {
    [key: string]: {
        props?: string[] | object;
        export?: string | string[];
        default?: boolean;
        displayName?: string;
        multiple?: boolean;
        filter?: Function;
        ensure?: Function;
        name?: string;
    };
};

export type Modules = keyof typeof modules;
