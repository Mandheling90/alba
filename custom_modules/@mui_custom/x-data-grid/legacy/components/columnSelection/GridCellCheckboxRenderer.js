import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["field", "id", "value", "formattedValue", "row", "rowNode", "colDef", "isEditable", "cellMode", "hasFocus", "tabIndex", "api"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useForkRef as useForkRef } from '@mui/utils';
import { isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['checkboxInput']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridCellCheckboxForwardRef = /*#__PURE__*/React.forwardRef(function GridCellCheckboxRenderer(props, ref) {
  var _rootProps$slotProps;
  var field = props.field,
    id = props.id,
    isChecked = props.value,
    formattedValue = props.formattedValue,
    row = props.row,
    rowNode = props.rowNode,
    colDef = props.colDef,
    isEditable = props.isEditable,
    cellMode = props.cellMode,
    hasFocus = props.hasFocus,
    tabIndex = props.tabIndex,
    api = props.api,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var ownerState = {
    classes: rootProps.classes
  };
  var classes = useUtilityClasses(ownerState);
  var checkboxElement = React.useRef(null);
  var rippleRef = React.useRef();
  var handleRef = useForkRef(checkboxElement, ref);
  var element = apiRef.current.getCellElement(id, field);
  var handleChange = function handleChange(event) {
    var params = {
      value: event.target.checked,
      id: id
    };
    apiRef.current.publishEvent('rowSelectionCheckboxChange', params, event);
  };
  React.useLayoutEffect(function () {
    if (tabIndex === 0 && element) {
      element.tabIndex = -1;
    }
  }, [element, tabIndex]);
  React.useEffect(function () {
    if (hasFocus) {
      var _checkboxElement$curr;
      var input = (_checkboxElement$curr = checkboxElement.current) == null ? void 0 : _checkboxElement$curr.querySelector('input');
      input == null ? void 0 : input.focus({
        preventScroll: true
      });
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({});
    }
  }, [hasFocus]);
  var handleKeyDown = React.useCallback(function (event) {
    if (isSpaceKey(event.key)) {
      // We call event.stopPropagation to avoid selecting the row and also scrolling to bottom
      // TODO: Remove and add a check inside useGridKeyboardNavigation
      event.stopPropagation();
    }
  }, []);
  if (rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
    return null;
  }
  var isSelectable = apiRef.current.isRowSelectable(id);
  var label = apiRef.current.getLocaleText(isChecked ? 'checkboxSelectionUnselectRow' : 'checkboxSelectionSelectRow');
  return /*#__PURE__*/_jsx(rootProps.slots.baseCheckbox, _extends({
    ref: handleRef,
    tabIndex: tabIndex,
    checked: isChecked,
    onChange: handleChange,
    className: classes.root,
    inputProps: {
      'aria-label': label
    },
    onKeyDown: handleKeyDown,
    disabled: !isSelectable,
    touchRippleRef: rippleRef
  }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseCheckbox, other));
});
process.env.NODE_ENV !== "production" ? GridCellCheckboxForwardRef.propTypes = {
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
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.shape({
      focus: PropTypes.func.isRequired
    })
  })]),
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
export { GridCellCheckboxForwardRef };
export var GridCellCheckboxRenderer = GridCellCheckboxForwardRef;