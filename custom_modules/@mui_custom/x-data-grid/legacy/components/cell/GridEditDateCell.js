import _extends from "@babel/runtime/helpers/esm/extends";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "inputProps", "isValidating", "isProcessingProps", "onValueChange"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { jsx as _jsx } from "react/jsx-runtime";
var StyledInputBase = styled(InputBase)({
  fontSize: 'inherit'
});
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['editInputCell']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridEditDateCell(props) {
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
    hasFocus = props.hasFocus,
    inputProps = props.inputProps,
    isValidating = props.isValidating,
    isProcessingProps = props.isProcessingProps,
    onValueChange = props.onValueChange,
    other = _objectWithoutProperties(props, _excluded);
  var isDateTime = colDef.type === 'dateTime';
  var apiRef = useGridApiContext();
  var inputRef = React.useRef();
  var valueTransformed = React.useMemo(function () {
    var parsedDate;
    if (valueProp == null) {
      parsedDate = null;
    } else if (valueProp instanceof Date) {
      parsedDate = valueProp;
    } else {
      parsedDate = new Date((valueProp != null ? valueProp : '').toString());
    }
    var formattedDate;
    if (parsedDate == null || Number.isNaN(parsedDate.getTime())) {
      formattedDate = '';
    } else {
      var localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60 * 1000);
      formattedDate = localDate.toISOString().substr(0, isDateTime ? 16 : 10);
    }
    return {
      parsed: parsedDate,
      formatted: formattedDate
    };
  }, [valueProp, isDateTime]);
  var _React$useState = React.useState(valueTransformed),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    valueState = _React$useState2[0],
    setValueState = _React$useState2[1];
  var rootProps = useGridRootProps();
  var ownerState = {
    classes: rootProps.classes
  };
  var classes = useUtilityClasses(ownerState);
  var handleChange = React.useCallback( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var newFormattedDate, newParsedDate, _newFormattedDate$spl, _newFormattedDate$spl2, date, time, _date$split, _date$split2, year, month, day, _time$split, _time$split2, hours, minutes;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newFormattedDate = event.target.value;
              if (newFormattedDate === '') {
                newParsedDate = null;
              } else {
                _newFormattedDate$spl = newFormattedDate.split('T'), _newFormattedDate$spl2 = _slicedToArray(_newFormattedDate$spl, 2), date = _newFormattedDate$spl2[0], time = _newFormattedDate$spl2[1];
                _date$split = date.split('-'), _date$split2 = _slicedToArray(_date$split, 3), year = _date$split2[0], month = _date$split2[1], day = _date$split2[2];
                newParsedDate = new Date();
                newParsedDate.setFullYear(Number(year), Number(month) - 1, Number(day));
                newParsedDate.setHours(0, 0, 0, 0);
                if (time) {
                  _time$split = time.split(':'), _time$split2 = _slicedToArray(_time$split, 2), hours = _time$split2[0], minutes = _time$split2[1];
                  newParsedDate.setHours(Number(hours), Number(minutes), 0, 0);
                }
              }
              if (!onValueChange) {
                _context.next = 5;
                break;
              }
              _context.next = 5;
              return onValueChange(event, newParsedDate);
            case 5:
              setValueState({
                parsed: newParsedDate,
                formatted: newFormattedDate
              });
              apiRef.current.setEditCellValue({
                id: id,
                field: field,
                value: newParsedDate
              }, event);
            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [apiRef, field, id, onValueChange]);
  React.useEffect(function () {
    setValueState(function (state) {
      var _valueTransformed$par, _state$parsed;
      if (valueTransformed.parsed !== state.parsed && ((_valueTransformed$par = valueTransformed.parsed) == null ? void 0 : _valueTransformed$par.getTime()) !== ((_state$parsed = state.parsed) == null ? void 0 : _state$parsed.getTime())) {
        return valueTransformed;
      }
      return state;
    });
  }, [valueTransformed]);
  useEnhancedEffect(function () {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/_jsx(StyledInputBase, _extends({
    inputRef: inputRef,
    fullWidth: true,
    className: classes.root,
    type: isDateTime ? 'datetime-local' : 'date',
    inputProps: _extends({
      max: isDateTime ? '9999-12-31T23:59' : '9999-12-31'
    }, inputProps),
    value: valueState.formatted,
    onChange: handleChange
  }, other));
}
process.env.NODE_ENV !== "production" ? GridEditDateCell.propTypes = {
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
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
export { GridEditDateCell };
export var renderEditDateCell = function renderEditDateCell(params) {
  return /*#__PURE__*/_jsx(GridEditDateCell, _extends({}, params));
};