import * as Modules from '../utils/modules';

const Dialog = Modules.common.dialog;

export function showDialog(options): void {
  Dialog.show(options);
}
