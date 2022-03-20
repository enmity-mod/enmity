import { getModule } from '../utils/modules';

const dialogModule = getModule(m => m.default?.show);

export function showDialog(options): void {
  dialogModule.default.show(options);
}
