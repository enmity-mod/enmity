import { Theme } from 'enmity/managers/themes';

declare type Fn = (...args: any) => any;

declare global {
  const nativeLoggingHook: (message: string, level: number) => void;
  var enmity: typeof import('@api').API;
  var HermesInternal: any;
  var plugins: any;
  var themes: {
    applied: string | null,
    list: Record<string, Theme>;
  };
}

export { };