"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridApiInitialization = useGridApiInitialization;
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../utils/useGridApiMethod");
var _useGridApiEventHandler = require("../utils/useGridApiEventHandler");
var _EventManager = require("../../utils/EventManager");
var _createSelector = require("../../utils/createSelector");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
function useGridApiInitialization(inputApiRef, props) {
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
      eventManager: new _EventManager.EventManager()
    });
  }
  React.useImperativeHandle(inputApiRef, () => publicApiRef.current, [publicApiRef]);
  const publishEvent = React.useCallback((...args) => {
    const [name, params, event = {}] = args;
    event.defaultMuiPrevented = false;
    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }
    const details = props.signature === _useGridApiEventHandler.GridSignature.DataGridPro ? {
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
  (0, _useGridApiMethod.useGridApiMethod)(privateApiRef, {
    subscribeEvent,
    publishEvent
  }, 'public');
  React.useEffect(() => {
    const api = privateApiRef.current;
    return () => {
      (0, _createSelector.unstable_resetCreateSelectorCache)(api.instanceId);
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);
  return privateApiRef;
}