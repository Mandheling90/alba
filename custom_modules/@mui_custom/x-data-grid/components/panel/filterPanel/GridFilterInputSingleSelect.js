import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef", "getOptionLabel", "getOptionValue"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getValueFromValueOptions, isSingleSelectColDef } from './filterPanelUtils';
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
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
    return /*#__PURE__*/_createElement(OptionComponent, _extends({}, baseSelectOptionProps, {
      native: isSelectNative,
      key: value,
      value: value
    }), label);
  });
};
function GridFilterInputSingleSelect(props) {
  var _item$value, _rootProps$slotProps, _baseSelectProps$nati, _rootProps$slotProps2, _resolvedColumn, _resolvedColumn2, _rootProps$slotProps3, _rootProps$slotProps4;
  const {
      item,
      applyValue,
      type,
      apiRef,
      focusElementRef,
      getOptionLabel: getOptionLabelProp,
      getOptionValue: getOptionValueProp
    } = props,
    others = _objectWithoutPropertiesLoose(props, _excluded);
  const [filterValueState, setFilterValueState] = React.useState((_item$value = item.value) != null ? _item$value : '');
  const id = useId();
  const rootProps = useGridRootProps();
  const baseSelectProps = ((_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseSelect) || {};
  const isSelectNative = (_baseSelectProps$nati = baseSelectProps.native) != null ? _baseSelectProps$nati : true;
  const baseSelectOptionProps = ((_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseSelectOption) || {};
  let resolvedColumn = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }
  const getOptionValue = getOptionValueProp || ((_resolvedColumn = resolvedColumn) == null ? void 0 : _resolvedColumn.getOptionValue);
  const getOptionLabel = getOptionLabelProp || ((_resolvedColumn2 = resolvedColumn) == null ? void 0 : _resolvedColumn2.getOptionLabel);
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
    value = getValueFromValueOptions(value, currentValueOptions, getOptionValue);
    setFilterValueState(String(value));
    applyValue(_extends({}, item, {
      value
    }));
  }, [currentValueOptions, getOptionValue, applyValue, item]);
  React.useEffect(() => {
    var _itemValue;
    let itemValue;
    if (currentValueOptions !== undefined) {
      // sanitize if valueOptions are provided
      itemValue = getValueFromValueOptions(item.value, currentValueOptions, getOptionValue);
      if (itemValue !== item.value) {
        applyValue(_extends({}, item, {
          value: itemValue
        }));
        return;
      }
    } else {
      itemValue = item.value;
    }
    itemValue = (_itemValue = itemValue) != null ? _itemValue : '';
    setFilterValueState(String(itemValue));
  }, [item, currentValueOptions, applyValue, getOptionValue]);
  if (!isSingleSelectColDef(resolvedColumn)) {
    return null;
  }
  if (!isSingleSelectColDef(resolvedColumn)) {
    return null;
  }
  return /*#__PURE__*/_jsx(rootProps.slots.baseTextField, _extends({
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
    SelectProps: _extends({
      native: isSelectNative
    }, (_rootProps$slotProps3 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps3.baseSelect)
  }, others, (_rootProps$slotProps4 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps4.baseTextField, {
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
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel: PropTypes.func,
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue: PropTypes.func,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired
} : void 0;
export { GridFilterInputSingleSelect };