import { RestOptions, RestResponse } from 'enmity-api/rest';
import { getModule } from '../utils/modules';

const restModule = getModule(m => m.default?.getAPIBaseURL);

export async function getRequest(data: RestOptions | string): Promise<RestResponse> {
  return restModule.default.get(data);
}

export async function postRequest(data: RestOptions | string): Promise<RestResponse> {
  return restModule.default.post(data);
}

export async function putRequest(data: RestOptions | string): Promise<RestResponse> {
  return restModule.default.put(data);
}

export async function patchRequest(data: RestOptions | string): Promise<RestResponse> {
  return restModule.default.patch(data);
}

export async function deleteRequest(data: RestOptions | string): Promise<RestResponse> {
  return restModule.default.delete(data);
}

export async function getAPIBaseURL(): Promise<string> {
  return restModule.default.getAPIBaseURL();
}
