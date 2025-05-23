"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRoot = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _utils = require("@mui/utils");
var _GridRootStyles = require("./GridRootStyles");
var _gridColumnsSelector = require("../../hooks/features/columns/gridColumnsSelector");
var _useGridSelector = require("../../hooks/utils/useGridSelector");
var _useGridPrivateApiContext = require("../../hooks/utils/useGridPrivateApiContext");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _gridClasses = require("../../constants/gridClasses");
var _densitySelector = require("../../hooks/features/density/densitySelector");
var _gridColumnGroupsSelector = require("../../hooks/features/columnGrouping/gridColumnGroupsSelector");
var _gridRowsSelector = require("../../hooks/features/rows/gridRowsSelector");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["children", "className"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useUtilityClasses = ownerState => {
  const {
    autoHeight,
    density,
    classes
  } = ownerState;
  const slots = {
    root: ['root', autoHeight && 'autoHeight', `root--density${(0, _utils.unstable_capitalize)(density)}`, 'withBorderColor']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
const GridRoot = /*#__PURE__*/React.forwardRef(function GridRoot(props, ref) {
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const {
      children,
      className
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const visibleColumns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector);
  const totalRowCount = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsSelector.gridRowCountSelector);
  const densityValue = (0, _useGridSelector.useGridSelector)(apiRef, _densitySelector.gridDensityValueSelector);
  const headerGroupingMaxDepth = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnGroupsSelector.gridColumnGroupsHeaderMaxDepthSelector);
  const rootContainerRef = React.useRef(null);
  const handleRef = (0, _utils.unstable_useForkRef)(rootContainerRef, ref);
  const pinnedRowsCount = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsSelector.gridPinnedRowsCountSelector);
  const ownerState = (0, _extends2.default)({}, rootProps, {
    density: densityValue
  });
  const classes = useUtilityClasses(ownerState);
  apiRef.current.register('public', {
    rootElementRef: rootContainerRef
  });

  // Our implementation of <NoSsr />
  const [mountedState, setMountedState] = React.useState(false);
  (0, _utils.unstable_useEnhancedEffect)(() => {
    setMountedState(true);
  }, []);
  (0, _utils.unstable_useEnhancedEffect)(() => {
    if (mountedState) {
      apiRef.current.updateGridDimensionsRef();
    }
  }, [apiRef, mountedState]);
  if (!mountedState) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridRootStyles.GridRootStyles, (0, _extends2.default)({
    ref: handleRef,
    className: (0, _clsx.default)(className, classes.root),
    ownerState: ownerState,
    role: "grid",
    "aria-colcount": visibleColumns.length,
    "aria-rowcount": headerGroupingMaxDepth + 1 + pinnedRowsCount + totalRowCount,
    "aria-multiselectable": !rootProps.disableMultipleRowSelection,
    "aria-label": rootProps['aria-label'],
    "aria-labelledby": rootProps['aria-labelledby']
  }, other, {
    children: children
  }));
});
exports.GridRoot = GridRoot;
process.env.NODE_ENV !== "production" ? GridRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;