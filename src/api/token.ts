import * as Modules from '../utils/modules';

const Token = Modules.common.token;

export function getToken(): string {
  return Token.getToken();
}

export function setToken(token: string): string {
  return Token.setToken(token);
}

export function hideToken(): void {
  Token.hideToken();
}

export function showToken(): void {
  Token.showToken();
}

export function removeToken(): void {
  Token.removeToken();
}
