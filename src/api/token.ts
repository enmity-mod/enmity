import { getModule } from "../utils/modules";

const tokenModule = getModule(m => m.default?.setToken);

function getToken(): string {
  return tokenModule.default.getToken();
}

function setToken(token: string): string {
  return tokenModule.default.setToken(token);
}

function hideToken(): void {
  tokenModule.default.hideToken();
}

function showToken(): void {
  tokenModule.default.showToken();
}

function removeToken(): void {
  tokenModule.default.removeToken();
}

export {
  getToken,
  setToken,
  hideToken,
  showToken,
  removeToken
};