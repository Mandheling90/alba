import * as React from 'react';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { EventManager } from '../../utils/EventManager';
import { unstable_resetCreateSelectorCache } from '../../utils/createSelector';
var isSyntheticEvent = function isSyntheticEvent(event) {
  return event.isPropagationStopped !== undefined;
};
var globalId = 0;
var wrapPublicApi = function wrapPublicApi(publicApi) {
  var privateOnlyApi = {};
  privateOnlyApi.getPublicApi = function () {
    return publicApi;
  };
  privateOnlyApi.register = function (visibility, methods) {
    Object.keys(methods).forEach(function (methodName) {
      if (visibility === 'public') {
        publicApi[methodName] = methods[methodName];
      } else {
        privateOnlyApi[methodName] = methods[methodName];
      }
    });
  };
  var handler = {
    get: function get(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      return privateOnlyApi[prop];
    },
    set: function set(obj, prop, value) {
      obj[prop] = value;
      return true;
    }
  };
  return new Proxy(publicApi, handler);
};
export function useGridApiInitialization(inputApiRef, props) {
  var publicApiRef = React.useRef();
  if (!publicApiRef.current) {
    publicApiRef.current = {
      state: {},
      instanceId: globalId
    };
    globalId += 1;
  }
  var privateApiRef = React.useRef();
  if (!privateApiRef.current) {
    privateApiRef.current = wrapPublicApi(publicApiRef.current);
    privateApiRef.current.register('private', {
      caches: {},
      eventManager: new EventManager()
    });
  }
  React.useImperativeHandle(inputApiRef, function () {
    return publicApiRef.current;
  }, [publicApiRef]);
  var publishEvent = React.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var name = args[0],
      params = args[1],
      _args$ = args[2],
      event = _args$ === void 0 ? {} : _args$;
    event.defaultMuiPrevented = false;
    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }
    var details = props.signature === GridSignature.DataGridPro ? {
      api: privateApiRef.current.getPublicApi()
    } : {};
    privateApiRef.current.eventManager.emit(name, params, event, details);
  }, [privateApiRef, props.signature]);
  var subscribeEvent = React.useCallback(function (event, handler, options) {
    privateApiRef.current.eventManager.on(event, handler, options);
    var api = privateApiRef.current;
    return function () {
      api.eventManager.removeListener(event, handler);
    };
  }, [privateApiRef]);
  useGridApiMethod(privateApiRef, {
    subscribeEvent: subscribeEvent,
    publishEvent: publishEvent
  }, 'public');
  React.useEffect(function () {
    var api = privateApiRef.current;
    return function () {
      unstable_resetCreateSelectorCache(api.instanceId);
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);
  return privateApiRef;
}