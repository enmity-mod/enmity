const modules: {
  [key: string]: {
    props?: string[] | object,
    export?: string | string[],
    displayName?: string,
    multiple?: boolean,
    filter?: Function,
    ensure?: Function;
  };
} = {
  clipboard: {
    props: ['setString', 'getString']
  },

  assets: {
    props: ['registerAsset']
  },

  messages: {
    props: ['receiveMessage', 'sendMessage']
  },

  clyde: {
    props: ['createBotMessage']
  },

  avatars: {
    props: ['BOT_AVATARS']
  },

  native: {
    props: ['NativeModules'],
    export: 'NativeModules'
  },

  React: {
    props: ['createElement']
  },

  Dispatcher: {
    props: ['dirtyDispatch']
  },

  storage: {
    props: ['getItem']
  },

  toasts: {
    props: ['open', 'close'],
    ensure: (m) => !m.openLazy && !m.startDrag && !m.init && !m.openReplay
  },

  dialog: {
    props: ['show', 'openLazy', 'open', 'close']
  },

  token: {
    props: ['getToken']
  },

  rest: {
    props: ['getAPIBaseURL']
  },

  settings: {
    props: ['watchKeys']
  },

  users: {
    props: ['fetchProfile']
  },

  theme: {
    props: ['theme']
  },

  linking: {
    props: ['openURL']
  },

  navigation: {
    props: ['pushLazy']
  },

  navigationNative: {
    props: ['NavigationContainer']
  },

  navigationStack: {
    props: ['createStackNavigator']
  },

  stylesheet: {
    props: ['createThemedStyleSheet']
  },

  colorMap: {
    props: ['ThemeColorMap']
  },

  Components: {
    multiple: true,
    props: {
      Forms: ['Form', 'FormSection'],
      General: ['Button', 'Text', 'View',]
    }
  },

  Locales: {
    props: ['Messages']
  }
};

export default modules;