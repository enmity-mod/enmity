import { getModule } from '../utils/modules';

const toastModule = getModule(
  m => m.default?.open
  && m.default?.close
  && !m.default?.openLazy
  && !m.default?.startDrag
  && !m.default?.init,
);

export function showToast(message): void {
  toastModule.default.open(message);
}
