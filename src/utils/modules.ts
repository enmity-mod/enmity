import { Module, ModuleExports } from 'enmity-api/module';

declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any; };

/**
 * Blacklisted modules
 */
export function modulesBlacklist(i: number): boolean {
  // Native modules that causes Discord to hang if loaded
  if (i === 203 || i === 433 || i === 434 || i === 445 || i === 446 || i === 457) return true;

  // Skipping locale modules
  if (i >= 944 && i <= 994) return true;

  return false;
}

/**
 * Get all modules via filter
 */
export function getModules(filter: (module: ModuleExports) => boolean, first = false): number[] {
  const find = (id): boolean => {
    if (modulesBlacklist(Number(id))) return;

    const module = modules[id];
    if (!module.isInitialized) __r(Number(id));

    if (module.publicModule.exports === undefined) return;
    return filter(module.publicModule.exports);
  };

  const ids = first ? [Object.keys(modules).find(find)] : Object.keys(modules).filter(find);
  return ids.filter(id => id !== undefined).map(id => Number(id));
}

/**
 * Get module via filter
 */
export function getModule(filter: (module: ModuleExports) => boolean, exports?: true): ModuleExports;
export function getModule(filter: (module: ModuleExports) => boolean, exports?: false): Module;
export function getModule(filter: (module: ModuleExports) => boolean, exports = true): Module | ModuleExports {
  const ids = getModules(filter, true);
  if (ids.length === 0) return;

  const { publicModule } = modules[ids[0]];
  return exports ? publicModule.exports : publicModule;
}

/**
 * Get module via props
 */
export function getModuleByProps(...props: string[]): ModuleExports {
  return getModule(m => props.every(p => (m[p] ?? m.default?.[p]) !== void 0), true);
}

/**
 * Get module via index
 */
export function getModuleByIndex(id: string): Module {
  const module = modules[id];
  if (module === undefined) return;
  if (!module.isInitialized) __r(Number(id));

  return module.publicModule;
}
