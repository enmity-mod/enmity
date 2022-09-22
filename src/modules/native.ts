const BASE_URL = "http://localhost:6900";

export enum Endpoints {
  CHECK_PLUGIN = "plugins/check",
  INSTALL_PLUGIN = "plugins/install",
  UNINSTALL_PLUGIN = "plugins/uninstall",
  ENABLE_PLUGIN = "plugins/enable",
  DISABLE_PLUGIN = "plugins/disable",

  CHECK_THEME = "themes/check",
  INSTALL_THEME = "themes/install",
  UNINSTALL_THEME = "themes/uninstall",
  APPLY_THEME = "themes/apply",
  REMOVE_THEME = "themes/remove"
};

export async function sendCommand(endpoint: Endpoints, params: Record<string, string>): Promise<string> {
  try {
    const data = "?" + Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&");
    const response = await fetch(`${BASE_URL}/${endpoint}${Object.keys(params).length > 0 ? data : ""}`);
    const text = await response.text();

    return text;
  } catch(err) {
    return null;
  }
}
