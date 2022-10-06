declare type Fn = (...args: any) => any;

declare global {
  var enmity: typeof import('@api').API;
  var HermesInternal: any;
  var plugins: any;
}

export { };