import { React } from "@metro/common";

const overrides = {
  useMemo: factory => factory(),
  useState: initialState => [initialState, () => void 0],
  useReducer: initialValue => [initialValue, () => void 0],
  useEffect: () => {},
  useLayoutEffect: () => {},
  useRef: () => ({ current: null }),
  useCallback: callback => callback,
  useImperativeHandle: () => {},
  useContext: (ctx) => ctx._currentValue
};

const keys = Object.keys(overrides);

export default (component) => {
  return (...args) => {
    const ReactDispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
    const originals = keys.map(e => [e, ReactDispatcher[e]]);

    Object.assign(ReactDispatcher, overrides);

    const res = {
      rendered: null,
      error: null
    };

    try {
      res.rendered = component(...args);
    } catch (error) {
      res.error = error;
    }

    Object.assign(ReactDispatcher, Object.fromEntries(originals));

    if (res.error) {
      throw res.error;
    }

    return res.rendered;
  };
};