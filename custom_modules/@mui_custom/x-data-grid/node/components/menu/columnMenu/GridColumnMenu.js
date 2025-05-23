"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridGenericColumnMenu = exports.GridColumnMenu = exports.GRID_COLUMN_MENU_COMPONENTS_PROPS = exports.GRID_COLUMN_MENU_COMPONENTS = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useGridColumnMenuComponents = require("../../../hooks/features/columnMenu/useGridColumnMenuComponents");
var _GridColumnMenuContainer = require("./GridColumnMenuContainer");
var _GridColumnMenuColumnsItem = require("./menuItems/GridColumnMenuColumnsItem");
var _GridColumnMenuFilterItem = require("./menuItems/GridColumnMenuFilterItem");
var _GridColumnMenuSortItem = require("./menuItems/GridColumnMenuSortItem");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["defaultComponents", "defaultComponentsProps", "components", "componentsProps"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GRID_COLUMN_MENU_COMPONENTS = {
  ColumnMenuSortItem: _GridColumnMenuSortItem.GridColumnMenuSortItem,
  ColumnMenuFilterItem: _GridColumnMenuFilterItem.GridColumnMenuFilterItem,
  ColumnMenuColumnsItem: _GridColumnMenuColumnsItem.GridColumnMenuColumnsItem
};
exports.GRID_COLUMN_MENU_COMPONENTS = GRID_COLUMN_MENU_COMPONENTS;
const GRID_COLUMN_MENU_COMPONENTS_PROPS = {
  columnMenuSortItem: {
    displayOrder: 10
  },
  columnMenuFilterItem: {
    displayOrder: 20
  },
  columnMenuColumnsItem: {
    displayOrder: 30
  }
};
exports.GRID_COLUMN_MENU_COMPONENTS_PROPS = GRID_COLUMN_MENU_COMPONENTS_PROPS;
const GridGenericColumnMenu = /*#__PURE__*/React.forwardRef(function GridGenericColumnMenu(props, ref) {
  const {
      defaultComponents,
      defaultComponentsProps,
      components,
      componentsProps
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const orderedComponents = (0, _useGridColumnMenuComponents.useGridColumnMenuComponents)((0, _extends2.default)({}, other, {
    defaultComponents,
    defaultComponentsProps,
    components,
    componentsProps
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnMenuContainer.GridColumnMenuContainer, (0, _extends2.default)({
    ref: ref
  }, other, {
    children: orderedComponents.map(([Component, componentProps], index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, (0, _extends2.default)({}, componentProps), index))
  }));
});
exports.GridGenericColumnMenu = GridGenericColumnMenu;
const GridColumnMenu = /*#__PURE__*/React.forwardRef(function GridColumnMenu(props, ref) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridGenericColumnMenu, (0, _extends2.default)({}, props, {
    ref: ref,
    defaultComponents: GRID_COLUMN_MENU_COMPONENTS,
    defaultComponentsProps: GRID_COLUMN_MENU_COMPONENTS_PROPS
  }));
});
exports.GridColumnMenu = GridColumnMenu;
process.env.NODE_ENV !== "production" ? GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  /**
   * `components` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `componentsProps`
   * or it will be placed in the end of the list
   */
  components: _propTypes.default.object,
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  componentsProps: _propTypes.default.object,
  hideMenu: _propTypes.default.func.isRequired,
  id: _propTypes.default.string,
  labelledby: _propTypes.default.string,
  open: _propTypes.default.bool.isRequired
} : void 0;