/**
 * @description Creates a Flux store with the data provided
 * @param {object} data - The data to pass to the store (must be an object)
 * @return {object} Returns an object containing the ID, the initialized Flux store
 * & its data and functions that go along with it.
 */

import { Flux, Dispatcher } from '@metro/common';
import uuid from '@utilities/uuid';

export default function createStore(data) {
  const storage = { ...(data ?? {}) };
  const id = uuid().toUpperCase();

  const handlers = {
    get: (key, defaults) => storage[key] ?? defaults,
    set: (key, value) => Dispatcher.dirtyDispatch({
      type: `ENMITY_FLUX_${id}_SET`,
      key,
      value
    }),
    delete: (key) => handlers.set(key, void 0)
  };

  const store = new Flux.Store(Dispatcher, {
    [`ENMITY_FLUX_${id}_SET`]: ({ key, value }) => {
      if (value === void 0) {
        delete storage[key];
      } else {
        storage[key] = value;
      }
    }
  });

  return {
    ...handlers,
    store,
    storage,
    id,
  };
};