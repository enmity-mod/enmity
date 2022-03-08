declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any };

/**
 * Blacklisted modules
 */
function modulesBlacklist(i) {
  // Native modules that causes Discord to hang if loaded
  if (i == 199 || i == 432 || i == 433 || i == 444 || i == 445 || i == 456) return true;

  // Skipping locale modules
  if (i >= 944 && i <= 972) return true;

  return false;
}

/**
 * Get module via filter
 */
function getModule(filter: (module: any) => boolean, exports = true): any {
  const ids = getModules(filter, true);
  if (ids.length === 0) return;

  const { publicModule } = modules[ids[0]];
  return exports ? publicModule.exports : publicModule;
}

/**
 * Get all modules via filter
 */
function getModules(filter: (module: any) => boolean, first = false): number[] {
  const find = (id) => {
    if (modulesBlacklist(id)) return;

    const module = modules[id];
    if (!module.isInitialized) __r(Number(id));

    if (module.publicModule.exports === undefined) return;
    return filter(module.publicModule.exports);
  };

  const ids = first ? [Object.keys(modules).find(find)] : Object.keys(modules).filter(find);
  return ids.filter(id => id !== undefined).map(id => Number(id));
}

/**
 * Get module via props
 */
function getModuleByProps(...props: string[]) {
  return getModule(m => props.every(p => m[p]), true);
}

/**
 * Get module via index
 */
function getModuleByIndex(id: string) {
  const module = modules[id];
  if (module === undefined) return;
  if (!module.isInitialized) __r(Number(id));

  return module.publicModule;
}

export {
  getModule,
  getModules,
  getModuleByProps,
  getModuleByIndex
};