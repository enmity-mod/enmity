import { PatchCallback } from 'enmity/patcher';
import { Module } from 'enmity/common';

const patches: Patch[] = [];

interface Patch {
  mdl: Module;
  func: string;
  original: Function;
  unpatch: () => void;
  patches: {
    before: Patcher[];
    after: Patcher[];
    instead: Patcher[];
  };
}

interface Patcher {
  caller: string;
  once: boolean;
  type: Type;
  id: number;
  callback: any;
  unpatch: () => void;
}

enum Type {
  Before = 'before',
  Instead = 'instead',
  After = 'after',
}

function getPatchesByCaller(id: string): Patcher[] {
  if (!id) return [];
  const _patches = [];

  for (const entry of patches) {
    const store = [
      ...entry.patches.before,
      ...entry.patches.instead,
      ...entry.patches.after
    ];

    for (const patch of store) {
      if (patch.caller === id) {
        _patches.push(patch);
      }
    }
  }

  return _patches;
}

function unpatchAll(caller: string): void {
  const patches = getPatchesByCaller(caller);
  if (!patches.length) return;

  for (const patch of patches) {
    patch.unpatch();
  }
}

function override(patch: Patch) {
  return function () {
    if (
      !patch?.patches?.before.length &&
      !patch?.patches?.after.length &&
      !patch?.patches?.instead.length &&
      !patches.find(p => p.mdl === patch.mdl && p.func === patch.func)
    ) {
      patch.unpatch();
      return new.target ? new patch.original(...arguments) : patch.original.apply(this, arguments);
    }

    let res;
    let args = arguments;

    const before = patch.patches.before;
    for (let i = 0; i < before.length; i++) {
      const instance = before[i];
      if (!instance) continue;

      try {
        const temp = instance.callback(this, args, patch.original.bind(this));
        if (Array.isArray(temp)) args = temp;
        if (instance.once) instance.unpatch();
      } catch (error) {
        console.error(`Could not fire before patch for ${patch.func} of ${instance.caller}`);
        console.error(error);
      }
    }

    const instead = patch.patches.instead;
    if (!instead.length) {
      if (new.target) {
        res = new patch.original(...args);
      } else {
        res = patch.original.apply(this, args);
      }
    } else {
      for (let i = 0; i < instead.length; i++) {
        const instance = instead[i];
        if (!instance) continue;

        try {
          const ret = instance.callback(this, args, patch.original.bind(this));
          if (typeof ret !== 'undefined') res = ret;
          if (instance.once) instance.unpatch();
        } catch (error) {
          console.error(`Could not fire instead patch for ${patch.func} of ${instance.caller}`);
          console.error(error);
        }
      }
    }

    const after = patch.patches.after;
    for (let i = 0; i < after.length; i++) {
      const instance = after[i];
      if (!instance) continue;

      try {
        if (instance.caller.includes('downloader')) console.log(instance);
        const ret = instance.callback(this, args, res, ret => (res = ret));
        if (typeof ret !== 'undefined') res = ret;
        if (instance.once) instance.unpatch();
      } catch (error) {
        console.error(`Could not fire after patch for ${patch.func} of ${instance.caller}`);
        console.error(error);
      }
    }

    return res;
  };
}

function push([, mdl, func, , type, once]): Patch {
  const patch = {
    mdl,
    func,
    id: patches?.[type]?.length ?? 0,
    original: mdl[func],
    once,
    unpatch: () => {
      patch.mdl[patch.func] = patch.original;
      patch.patches = {
        before: [],
        after: [],
        instead: []
      };
    },
    patches: {
      before: [],
      after: [],
      instead: []
    }
  };

  mdl[func] = override(patch);

  const descriptors = Object.getOwnPropertyDescriptors(patch.original);
  delete descriptors.length;

  Object.defineProperties(mdl[func], {
    ...descriptors,
    toString: {
      value: () => patch.original.toString(),
      configurable: true,
      enumerable: false
    },
    __original: {
      value: patch.original,
      configurable: true,
      enumerable: false
    }
  });

  patches.push(patch);
  return patch;
}

function get([, mdl, func]) {
  const patch = patches.find(p => p.mdl === mdl && p.func === func);
  if (patch) return patch;

  return push(...arguments);
}

function patch(caller: string, mdl: Module, func: string, callback: PatchCallback, type = Type.After, once = false): () => void {
  if (!caller || typeof caller !== 'string') {
    throw new TypeError('first argument "caller" must be of type string');
  } else if (!mdl || !['function', 'object'].includes(typeof mdl)) {
    throw new TypeError('second argument "mdl" must be of type function or object');
  } else if (!func || typeof func !== 'string') {
    throw new TypeError('third argument "func" must be of type string');
  } else if (!callback || typeof callback !== 'function') {
    throw new TypeError('fourth argument "callback" must be of type function');
  } else if (!type || typeof type !== 'string' || !['after', 'before', 'instead'].includes(type)) {
    throw new TypeError('fifth argument "type" must be of type string and any of the three: after, before, instead');
  } else if (typeof mdl[func] === 'undefined') {
    throw new ReferenceError(`function ${func} does not exist on the second argument (object or function)`);
  }

  const current = get(arguments);

  const patch = {
    caller,
    once,
    type,
    id: current.patches?.[type]?.length ?? 0,
    callback,
    unpatch: () => {
      // Remove the original patch this callback was from
      const individual = current.patches?.[type].findIndex(p => p.id === patch.id);
      if (~individual) current.patches?.[type].splice(individual, 1);

      if (
        current.patches?.before.length ||
        current.patches?.after.length ||
        current.patches?.instead.length
      ) return;

      // If no other patches on the module are remaining, completely remove all patches
      // and re-assign the original module to its original place.
      const module = patches.findIndex(p => p.mdl == mdl && p.func == func);

      if (!module) return;
      patches[module]?.unpatch();
      patches.splice(module, 1);
    }
  };

  current.patches[type] ??= [];
  current.patches[type].push(patch);

  return patch.unpatch;
}

function before(caller: string, mdl: Module, func: string, callback: PatchCallback, once: boolean = false): () => void {
  return patch(caller, mdl, func, callback, Type.Before, once);
}

function instead(caller: string, mdl: Module, func: string, callback: PatchCallback, once: boolean = false): () => void {
  return patch(caller, mdl, func, callback, Type.Instead, once);
}

function after(caller: string, mdl: Module, func: string, callback: PatchCallback, once: boolean = false): () => void {
  return patch(caller, mdl, func, callback, Type.After, once);
}

function create(name: string): Record<string, any> {
  return {
    getPatchesByCaller: getPatchesByCaller,
    before: (mdl: Module, func: string, callback: PatchCallback) => before(name, mdl, func, callback),
    instead: (mdl: Module, func: string, callback: PatchCallback) => instead(name, mdl, func, callback),
    after: (mdl: Module, func: string, callback: PatchCallback) => after(name, mdl, func, callback),
    unpatchAll: () => unpatchAll(name),
  };
}

export {
  create,
  before,
  instead,
  after,
  unpatchAll,
  patches
};

export default {
  create,
  before,
  instead,
  after,
  unpatchAll,
  patches
};
