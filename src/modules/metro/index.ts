/* eslint-disable */
import Common from '@data/modules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any; };

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

// This is a self invoked function so that `return` can be used
(() => {
    try {
        // This module cannot be found through early-looping modules anymore, but through trial and error apparently this module appears here when found with the filters at this point, which is the same point as where it was done with the loop.
        // This works fine on 41968 and higher. Loading this module and later than this will make it not fully theme everything, depending on how much later you do it.
        const mdl = getByProps("SemanticColor", "RawColor");

        if (!mdl) return;

        const currentThemeName = window['themes']?.theme ?? '';
        const themes = window['themes']?.list ?? [];
        const currentTheme = themes?.find(t => t.name === currentThemeName);

        if (!currentTheme) return;

        currentTheme.colours ??= currentTheme["colors"];

        // patch old themes into new format
        if (currentTheme.spec === 1 || !currentTheme.spec) {
            if (currentTheme.theme_color_map) {
                currentTheme.semanticColors = currentTheme.theme_color_map
            };

            if (currentTheme.colours) {
                const replacers = {
                    "PRIMARY_DARK": "PRIMARY",
                    "PRIMARY_LIGHT": "PRIMARY",
                    "BRAND_NEW": "BRAND",
                    "STATUS_": "",
                }

                currentTheme.rawColors = currentTheme.colours
                Object.entries(currentTheme.colours).forEach(([key, value]) => {
                    Object.entries(replacers).forEach(([k, v]) => {
                        if (key.startsWith(k)) currentTheme.rawColors[key.replace(k, v)] = value;
                    })
                })
            };
        }

        if (currentTheme.rawColors) {
            if (!currentTheme.rawColors?.PRIMARY_660) currentTheme.rawColors.PRIMARY_660 = currentTheme?.semanticColors?.BACKGROUND_PRIMARY[0]
            Object.entries(currentTheme.rawColors).forEach(([key, value]: [string, string]) => {
                mdl["RawColor"][key] = value.replace('transparent', "rgba(0,0,0,0)");
                mdl["default"]["unsafe_rawColors"][key] = value.replace('transparent', "rgba(0,0,0,0)");
            })
        }

        if (currentTheme.semanticColors) {
            const assignees = {
                "BACKGROUND_FLOATING": [
                    "BG_BACKDROP",
                    "BG_SURFACE_OVERLAY",
                    "BG_SURFACE_OVERLAY_TMP"
                ],
                "BACKGROUND_PRIMARY": [
                    "BG_BASE_PRIMARY",
                    "CHAT_BACKGROUND"
                ],
                "BACKGROUND_SECONDARY": [
                    "BG_BASE_SECONDARY"
                ],
                "BACKGROUND_SECONDARY_ALT": [
                    "BG_BASE_TERTIARY"
                ],
                "BACKGROUND_MODIFIER_ACCENT": [
                    "BG_MOD_FAINT",
                    "BG_MOD_STRONG",
                    "BG_MOD_SUBTLE"
                ],
                "BACKGROUND_MOBILE_PRIMARY": [
                    "BG_SURFACE_RAISED"
                ]
            }

            Object.entries(currentTheme.semanticColors).forEach(([key, value]) => {
                Object.entries(assignees).forEach(([assignKey, assignValue]) => {
                    if (key === assignKey) {
                        assignValue.forEach(k => currentTheme.semanticColors[k] ??= value)
                    }
                })
            })

            const originalResolveSemanticColor = mdl["default"]["meta"]["resolveSemanticColor"];
            mdl["default"]["meta"]["resolveSemanticColor"] = (theme: string, ref: { [key: symbol]: string; }) => {
                const key = ref[Object.getOwnPropertySymbols(ref)[0]];

                if (currentTheme.semanticColors[key]) {
                    const index = { dark: 0, light: 1, amoled: 2 }[theme.toLowerCase()] || 0;
                    const colorOrNone = currentTheme.semanticColors[key][index];
                    if (colorOrNone) return colorOrNone;
                }

                return originalResolveSemanticColor(theme, ref);
            };
        }
    } catch (e) {
        const err = new Error(`[Enmity] ${e}`);
        console.error(err.stack);
    }
})()

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
                    const res = (module.props as string[]).some(props => (props as any).every(p => mdl?.[p]));
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

        if (!mdl.__patched__ && mdl.default?.name === 'requireNativeComponent') {
            const orig = mdl.default;

            const temp = {
                requireNativeComponent(...args) {
                    try {
                        return orig(...args);
                    } catch {
                        return args[0];
                    }
                }
            };

            Object.assign(temp.requireNativeComponent, orig);
            Object.assign(mdl, {
                default: temp.requireNativeComponent,
                __patched__: true
            });
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