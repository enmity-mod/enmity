/**
 * @description Gives you a function which caches its return value on the first run.
 * @param {function} func - The function to memoize
 * @return {function} Returns the function with a cacheable value
 */

export default function memoize(func) {
  let cache;

  return (...args) => cache ??= func.apply(null, args);
};