import { getModule, getModules } from '../utils/modules';
import { create } from '../utils/patcher';
import { reloadDiscord } from '../api/native';

export function patchNavigator(): void {
  const Patcher = create('NaviagtorPatch');
  const Navigator = getModule(m => m.LeftButtonWithChevron);
}
