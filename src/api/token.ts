import { getModule } from '../utils/modules';

const tokenModule = getModule(m => m.default?.setToken);

export function getToken(): string {
  return tokenModule.default.getToken();
}

export function setToken(token: string): string {
  return tokenModule.default.setToken(token);
}

export function hideToken(): void {
  tokenModule.default.hideToken();
}

export function showToken(): void {
  tokenModule.default.showToken();
}

export function removeToken(): void {
  tokenModule.default.removeToken();
}
