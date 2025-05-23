import _extends from "@babel/runtime/helpers/esm/extends";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "className", "hasFocus", "isValidating", "isProcessingProps", "error", "onValueChange", "initialOpen", "getOptionLabel", "getOptionValue"],
  _excluded2 = ["MenuProps"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEditModes } from '../../models/gridEditRowModel';
import { getValueFromValueOptions, isSingleSelectColDef } from '../panel/filterPanel/filterPanelUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
function isKeyboardEvent(event) {
  return !!event.key;
}
function GridEditSingleSelectCell(props) {
  var _rootProps$slotProps, _baseSelectProps$nati, _rootProps$slotProps2;
  var rootProps = useGridRootProps();
  var id = props.id,
    valueProp = props.value,
    formattedValue = props.formattedValue,
    api = props.api,
    field = props.field,
    row = props.row,
    rowNode = props.rowNode,
    colDef = props.colDef,
    cellMode = props.cellMode,
    isEditable = props.isEditable,
    tabIndex = props.tabIndex,
    className = props.className,
    hasFocus = props.hasFocus,
    isValidating = props.isValidating,
    isProcessingProps = props.isProcessingProps,
    error = props.error,
    onValueChange = props.onValueChange,
    _props$initialOpen = props.initialOpen,
    initialOpen = _props$initialOpen === void 0 ? rootProps.editMode === GridEditModes.Cell : _props$initialOpen,
    getOptionLabelProp = props.getOptionLabel,
    getOptionValueProp = props.getOptionValue,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var ref = React.useRef();
  var inputRef = React.useRef();
  var _React$useState = React.useState(initialOpen),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    open = _React$useState2[0],
    setOpen = _React$useState2[1];
  var baseSelectProps = ((_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseSelect) || {};
  var isSelectNative = (_baseSelectProps$nati = baseSelectProps.native) != null ? _baseSelectProps$nati : false;
  var _ref = ((_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseSelect) || {},
    MenuProps = _ref.MenuProps,
    otherBaseSelectProps = _objectWithoutProperties(_ref, _excluded2);
  useEnhancedEffect(function () {
    if (hasFocus) {
      var _inputRef$current;
      (_inputRef$current = inputRef.current) == null ? void 0 : _inputRef$current.focus();
    }
  }, [hasFocus]);
  if (!isSingleSelectColDef(colDef)) {
    return null;
  }
  var valueOptions;
  if (typeof (colDef == null ? void 0 : colDef.valueOptions) === 'function') {
    valueOptions = colDef == null ? void 0 : colDef.valueOptions({
      id: id,
      row: row,
      field: field
    });
  } else {
    valueOptions = colDef == null ? void 0 : colDef.valueOptions;
  }
  if (!valueOptions) {
    return null;
  }
  var getOptionValue = getOptionValueProp || colDef.getOptionValue;
  var getOptionLabel = getOptionLabelProp || colDef.getOptionLabel;
  var handleChange = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var target, formattedTargetValue;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!isSingleSelectColDef(colDef) || !valueOptions)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              setOpen(false);
              target = event.target; // NativeSelect casts the value to a string.
              formattedTargetValue = getValueFromValueOptions(target.value, valueOptions, getOptionValue);
              if (!onValueChange) {
                _context.next = 8;
                break;
              }
              _context.next = 8;
              return onValueChange(event, formattedTargetValue);
            case 8:
              _context.next = 10;
              return apiRef.current.setEditCellValue({
                id: id,
                field: field,
                value: formattedTargetValue
              }, event);
            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function handleChange(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleClose = function handleClose(event, reason) {
    if (rootProps.editMode === GridEditModes.Row) {
      setOpen(false);
      return;
    }
    if (reason === 'backdropClick' || isEscapeKey(event.key)) {
      apiRef.current.stopCellEditMode({
        id: id,
        field: field,
        ignoreModifications: true
      });
    }
  };
  var handleOpen = function handleOpen(event) {
    if (isKeyboardEvent(event) && event.key === 'Enter') {
      return;
    }
    setOpen(true);
  };
  if (!valueOptions || !colDef) {
    return null;
  }
  return /*#__PURE__*/_jsx(rootProps.slots.baseSelect, _extends({
    ref: ref,
    inputRef: inputRef,
    value: valueProp,
    onChange: handleChange,
    open: open,
    onOpen: handleOpen,
    MenuProps: _extends({
      onClose: handleClose
    }, MenuProps),
    error: error,
    native: isSelectNative,
    fullWidth: true
  }, other, otherBaseSelectProps, {
    children: valueOptions.map(function (valueOption) {
      var _rootProps$slotProps3;
      var value = getOptionValue(valueOption);
      return /*#__PURE__*/_createElement(rootProps.slots.baseSelectOption, _extends({}, ((_rootProps$slotProps3 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps3.baseSelectOption) || {}, {
        native: isSelectNative,
        key: value,
        value: value
      }), getOptionLabel(valueOption));
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridEditSingleSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
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
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the select opens by default.
   */
  initialOpen: PropTypes.bool,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {SelectChangeEvent<any>} event The event source of the callback.
   * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
} : void 0;
export { GridEditSingleSelectCell };
export var renderEditSingleSelectCell = function renderEditSingleSelectCell(params) {
  return /*#__PURE__*/_jsx(GridEditSingleSelectCell, _extends({}, params));
};