import findInTree from '@utilities/findInTree';

/**
 * @description Traverses through a react tree
 * @param {(object|array)} tree - The tree to search through
 * @param {function} filter - The filter to run on the tree passed as the first argument
 * @param {object} options - Options to pass to findInTree
 * @return {any} Returns null if nothing is filtered or the value that is filtered.
 */

export default function findInReactTree(tree: object, filter: Function = _ => _, options = {}) {
  return findInTree(tree, filter, { walkable: ['props', 'children'], ...options });
};

const filterInReactTree = ({ tree, condition }: { tree: { [key: string]: any }, condition: (node: any) => boolean }) => {
  const foundItems: any[] = [];

  findInReactTree(tree, (node) => {
     if (condition(node)) foundItems.push(node);
  })

  return foundItems
}