import { createSelector as reselectCreateSelector } from 'reselect';
import { buildWarning } from './warning';
const cacheContainer = {
  cache: null
};
const missingInstanceIdWarning = buildWarning(['MUI: A selector was called without passing the instance ID, which may impact the performance of the grid.', 'To fix, call it with `apiRef`, e.g. `mySelector(apiRef)`, or pass the instance ID explicitly, e.g `mySelector(state, apiRef.current.instanceId)`.']);
export const createSelector = (...args) => {
  if (cacheContainer.cache === null) {
    cacheContainer.cache = {};
  }
  const selector = (...selectorArgs) => {
    const [stateOrApiRef, instanceId] = selectorArgs;
    const isApiRef = !!stateOrApiRef.current;
    const cacheKey = isApiRef ? stateOrApiRef.current.instanceId : instanceId != null ? instanceId : 'default';
    const state = isApiRef ? stateOrApiRef.current.state : stateOrApiRef;
    if (process.env.NODE_ENV !== 'production') {
      if (cacheKey === 'default') {
        missingInstanceIdWarning();
      }
    }
    if (cacheContainer.cache === null) {
      cacheContainer.cache = {};
    }
    const {
      cache
    } = cacheContainer;
    if (cache[cacheKey] && cache[cacheKey].get(args)) {
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cache[cacheKey].get(args)(state, cacheKey);
    }
    const newSelector = reselectCreateSelector(...args);
    if (!cache[cacheKey]) {
      cache[cacheKey] = new Map();
    }
    cache[cacheKey].set(args, newSelector);
    return newSelector(state, cacheKey);
  };

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsApiRef = true;
  return selector;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_resetCreateSelectorCache = cacheKey => {
  if (typeof cacheKey !== 'undefined') {
    if (cacheContainer.cache && cacheContainer.cache[cacheKey]) {
      delete cacheContainer.cache[cacheKey];
    }
  } else {
    cacheContainer.cache = null;
  }
};