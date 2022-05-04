/**
 * @description Searches through the walkables provided inside a tree.
 * @param {object|array} tree - The tree to search
 * @param {function} filter - The filter to use to resolve the search
 * @param {object} options - The options for the search
 * @param {array} [options.ignore=[]] - The keys to ignore in the search
 * @param {array} [options.walkable=[]] - The keys to walk/traverse in the search
 * @param {number} [options.maxProperties=100] - The keys to walk/traverse in the search
 * @return {function} Returns the function with a cacheable value
 */

export default function findInTree(tree: object | any[] = {}, filter: Function = _ => _, { ignore = [], walkable = [], maxProperties = 100 } = {}): any {
  let stack = [tree];
  const wrapFilter = function (...args) {
    try {
      return Reflect.apply(filter, this, args);
    } catch {
      return false;
    }
  };

  while (stack.length && maxProperties) {
    const node = stack.shift();
    if (wrapFilter(node)) return node;

    if (Array.isArray(node)) {
      stack.push(...node);
    } else if (typeof node === 'object' && node !== null) {
      if (walkable.length) {
        for (const key in node) {
          const value = node[key];
          if (~walkable.indexOf(key) && !~ignore.indexOf(key)) {
            stack.push(value);
          }
        }
      } else {
        for (const key in node) {
          const value = node[key];
          if (node && ~ignore.indexOf(key)) continue;

          stack.push(value);
        }
      }
    }
    maxProperties--;
  }
};