"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridFilterInputSingleSelect = GridFilterInputSingleSelect;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _useGridRootProps = require("../../../hooks/utils/useGridRootProps");
var _filterPanelUtils = require("./filterPanelUtils");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef", "getOptionLabel", "getOptionValue"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const renderSingleSelectOptions = ({
  column: {
    valueOptions,
    field
  },
  OptionComponent,
  getOptionLabel,
  getOptionValue,
  isSelectNative,
  baseSelectOptionProps
}) => {
  const iterableColumnValues = typeof valueOptions === 'function' ? ['', ...valueOptions({
    field
  })] : ['', ...(valueOptions || [])];
  return iterableColumnValues.map(option => {
    const value = getOptionValue(option);
    const label = getOptionLabel(option);
    return /*#__PURE__*/(0, React.createElement)(OptionComponent, (0, _extends2.default)({}, baseSelectOptionProps, {
      native: isSelectNative,
      key: value,
      value: value
    }), label);
  });
};
function GridFilterInputSingleSelect(props) {
  const {
      item,
      applyValue,
      type,
      apiRef,
      focusElementRef,
      getOptionLabel: getOptionLabelProp,
      getOptionValue: getOptionValueProp
    } = props,
    others = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const id = (0, _utils.unstable_useId)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;
  const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};
  let resolvedColumn = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if ((0, _filterPanelUtils.isSingleSelectColDef)(column)) {
      resolvedColumn = column;
    }
  }
  const getOptionValue = getOptionValueProp || resolvedColumn?.getOptionValue;
  const getOptionLabel = getOptionLabelProp || resolvedColumn?.getOptionLabel;
  const currentValueOptions = React.useMemo(() => {
    if (!resolvedColumn) {
      return undefined;
    }
    return typeof resolvedColumn.valueOptions === 'function' ? resolvedColumn.valueOptions({
      field: resolvedColumn.field
    }) : resolvedColumn.valueOptions;
  }, [resolvedColumn]);
  const onFilterChange = React.useCallback(event => {
    let value = event.target.value;

    // NativeSelect casts the value to a string.
    value = (0, _filterPanelUtils.getValueFromValueOptions)(value, currentValueOptions, getOptionValue);
    setFilterValueState(String(value));
    applyValue((0, _extends2.default)({}, item, {
      value
    }));
  }, [currentValueOptions, getOptionValue, applyValue, item]);
  React.useEffect(() => {
    let itemValue;
    if (currentValueOptions !== undefined) {
      // sanitize if valueOptions are provided
      itemValue = (0, _filterPanelUtils.getValueFromValueOptions)(item.value, currentValueOptions, getOptionValue);
      if (itemValue !== item.value) {
        applyValue((0, _extends2.default)({}, item, {
          value: itemValue
        }));
        return;
      }
    } else {
      itemValue = item.value;
    }
    itemValue = itemValue ?? '';
    setFilterValueState(String(itemValue));
  }, [item, currentValueOptions, applyValue, getOptionValue]);
  if (!(0, _filterPanelUtils.isSingleSelectColDef)(resolvedColumn)) {
    return null;
  }
  if (!(0, _filterPanelUtils.isSingleSelectColDef)(resolvedColumn)) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseTextField, (0, _extends2.default)({
    // TODO: use baseSelect slot
    id: id,
    label: apiRef.current.getLocaleText('filterPanelInputLabel'),
    placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
    value: filterValueState,
    onChange: onFilterChange,
    variant: "standard",
    type: type || 'text',
    InputLabelProps: {
      shrink: true
    },
    inputRef: focusElementRef,
    select: true,
    SelectProps: (0, _extends2.default)({
      native: isSelectNative
    }, rootProps.slotProps?.baseSelect)
  }, others, rootProps.slotProps?.baseTextField, {
    children: renderSingleSelectOptions({
      column: resolvedColumn,
      OptionComponent: rootProps.slots.baseSelectOption,
      getOptionLabel,
      getOptionValue,
      isSelectNative,
      baseSelectOptionProps
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridFilterInputSingleSelect.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: _propTypes.default.shape({
    current: _propTypes.default.object.isRequired
  }).isRequired,
  applyValue: _propTypes.default.func.isRequired,
  focusElementRef: _propTypes.default /* @typescript-to-proptypes-ignore */.oneOfType([_propTypes.default.func, _propTypes.default.object]),
  /**
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel: _propTypes.default.func,
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue: _propTypes.default.func,
  item: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operator: _propTypes.default.string.isRequired,
    value: _propTypes.default.any
  }).isRequired
} : void 0;