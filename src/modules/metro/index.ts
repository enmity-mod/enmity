/* eslint-disable */
import Common from '@data/modules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any; };

type Common = { [key in keyof typeof import('@data/modules').default]: any };

export const common: Common = {};
export const blacklist: string[] = [];

export const filters = {
  byProps: (...mdls) => (mdl) => mdls.every(k => mdl[k] !== void 0),

  byName: (name, defaultExport = true) => (mdl) => {
    if (!mdl) return false;

    if (!defaultExport) {
      return typeof mdl.default === 'function' && mdl.default.name === name;
    } else {
      return typeof mdl === 'function' && mdl.name === name;
    }
  },

  byTypeName: (name, defaultExport = true) => (mdl) => {
    if (!mdl) return false;

    if (!defaultExport) {
      return typeof mdl.default === 'function' && mdl.default.type?.name === name;
    } else {
      return typeof mdl === 'function' && mdl.name === name;
    }
  },

  byDisplayName: (name, defaultExport = true) => (mdl) => {
    if (!mdl) return false;

    if (!defaultExport) {
      return typeof mdl.default === 'function' && mdl.default.name === name;
    } else {
      return typeof mdl === 'function' && mdl.name === name;
    }
  }
};


// Export common modules
const getters = [];

Object.entries(Common).map(([name, m]) => {
  if (m.multiple) {
    Object.entries(m.props).map(([mdl, filter]) => {
      getters.push({
        id: mdl,
        filter: (mdl) => {
          const res = filters.byProps(...filter)(mdl);

          return res;
        },
        submodule: name
      });
    });
  } else if (m.props) {
    if ((m.props as string[]).every(props => Array.isArray(props))) {
      const found = [];

      getters.push({
        id: name,
        filter: (mdl) => {
          const res = (m.props as string[]).some(props => (props as any).every(p => mdl[p]));
          if (res && m.ensure && !m.ensure(mdl)) {
            return false;
          } else if (res) {
            found.push(mdl);
          }

          return res;
        },
        map: Object.assign({}, ...found)
      });
    } else {
      getters.push({
        id: name,
        filter: (mdl) => {
          const res = filters.byProps(...(m.props as string[]))(mdl);
          if (res && m.ensure && m.ensure(mdl) === false) {
            return false;
          }

          return res;
        },
        map: m.export
      });
    }
  } else if (m.displayName) {
    getters.push({
      id: name,
      filter: filters.byDisplayName(m.displayName, m.default),
      map: m.export
    });
  } else if (m.name) {
    getters.push({
      id: name,
      filter: filters.byName(m.name, m.default),
      map: m.export
    });
  } else if (m.filter) {
    getters.push({
      id: name,
      filter: m.filter,
      map: m.export
    });
  }
});

const results = bulk(...getters.map(({ filter }) => filter));
getters.map(({ id, map, submodule }, index) => {
  let mapper = (_ => _);

  if (typeof map === 'string') {
    mapper = mdl => mdl[map];
  } else if (Array.isArray(map)) {
    let res = {};
    mapper = mdl => {
      for (const key of map) {
        res[key] = mdl[key];
      }

      return res;
    };
  }

  if (!results[index]) return;
  const res = mapper(results[index]);
  if (submodule) {
    common[submodule] ??= {};
    common[submodule][id] = res;
  } else {
    common[id] = res;
  }
});

export function getModule(filter, { all = false, traverse = false, defaultExport = true } = {}) {
  if (typeof filter !== 'function') return null;

  const found = [];

  const search = function (m: any, index) {
    try {
      return filter(m, index);
    } catch {
      return false;
    }
  };

  const locale = common.Locale && common.Locale.getLocale();
  for (const id in modules) {
    if (blacklist.includes(id)) {
      continue;
    }

    if (!modules[id].isInitialized) try {
      __r(id as any as number);
    } catch (e) {
      blacklist.push(id);
      continue;
    }

    if (common.Moment && locale) {
      common.Moment.locale(locale);
    }

    const mdl = modules[id].publicModule.exports;
    if (!mdl || mdl === window || mdl['ihateproxies'] === null) {
      blacklist.push(id);
      continue;
    }


    if (typeof mdl === 'object') {
      if (search(mdl, id)) {
        if (!all) return mdl;
        found.push(mdl);
      }

      if (mdl.default && search(mdl.default, id)) {
        const value = defaultExport ? mdl.default : mdl;
        if (!all) return value;
        found.push(value);
      }

      if (traverse && mdl.__esModule) {
        for (const key in mdl) {
          if (mdl[key] === void 0) continue;

          if (search(mdl[key], id)) {
            if (!all) return mdl[key];
            found.push(mdl[key]);
          }
        }
      }
    } else if (typeof mdl === 'function') {
      if (!search(mdl, id)) continue;
      if (!all) return mdl;
      found.push(mdl);
    }
  }

  return all ? found : found[0];
}

export function getModules(filter) {
  return getModule(filter, { all: true });
};

export function bulk(...filters) {
  const found = new Array(filters.length);
  const wrapped = filters.map(filter => (m) => {
    try {
      return filter(m);
    } catch {
      return false;
    }
  });

  getModule(mdl => {
    for (let i = 0; i < wrapped.length; i++) {
      const filter = wrapped[i];
      if (typeof filter !== 'function' || !filter(mdl) || found[i] != null) continue;

      found[i] = mdl;
    }

    return found.filter(String).length === filters.length;
  });

  return found;
}

export function getByProps(...options) {
  const [props, { bulk: useBulk = false, ...rest }] = parseOptions(options);

  if (useBulk) {
    const handlers = props.map(p => Array.isArray(p)
      ? filters.byProps(...p)
      : filters.byProps(p)
    ).concat({ ...rest });

    return bulk(...handlers);
  }

  return getModule(filters.byProps(...props), rest);
}

export function getByDisplayName(...options) {
  const [names, { bulk: useBulk = false, default: defaultExport = true, ...rest }] = parseOptions(options);

  if (useBulk) {
    const bulked = names.map(filters.byDisplayName).concat({ defaultExport, ...rest });

    return bulk(...bulked);
  }

  return getModule(filters.byDisplayName(names[0]), { defaultExport, ...rest });
}

export function getByTypeName(...options) {
  const [names, { bulk: useBulk = false, default: defaultExport = true, ...rest }] = parseOptions(options);

  if (useBulk) {
    const bulked = names.map(filters.byTypeName).concat({ defaultExport, ...rest });

    return bulk(...bulked);
  }

  return getModule(filters.byTypeName(names[0]), { defaultExport, ...rest });
}

export function getByName(...options) {
  const [names, { bulk: useBulk = false, default: defaultExport = true, ...rest }] = parseOptions(options);

  if (useBulk) {
    const bulked = names.map(filters.byName).concat({ defaultExport, ...rest });

    return bulk(...bulked);
  }

  return getModule(filters.byName(names[0]), { defaultExport, ...rest });
}

export function getByKeyword(...options) {
  const [[keyword], { caseSensitive = false, all = false, ...rest }] = parseOptions(options);

  return getModule(mdl => {
    const mdls = [...Object.keys(mdl), ...Object.keys(mdl.__proto__)];

    for (let i = 0; i < mdls.length; i++) {
      const instance = mdls[i];

      if (caseSensitive) {
        if (~instance.indexOf(keyword)) {
          return true;
        }
      } else {
        const key = keyword.toLowerCase();

        if (~instance.toLowerCase().indexOf(key)) {
          return true;
        }
      }
    }

    return false;
  }, { all, ...rest });
};

function parseOptions(args, filter = o => typeof o === 'object' && !Array.isArray(o)) {
  return [args, filter(args[args.length - 1]) ? args.pop() : {}];
}