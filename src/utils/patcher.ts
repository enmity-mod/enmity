const patches: Patch[] = [];

type mdl = Function | object;

interface Patch {
  caller: string;
  mdl: mdl;
  func: string;
  original: Function;
  unpatch: Function;
  patches: Patcher[];
};

interface Patcher {
  caller: string;
  type: Type;
  id: number;
  callback: Function;
  unpatch: Function;
};

enum Type {
  before = "before",
  instead = "instead",
  after = "after",
};

function getPatchesByCaller(id: string) {
  const _patches = [];

  for (const patch of patches) {
    for (const child of patch.patches) {
      if (child.caller === id) _patches.push(child);
    }
  }

  return _patches;
}

function unpatchAll(caller: string) {
  const patches = getPatchesByCaller(caller);
  if (!patches.length) return;

  for (const patch of patches) patch.unpatch();
}

function override(patch: Patch) {
  return function() {
    if (!patch.patches.length) return patch.original.apply(this, arguments);

    let res;
    let args: any = arguments;

    for (const before of patch.patches.filter(p => p.type === Type.before)) {
      try {
        const tempArgs = before.callback(this, args, patch.original.bind(this));
        if (Array.isArray(tempArgs)) args = tempArgs;
      } catch(error) {
        console.error(`Could not fire before patch for ${patch.func} of ${before.caller}`);
        console.error(error);
      }
    }

    const insteads = patch.patches.filter(p => p.type === Type.instead);
    if (!insteads.length) res = patch.original.apply(this, args);

    else for (const instead of insteads) {
      try {
        const ret = instead.callback(this, args, patch.original.bind(this));
        if (ret !== undefined) res = ret;
      } catch(error) {
        console.error(`Could not fire instead patch for ${patch.func} of ${instead.caller}`);
        console.error(error);
      }
    }

    for (const after of patch.patches.filter(p => p.type === Type.after)) {
      try {
        const ret = after.callback(this, args, res, ret => (res = ret));
        if (ret !== undefined) res = ret;
      } catch(error) {
        console.error(`Could not fire after patch for ${patch.func} of ${after.caller}`);
        console.error(error);
      }
    }

    return res;
  }
}

function push([caller, mdl, func]): Patch {
  const patch: Patch = {
    caller,
    mdl,
    func,
    original: mdl[func],
    unpatch: () => {
      patch.mdl[patch.func] = patch.original;
      patch.patches = [];
    },
    patches: []
  };

  mdl[func] = override(patch);
  Object.assign(mdl[func], patch.original, {
    toString: () => patch.original.toString(),
    '__original': patch.original
  });

  patches.push(patch);
  return patch;
}

function get(caller, mdl, func): Patch {
  const patch = patches.find(p => p.mdl == mdl && p.func == func);
  if (patch) return patch;

  return push([caller, mdl, func]);
}

function patch(caller: string, mdl: mdl, func: string, callback: Function, type = Type.after) {
  const _patches = get(caller, mdl, func);

  const patch: Patcher = {
    caller,
    type,
    id: _patches.patches.length,
    callback,
    unpatch: () => {
      _patches.patches.splice(_patches.patches.findIndex(p => p.id === patch.id && p.type === type), 1);

      if (_patches.patches.length <= 0) {
        const index = patches.findIndex(p => p.mdl === mdl && p.func === func);
        patches[index].unpatch();
        patches.splice(index, 1);
      }
    }
  }

  _patches.patches.push(patch);
  return patch.unpatch;
}

function create(name: string) {
  return {
    getPatchesByCaller: getPatchesByCaller,
    before: (...args) => before(name, ...args),
    instead: (...args) => instead(name, ...args),
    after: (...args) => after(name, ...args),
    unpatchAll: () => unpatchAll(name)
  };
}

function before(caller: string, mdl: mdl, func: string, callback: Function) {
  return patch(caller, mdl, func, callback, Type.before);
}

function instead(caller: string, mdl: mdl, func: string, callback: Function) {
  return patch(caller, mdl, func, callback, Type.instead);
}

function after(caller: string, mdl: mdl, func: string, callback: Function) {
  return patch(caller, mdl, func, callback, Type.after);
}

export {
  create,
  before,
  instead,
  after,
  unpatchAll
};