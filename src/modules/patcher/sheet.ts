import { getByProps, getModule } from '@metro';
import oPatcher from '.';

const Patcher = oPatcher.create('enmity-sheet-patcher');

const patches = {};

const Opener = getByProps('openLazy');
Patcher.before(Opener, 'openLazy', (_, [component, sheet]) => {
  if (!patches[sheet]) return;

  component.then(instance => {
    const unpatch = Patcher.after(instance, 'default', (_, __, res) => {
      const payload = [...patches[sheet]];
      
      for (let i = 0; i < payload.length; i++) {
        const patch = payload[i];
        if (patch.applied) continue;
          
        const cb = patch.callback;
        patcher[patch.type](patch.caller, res.type, 'render', (ctx, args, res) => {
            return cb.apply(ctx, [ctx, args, res]);
        });

        patch.applied = true;
      }

      unpatch();
      return res;
    });

    return instance;
  });
});

export function before(caller: string, sheet: string, callback: (self?: any, args?: any[], res?: any) => any): void {
  validateArguments(caller, sheet, callback);
  push('before', caller, sheet, callback);
}

export function after(caller: string, sheet: string, callback: (self?: any, args?: any[], res?: any) => any): void {
  validateArguments(caller, sheet, callback);
  push('after', caller, sheet, callback);
}

export function instead(caller: string, sheet: string, callback: (self?: any, args?: any[], res?: any) => any): void {
  validateArguments(caller, sheet, callback);
  push('instead', caller, sheet, callback);
}

export function unpatchAll(caller: string): void {
  for (const patch in patches) {
    const sheet = patches[patch];
    patches[sheet] = sheet.filter(e => e.caller !== caller);
  }

  return Patcher.unpatchAll(caller);
}

export function create(caller: string) {
  return {
    before: (sheet: string, callback: (_?: any, args?: any[], res?: any) => any) => before(caller, sheet, callback),
    after: (sheet: string, callback: (_?: any, args?: any[], res?: any) => any) => after(caller, sheet, callback),
    instead: (sheet: string, callback: (_?: any, args?: any[], res?: any) => any) => instead(caller, sheet, callback),
    unpatchAll: () => unpatchAll(caller),
  };
}

function push(type: string, caller: string, sheet: string, callback: (self?: any, args?: any[], res?: any) => any): void {
  patches[sheet] ??= [] as object[];
  patches[sheet].push({
    type,
    caller,
    sheet,
    callback,
    applied: false,
  });
}

function validateArguments(caller: string, sheet: string, callback: (self?: any, args?: any[], res?: any) => any) {
  if (!caller || typeof caller !== 'string') {
    throw new TypeError('first argument caller does not exist or is not of type string');
  } else if (!sheet || typeof sheet !== 'string') {
    throw new TypeError('second argument menu does not exist or is not of type string');
  } else if (!callback || typeof callback !== 'function') {
    throw new TypeError('third argument callback does not exist or is not of type function');
  }
}

export default {
  patches,
  unpatchAll,
  instead,
  create,
  before,
  after
};
