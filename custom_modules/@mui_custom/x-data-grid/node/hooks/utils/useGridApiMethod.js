"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridApiMethod = useGridApiMethod;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function useGridApiMethod(privateApiRef, apiMethods, visibility) {
  const apiMethodsRef = React.useRef(apiMethods);
  const [apiMethodsNames] = React.useState(Object.keys(apiMethods));
  const installMethods = React.useCallback(() => {
    if (!privateApiRef.current) {
      return;
    }
    apiMethodsNames.forEach(methodName => {
      if (!privateApiRef.current.hasOwnProperty(methodName)) {
        privateApiRef.current.register(visibility, {
          [methodName]: (...args) => {
            const fn = apiMethodsRef.current[methodName];
            return fn(...args);
          }
        });
      }
    });
  }, [apiMethodsNames, privateApiRef, visibility]);
  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);
  React.useEffect(() => {
    installMethods();
  }, [installMethods]);
  installMethods();
}