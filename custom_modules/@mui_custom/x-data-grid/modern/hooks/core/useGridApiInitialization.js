import * as React from 'react';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { EventManager } from '../../utils/EventManager';
import { unstable_resetCreateSelectorCache } from '../../utils/createSelector';
const isSyntheticEvent = event => {
  return event.isPropagationStopped !== undefined;
};
let globalId = 0;
const wrapPublicApi = publicApi => {
  const privateOnlyApi = {};
  privateOnlyApi.getPublicApi = () => publicApi;
  privateOnlyApi.register = (visibility, methods) => {
    Object.keys(methods).forEach(methodName => {
      if (visibility === 'public') {
        publicApi[methodName] = methods[methodName];
      } else {
        privateOnlyApi[methodName] = methods[methodName];
      }
    });
  };
  const handler = {
    get: (obj, prop) => {
      if (prop in obj) {
        return obj[prop];
      }
      return privateOnlyApi[prop];
    },
    set: (obj, prop, value) => {
      obj[prop] = value;
      return true;
    }
  };
  return new Proxy(publicApi, handler);
};
export function useGridApiInitialization(inputApiRef, props) {
  const publicApiRef = React.useRef();
  if (!publicApiRef.current) {
    publicApiRef.current = {
      state: {},
      instanceId: globalId
    };
    globalId += 1;
  }
  const privateApiRef = React.useRef();
  if (!privateApiRef.current) {
    privateApiRef.current = wrapPublicApi(publicApiRef.current);
    privateApiRef.current.register('private', {
      caches: {},
      eventManager: new EventManager()
    });
  }
  React.useImperativeHandle(inputApiRef, () => publicApiRef.current, [publicApiRef]);
  const publishEvent = React.useCallback((...args) => {
    const [name, params, event = {}] = args;
    event.defaultMuiPrevented = false;
    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }
    const details = props.signature === GridSignature.DataGridPro ? {
      api: privateApiRef.current.getPublicApi()
    } : {};
    privateApiRef.current.eventManager.emit(name, params, event, details);
  }, [privateApiRef, props.signature]);
  const subscribeEvent = React.useCallback((event, handler, options) => {
    privateApiRef.current.eventManager.on(event, handler, options);
    const api = privateApiRef.current;
    return () => {
      api.eventManager.removeListener(event, handler);
    };
  }, [privateApiRef]);
  useGridApiMethod(privateApiRef, {
    subscribeEvent,
    publishEvent
  }, 'public');
  React.useEffect(() => {
    const api = privateApiRef.current;
    return () => {
      unstable_resetCreateSelectorCache(api.instanceId);
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);
  return privateApiRef;
}