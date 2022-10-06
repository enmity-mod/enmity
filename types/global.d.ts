declare type Fn = (...args: any) => any;

declare global {
  const nativeLoggingHook: (message: string, level: number) => void;
  var enmity: typeof import('@api').API;
  var HermesInternal: any;
  var plugins: any;
}

export { };