"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridCell = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _utils = require("@mui/utils");
var _gridClasses = require("../../constants/gridClasses");
var _models = require("../../models");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _gridFocusStateSelector = require("../../hooks/features/focus/gridFocusStateSelector");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["align", "children", "colIndex", "colDef", "cellMode", "field", "formattedValue", "hasFocus", "height", "isEditable", "isSelected", "rowId", "tabIndex", "value", "width", "className", "showRightBorder", "extendRowFullWidth", "row", "colSpan", "disableDragEvents", "onClick", "onDoubleClick", "onMouseDown", "onMouseUp", "onMouseOver", "onKeyDown", "onKeyUp", "onDragEnter", "onDragOver"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Based on https://stackoverflow.com/a/59518678
let cachedSupportsPreventScroll;
function doesSupportPreventScroll() {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      }
    });
  }
  return cachedSupportsPreventScroll;
}
const useUtilityClasses = ownerState => {
  const {
    align,
    showRightBorder,
    isEditable,
    isSelected,
    classes
  } = ownerState;
  const slots = {
    root: ['cell', `cell--text${(0, _utils.unstable_capitalize)(align)}`, isEditable && 'cell--editable', isSelected && 'selected', showRightBorder && 'cell--withRightBorder', 'withBorderColor'],
    content: ['cellContent']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
let warnedOnce = false;
const GridCell = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      align,
      children,
      colIndex,
      cellMode,
      field,
      formattedValue,
      hasFocus,
      height,
      isEditable,
      isSelected,
      rowId,
      tabIndex,
      value,
      width,
      className,
      showRightBorder,
      colSpan,
      disableDragEvents,
      onClick,
      onDoubleClick,
      onMouseDown,
      onMouseUp,
      onMouseOver,
      onKeyDown,
      onKeyUp,
      onDragEnter,
      onDragOver
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef(null);
  const handleRef = (0, _utils.unstable_useForkRef)(ref, cellRef);
  const focusElementRef = React.useRef(null);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const ownerState = {
    align,
    showRightBorder,
    isEditable,
    classes: rootProps.classes,
    isSelected
  };
  const classes = useUtilityClasses(ownerState);
  const publishMouseUp = React.useCallback(eventName => event => {
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);
    if (onMouseUp) {
      onMouseUp(event);
    }
  }, [apiRef, field, onMouseUp, rowId]);
  const publishMouseDown = React.useCallback(eventName => event => {
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);
    if (onMouseDown) {
      onMouseDown(event);
    }
  }, [apiRef, field, onMouseDown, rowId]);
  const publish = React.useCallback((eventName, propHandler) => event => {
    // The row might have been deleted during the click
    if (!apiRef.current.getRow(rowId)) {
      return;
    }
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);
    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, field, rowId]);
  const style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height === 'auto' ? 'none' : height // max-height doesn't support "auto"
  };

  React.useEffect(() => {
    if (!hasFocus || cellMode === _models.GridCellModes.Edit) {
      return;
    }
    const doc = (0, _utils.unstable_ownerDocument)(apiRef.current.rootElementRef.current);
    if (cellRef.current && !cellRef.current.contains(doc.activeElement)) {
      const focusableElement = cellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusElementRef.current || focusableElement || cellRef.current;
      if (doesSupportPreventScroll()) {
        elementToFocus.focus({
          preventScroll: true
        });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [hasFocus, cellMode, apiRef]);
  let handleFocus = other.onFocus;
  if (process.env.NODE_ENV === 'test' && rootProps.experimentalFeatures?.warnIfFocusStateIsNotSynced) {
    handleFocus = event => {
      const focusedCell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);
      if (focusedCell?.id === rowId && focusedCell.field === field) {
        if (typeof other.onFocus === 'function') {
          other.onFocus(event);
        }
        return;
      }
      if (!warnedOnce) {
        console.warn([`MUI: The cell with id=${rowId} and field=${field} received focus.`, `According to the state, the focus should be at id=${focusedCell?.id}, field=${focusedCell?.field}.`, "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.", 'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.'].join('\n'));
        warnedOnce = true;
      }
    };
  }
  const column = apiRef.current.getColumn(field);
  const managesOwnFocus = column.type === 'actions';
  const renderChildren = () => {
    if (children === undefined) {
      const valueString = valueToRender?.toString();
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.content,
        title: valueString,
        children: valueString
      });
    }
    if ( /*#__PURE__*/React.isValidElement(children) && managesOwnFocus) {
      return /*#__PURE__*/React.cloneElement(children, {
        focusElementRef
      });
    }
    return children;
  };
  const draggableEventHandlers = disableDragEvents ? null : {
    onDragEnter: publish('cellDragEnter', onDragEnter),
    onDragOver: publish('cellDragOver', onDragOver)
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", (0, _extends2.default)({
    ref: handleRef,
    className: (0, _clsx.default)(className, classes.root),
    role: "cell",
    "data-field": field,
    "data-colindex": colIndex,
    "aria-colindex": colIndex + 1,
    "aria-colspan": colSpan,
    style: style,
    tabIndex: (cellMode === 'view' || !isEditable) && !managesOwnFocus ? tabIndex : -1,
    onClick: publish('cellClick', onClick),
    onDoubleClick: publish('cellDoubleClick', onDoubleClick),
    onMouseOver: publish('cellMouseOver', onMouseOver),
    onMouseDown: publishMouseDown('cellMouseDown'),
    onMouseUp: publishMouseUp('cellMouseUp'),
    onKeyDown: publish('cellKeyDown', onKeyDown),
    onKeyUp: publish('cellKeyUp', onKeyUp)
  }, draggableEventHandlers, other, {
    onFocus: handleFocus,
    children: renderChildren()
  }));
});
const MemoizedCell = /*#__PURE__*/React.memo(GridCell);
exports.GridCell = MemoizedCell;
process.env.NODE_ENV !== "production" ? GridCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: _propTypes.default.oneOf(['center', 'left', 'right']),
  cellMode: _propTypes.default.oneOf(['edit', 'view']),
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  colIndex: _propTypes.default.number,
  colSpan: _propTypes.default.number,
  disableDragEvents: _propTypes.default.bool,
  field: _propTypes.default.string,
  formattedValue: _propTypes.default.any,
  hasFocus: _propTypes.default.bool,
  height: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.number]),
  isEditable: _propTypes.default.bool,
  isSelected: _propTypes.default.bool,
  onClick: _propTypes.default.func,
  onDoubleClick: _propTypes.default.func,
  onDragEnter: _propTypes.default.func,
  onDragOver: _propTypes.default.func,
  onKeyDown: _propTypes.default.func,
  onMouseDown: _propTypes.default.func,
  onMouseUp: _propTypes.default.func,
  rowId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  showRightBorder: _propTypes.default.bool,
  tabIndex: _propTypes.default.oneOf([-1, 0]),
  value: _propTypes.default.any,
  width: _propTypes.default.number
} : void 0;