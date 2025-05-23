import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "isValidating", "debounceMs", "isProcessingProps", "onValueChange"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['editInputCell']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridEditInputCellRoot = styled(InputBase, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.editInputCell;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return _extends({}, theme.typography.body2, {
    padding: '1px 0',
    '& input': {
      padding: '0 16px',
      height: '100%'
    }
  });
});
var GridEditInputCell = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var rootProps = useGridRootProps();
  var id = props.id,
    value = props.value,
    formattedValue = props.formattedValue,
    api = props.api,
    field = props.field,
    row = props.row,
    rowNode = props.rowNode,
    colDef = props.colDef,
    cellMode = props.cellMode,
    isEditable = props.isEditable,
    tabIndex = props.tabIndex,
    hasFocus = props.hasFocus,
    isValidating = props.isValidating,
    _props$debounceMs = props.debounceMs,
    debounceMs = _props$debounceMs === void 0 ? 200 : _props$debounceMs,
    isProcessingProps = props.isProcessingProps,
    onValueChange = props.onValueChange,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var inputRef = React.useRef();
  var _React$useState = React.useState(value),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    valueState = _React$useState2[0],
    setValueState = _React$useState2[1];
  var classes = useUtilityClasses(rootProps);
  var handleChange = React.useCallback( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var newValue, column, parsedValue;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newValue = event.target.value;
              if (!onValueChange) {
                _context.next = 4;
                break;
              }
              _context.next = 4;
              return onValueChange(event, newValue);
            case 4:
              column = apiRef.current.getColumn(field);
              parsedValue = newValue;
              if (column.valueParser) {
                parsedValue = column.valueParser(newValue, apiRef.current.getCellParams(id, field));
              }
              setValueState(parsedValue);
              apiRef.current.setEditCellValue({
                id: id,
                field: field,
                value: parsedValue,
                debounceMs: debounceMs,
                unstable_skipValueParser: true
              }, event);
            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }(), [apiRef, debounceMs, field, id, onValueChange]);
  var meta = apiRef.current.unstable_getEditCellMeta ? apiRef.current.unstable_getEditCellMeta(id, field) : {};
  React.useEffect(function () {
    if (meta.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta.changeReason, value]);
  useEnhancedEffect(function () {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/_jsx(GridEditInputCellRoot, _extends({
    ref: ref,
    inputRef: inputRef,
    className: classes.root,
    ownerState: rootProps,
    fullWidth: true,
    type: colDef.type === 'number' ? colDef.type : 'text',
    value: valueState != null ? valueState : '',
    onChange: handleChange,
    endAdornment: isProcessingProps ? /*#__PURE__*/_jsx(rootProps.slots.loadIcon, {}) : undefined
  }, other));
});
process.env.NODE_ENV !== "production" ? GridEditInputCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']),
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object,
  debounceMs: PropTypes.number,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]),
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
} : void 0;
export { GridEditInputCell };
export var renderEditInputCell = function renderEditInputCell(params) {
  return /*#__PURE__*/_jsx(GridEditInputCell, _extends({}, params));
};