/* eslint-disable */
import Common from '@data/modules';
import { Theme } from 'enmity/managers/themes';
import { create } from '@patcher';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any; };

const Patcher = create('metro')
type Common = { [key in keyof typeof import('@data/modules').default]: any };


export const common: Common = {};
export const blacklist: string[] = [];

export const filters = {
  byProps: (...mdls) => {
    if (mdls.length > 1) {
      return (mdl) => {
        for (let i = 0, len = mdls.length; i < len; i++) {
          if (mdl[mdls[i]] === void 0) {
            return false;
          };
        }

        return true;
      };
    }

    const prop = mdls[0];

    return (mdl) => mdl[prop] !== void 0;
  },

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
      return typeof mdl.default?.type === 'function' && mdl.default.type.name === name;
    } else {
      return typeof mdl.type === 'function' && mdl.type.name === name;
    }
  },

  byDisplayName: (name, defaultExport = true) => (mdl) => {
    if (!mdl) return false;

    if (!defaultExport) {
      return typeof mdl.default === 'function' && mdl.default.displayName === name;
    } else {
      return typeof mdl === 'function' && mdl.displayName === name;
    }
  }
};

for (const id in modules) {
  const mdl = modules[id].publicModule.exports;
  if (!mdl || mdl === window || mdl['ihateproxies'] === null) {
    blacklist.push(id);
    continue;
  }

  if (mdl["SemanticColor"] && mdl["RawColor"]) {
    try {
      const currentThemeName = window['themes']?.theme ?? '';
      const themes = window['themes']?.list ?? [];
      const currentTheme: Theme = themes?.find(t => t.name === currentThemeName);
      currentTheme["colours"] ??= currentTheme["colors"];

      if (currentTheme.colours) {
        Object.entries(currentTheme.colours).forEach(([key, value]) => {
          mdl["RawColor"][key] = value;
          mdl["default"]["unsafe_rawColors"][key] = value;
        })
      }

      const originalResolveSemanticColor = mdl["default"]["meta"]["resolveSemanticColor"];
      mdl["default"]["meta"]["resolveSemanticColor"] = (theme: string, ref: { [key: symbol]: string; }) => {
        const key = ref[Object.getOwnPropertySymbols(ref)[0]];

        if (currentTheme.theme_color_map?.[key]) {
          const index = { dark: 0, light: 1, amoled: 2 }[theme.toLowerCase()] || 0;
          const colorOrNone = currentTheme.theme_color_map[key][index];
          if (colorOrNone) return colorOrNone;
        }

        return originalResolveSemanticColor(theme, ref);
      };

      break;
    } catch(e) {
      const err = new Error(`[Enmity] ${e}`);
      console.error(err.stack);
    }
  }
}

// Export common modules
const getters = [];

Object.entries(Common).map(([name, module]) => {
  if (module.multiple) {
    Object.entries(module.props).map(([mdl, filter]) => {
      getters.push({
        id: mdl,
        filter: (mdl) => {
          const res = filters.byProps(...filter)(mdl);

          return res;
        },
        submodule: name
      });
    });
  } else if (module.props) {
    if ((module.props as string[]).every(props => Array.isArray(props))) {
      const found = [];

      getters.push({
        id: name,
        filter: (mdl) => {
          const res = (module.props as string[]).some(props => (props as any).every(p => mdl[p]));
          if (res && module.ensure && !module.ensure(mdl)) {
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
          const res = filters.byProps(...(module.props as string[]))(mdl);
          if (res && module.ensure && module.ensure(mdl) === false) {
            return false;
          }

          return res;
        },
        map: module.export
      });
    }
  } else if (module.displayName) {
    getters.push({
      id: name,
      filter: filters.byDisplayName(module.displayName, module.default),
      map: module.export
    });
  } else if (module.name) {
    getters.push({
      id: name,
      filter: filters.byName(module.name, module.default),
      map: module.export
    });
  } else if (module.filter) {
    getters.push({
      id: name,
      filter: module.filter,
      map: module.export
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

  for (const id in modules) {
    if (blacklist.includes(id)) {
      continue;
    }

    const previous = common.Moment?.locale();

    if (!modules[id].isInitialized) try {
      __r(id as any as number);
    } catch (e) {
      blacklist.push(id);
      continue;
    }

    const current = common.Moment?.locale();
    const wanted = common.Locale?.getLocale();
    if (common.Moment && common.Locale && current !== wanted) {
      common.Moment.locale(wanted);

      if (previous && current && previous !== current) {
        blacklist.push(id);
        continue;
      }
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