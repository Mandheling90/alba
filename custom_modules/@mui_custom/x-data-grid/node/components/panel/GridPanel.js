"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridPanelClasses = exports.GridPanel = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _styles = require("@mui/material/styles");
var _utils = require("@mui/utils");
var _ClickAwayListener = _interopRequireDefault(require("@mui/material/ClickAwayListener"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Popper = _interopRequireDefault(require("@mui/material/Popper"));
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _keyboardUtils = require("../../utils/keyboardUtils");
var _gridClasses = require("../../constants/gridClasses");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["children", "className", "classes"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const gridPanelClasses = (0, _utils.unstable_generateUtilityClasses)('MuiDataGrid', ['panel', 'paper']);
exports.gridPanelClasses = gridPanelClasses;
const GridPanelRoot = (0, _styles.styled)(_Popper.default, {
  name: 'MuiDataGrid',
  slot: 'Panel',
  overridesResolver: (props, styles) => styles.panel
})(({
  theme
}) => ({
  zIndex: theme.zIndex.modal
}));
const GridPaperRoot = (0, _styles.styled)(_Paper.default, {
  name: 'MuiDataGrid',
  slot: 'Paper',
  overridesResolver: (props, styles) => styles.paper
})(({
  theme
}) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  minWidth: 300,
  maxHeight: 450,
  display: 'flex'
}));
const GridPanel = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      children,
      className
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const classes = gridPanelClasses;
  const [isPlaced, setIsPlaced] = React.useState(false);
  const handleClickAway = React.useCallback(() => {
    apiRef.current.hidePreferences();
  }, [apiRef]);
  const handleKeyDown = React.useCallback(event => {
    if ((0, _keyboardUtils.isEscapeKey)(event.key)) {
      apiRef.current.hidePreferences();
    }
  }, [apiRef]);
  const modifiers = React.useMemo(() => [{
    name: 'flip',
    enabled: false
  }, {
    name: 'isPlaced',
    enabled: true,
    phase: 'main',
    fn: () => {
      setIsPlaced(true);
    },
    effect: () => () => {
      setIsPlaced(false);
    }
  }], []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  React.useEffect(() => {
    const columnHeadersElement = apiRef.current.rootElementRef?.current?.querySelector(`.${_gridClasses.gridClasses.columnHeaders}`);
    if (columnHeadersElement) {
      setAnchorEl(columnHeadersElement);
    }
  }, [apiRef]);
  if (!anchorEl) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridPanelRoot, (0, _extends2.default)({
    ref: ref,
    placement: "bottom-start",
    className: (0, _clsx.default)(className, classes.panel),
    ownerState: rootProps,
    anchorEl: anchorEl,
    modifiers: modifiers
  }, other, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ClickAwayListener.default, {
      mouseEvent: "onMouseUp",
      onClickAway: handleClickAway,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(GridPaperRoot, {
        className: classes.paper,
        ownerState: rootProps,
        elevation: 8,
        onKeyDown: handleKeyDown,
        children: isPlaced && children
      })
    })
  }));
});
exports.GridPanel = GridPanel;
process.env.NODE_ENV !== "production" ? GridPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Popper render function or node.
   */
  children: _propTypes.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * If `true`, the component is shown.
   */
  open: _propTypes.default.bool.isRequired
} : void 0;