import * as Modules from '../utils/modules';

const Toasts = Modules.common.toasts;

export function showToast(message): void {
  Toasts.open(message);
}
