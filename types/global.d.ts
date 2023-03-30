declare global {
  var nativeLoggingHook: (message: string, level: number) => void;
  var enmity: typeof import('@api').API;
  var HermesInternal: any;
  var plugins: any;
  var themes: {
    theme: string;
    list: any[];
  }
  var tweak: {
    version: string | undefined
  }
}

export {};