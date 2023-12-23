/**
 * Simple catch-all function that satisfies the constraints of the "Parameters" type.
 */
declare type Fn = (...args: any[]) => any;
declare type OptionalKeys<T> = { [P in keyof T]?: undefined extends T[P] ? P : never }[keyof T];