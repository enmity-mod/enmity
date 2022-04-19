import * as Modules from '../utils/modules';
import { RestOptions, RestResponse } from 'enmity-api/rest';

const REST = Modules.common.rest;

export async function getRequest(data: RestOptions | string): Promise<RestResponse> {
  return REST.get(data);
}

export async function postRequest(data: RestOptions | string): Promise<RestResponse> {
  return REST.post(data);
}

export async function putRequest(data: RestOptions | string): Promise<RestResponse> {
  return REST.put(data);
}

export async function patchRequest(data: RestOptions | string): Promise<RestResponse> {
  return REST.patch(data);
}

export async function deleteRequest(data: RestOptions | string): Promise<RestResponse> {
  return REST.delete(data);
}

export async function getAPIBaseURL(): Promise<string> {
  return REST.getAPIBaseURL();
}
