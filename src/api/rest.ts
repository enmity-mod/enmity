import { getModule } from "../utils/modules";

const restModule = getModule(m => m.default?.getAPIBaseURL);

async function get(data) {
  return restModule.default.get(data);
}

async function post(data) {
  return restModule.default.post(data);
}

async function put(data) {
  return restModule.default.put(data);
}

async function patch(data) {
  return restModule.default.patch(data);
}

async function _delete(data) {
  return restModule.default.delete(data);
}

async function getAPIBaseURL() {
  return restModule.default.getAPIBaseURL();
}

export {
  get,
  post,
  put,
  patch,
  _delete,
  getAPIBaseURL
}