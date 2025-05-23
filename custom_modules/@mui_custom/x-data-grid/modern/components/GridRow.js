import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["selected", "rowId", "row", "index", "style", "position", "rowHeight", "className", "visibleColumns", "renderedColumns", "containerWidth", "firstColumnToRender", "lastColumnToRender", "isLastVisible", "focusedCell", "tabbableCell", "onClick", "onDoubleClick", "onMouseEnter", "onMouseLeave"],
  _excluded2 = ["changeReason"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses, unstable_useForkRef as useForkRef } from '@mui/utils';
import { GridEditModes, GridRowModes, GridCellModes } from '../models/gridEditRowModel';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass, gridClasses } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridColumnsTotalWidthSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridVisibleRows } from '../hooks/utils/useGridVisibleRows';
import { findParentElementFromClassName } from '../utils/domUtils';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../colDef/gridCheckboxSelectionColDef';
import { GRID_ACTIONS_COLUMN_TYPE } from '../colDef/gridActionsColDef';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../constants/gridDetailPanelToggleField';
import { gridSortModelSelector } from '../hooks/features/sorting/gridSortingSelector';
import { gridRowMaximumTreeDepthSelector } from '../hooks/features/rows/gridRowsSelector';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { randomNumberBetween } from '../utils/utils';
import { gridEditRowsStateSelector } from '../hooks/features/editing/gridEditingSelectors';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    editable,
    editing,
    selected,
    isLastVisible,
    rowHeight,
    classes
  } = ownerState;
  const slots = {
    root: ['row', selected && 'selected', editable && 'row--editable', editing && 'row--editing', isLastVisible && 'row--lastVisible', rowHeight === 'auto' && 'row--dynamicHeight']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function EmptyCell({
  width
}) {
  if (!width) {
    return null;
  }
  const style = {
    width
  };
  return /*#__PURE__*/_jsx("div", {
    className: "MuiDataGrid-cell MuiDataGrid-withBorderColor",
    style: style
  }); // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
}

const GridRow = /*#__PURE__*/React.forwardRef(function GridRow(props, refProp) {
  const {
      selected,
      rowId,
      row,
      index,
      style: styleProp,
      position,
      rowHeight,
      className,
      renderedColumns,
      containerWidth,
      firstColumnToRender,
      isLastVisible = false,
      focusedCell,
      tabbableCell,
      onClick,
      onDoubleClick,
      onMouseEnter,
      onMouseLeave
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);
  const rootProps = useGridRootProps();
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);
  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
  const handleRef = useForkRef(ref, refProp);
  const ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based

  const ownerState = {
    selected,
    isLastVisible,
    classes: rootProps.classes,
    editing: apiRef.current.getRowMode(rowId) === GridRowModes.Edit,
    editable: rootProps.editMode === GridEditModes.Row,
    rowHeight
  };
  const classes = useUtilityClasses(ownerState);
  React.useLayoutEffect(() => {
    if (rowHeight === 'auto' && ref.current && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, ref.current.clientHeight, position);
    }
  }, [apiRef, rowHeight, rowId, position]);
  React.useLayoutEffect(() => {
    if (currentPage.range) {
      // The index prop is relative to the rows from all pages. As example, the index prop of the
      // first row is 5 if `paginationModel.pageSize=5` and `paginationModel.page=1`. However, the index used by the virtualization
      // doesn't care about pagination and considers the rows from the current page only, so the
      // first row always has index=0. We need to subtract the index of the first row to make it
      // compatible with the index used by the virtualization.
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
      // pinned rows are not part of the visible rows
      if (rowIndex != null) {
        apiRef.current.unstable_setLastMeasuredRowIndex(rowIndex);
      }
    }
    const rootElement = ref.current;
    const hasFixedHeight = rowHeight !== 'auto';
    if (!rootElement || hasFixedHeight || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const resizeObserver = new ResizeObserver(entries => {
      const [entry] = entries;
      const height = entry.borderBoxSize && entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.contentRect.height;
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, height, position);
    });
    resizeObserver.observe(rootElement);
    return () => resizeObserver.disconnect();
  }, [apiRef, currentPage.range, index, rowHeight, rowId, position]);
  const publish = React.useCallback((eventName, propHandler) => event => {
    // Ignore portal
    // The target is not an element when triggered by a Select inside the cell
    // See https://github.com/mui/material-ui/issues/10534
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    // The row might have been deleted
    if (!apiRef.current.getRow(rowId)) {
      return;
    }
    apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(rowId), event);
    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, rowId]);
  const publishClick = React.useCallback(event => {
    const cell = findParentElementFromClassName(event.target, gridClasses.cell);
    const field = cell?.getAttribute('data-field');

    // Check if the field is available because the cell that fills the empty
    // space of the row has no field.
    if (field) {
      // User clicked in the checkbox added by checkboxSelection
      if (field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        return;
      }

      // User opened a detail panel
      if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
        return;
      }

      // User reorders a row
      if (field === '__reorder__') {
        return;
      }

      // User is editing a cell
      if (apiRef.current.getCellMode(rowId, field) === GridCellModes.Edit) {
        return;
      }

      // User clicked a button from the "actions" column type
      const column = apiRef.current.getColumn(field);
      if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
        return;
      }
    }
    publish('rowClick', onClick)(event);
  }, [apiRef, onClick, publish, rowId]);
  const {
    slots,
    slotProps,
    classes: rootClasses,
    disableColumnReorder,
    getCellClassName
  } = rootProps;
  const rowReordering = rootProps.rowReordering;
  const CellComponent = slots.cell;
  const getCell = React.useCallback((column, cellProps) => {
    const cellParams = apiRef.current.getCellParams(rowId, column.field);
    const classNames = apiRef.current.unstable_applyPipeProcessors('cellClassName', [], {
      id: rowId,
      field: column.field
    });
    const disableDragEvents = disableColumnReorder && column.disableReorder || !rowReordering && !!sortModel.length && treeDepth > 1 && Object.keys(editRowsState).length > 0;
    if (column.cellClassName) {
      classNames.push(clsx(typeof column.cellClassName === 'function' ? column.cellClassName(cellParams) : column.cellClassName));
    }
    const editCellState = editRowsState[rowId] ? editRowsState[rowId][column.field] : null;
    let content;
    if (editCellState == null && column.renderCell) {
      content = column.renderCell(_extends({}, cellParams, {
        api: apiRef.current
      }));
      // TODO move to GridCell
      classNames.push(clsx(gridClasses['cell--withRenderer'], rootClasses?.['cell--withRenderer']));
    }
    if (editCellState != null && column.renderEditCell) {
      const updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, column.field);
      const editCellStateRest = _objectWithoutPropertiesLoose(editCellState, _excluded2);
      const params = _extends({}, cellParams, {
        row: updatedRow
      }, editCellStateRest, {
        api: apiRef.current
      });
      content = column.renderEditCell(params);
      // TODO move to GridCell
      classNames.push(clsx(gridClasses['cell--editing'], rootClasses?.['cell--editing']));
    }
    if (getCellClassName) {
      // TODO move to GridCell
      classNames.push(getCellClassName(cellParams));
    }
    const hasFocus = focusedCell === column.field;
    const tabIndex = tabbableCell === column.field ? 0 : -1;
    const isSelected = apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
      id: rowId,
      field: column.field
    });
    return /*#__PURE__*/_jsx(CellComponent, _extends({
      value: cellParams.value,
      field: column.field,
      width: cellProps.width,
      rowId: rowId,
      height: rowHeight,
      showRightBorder: cellProps.showRightBorder,
      formattedValue: cellParams.formattedValue,
      align: column.align || 'left',
      cellMode: cellParams.cellMode,
      colIndex: cellProps.indexRelativeToAllColumns,
      isEditable: cellParams.isEditable,
      isSelected: isSelected,
      hasFocus: hasFocus,
      tabIndex: tabIndex,
      className: clsx(classNames),
      colSpan: cellProps.colSpan,
      disableDragEvents: disableDragEvents
    }, slotProps?.cell, {
      children: content
    }), column.field);
  }, [apiRef, rowId, disableColumnReorder, rowReordering, sortModel.length, treeDepth, editRowsState, getCellClassName, focusedCell, tabbableCell, CellComponent, rowHeight, slotProps?.cell, rootClasses]);
  const sizes = apiRef.current.unstable_getRowInternalSizes(rowId);
  let minHeight = rowHeight;
  if (minHeight === 'auto' && sizes) {
    let numberOfBaseSizes = 0;
    const maximumSize = Object.entries(sizes).reduce((acc, [key, size]) => {
      const isBaseHeight = /^base[A-Z]/.test(key);
      if (!isBaseHeight) {
        return acc;
      }
      numberOfBaseSizes += 1;
      if (size > acc) {
        return size;
      }
      return acc;
    }, 0);
    if (maximumSize > 0 && numberOfBaseSizes > 1) {
      minHeight = maximumSize;
    }
  }
  const style = _extends({}, styleProp, {
    maxHeight: rowHeight === 'auto' ? 'none' : rowHeight,
    // max-height doesn't support "auto"
    minHeight
  });
  if (sizes?.spacingTop) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
    style[property] = sizes.spacingTop;
  }
  if (sizes?.spacingBottom) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
    let propertyValue = style[property];
    // avoid overriding existing value
    if (typeof propertyValue !== 'number') {
      propertyValue = parseInt(propertyValue || '0', 10);
    }
    propertyValue += sizes.spacingBottom;
    style[property] = propertyValue;
  }
  const rowClassNames = apiRef.current.unstable_applyPipeProcessors('rowClassName', [], rowId);
  if (typeof rootProps.getRowClassName === 'function') {
    const indexRelativeToCurrentPage = index - (currentPage.range?.firstRowIndex || 0);
    const rowParams = _extends({}, apiRef.current.getRowParams(rowId), {
      isFirstVisible: indexRelativeToCurrentPage === 0,
      isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
      indexRelativeToCurrentPage
    });
    rowClassNames.push(rootProps.getRowClassName(rowParams));
  }
  const randomNumber = randomNumberBetween(10000, 20, 80);
  const rowType = apiRef.current.getRowNode(rowId).type;
  const cells = [];
  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;
    const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, indexRelativeToAllColumns);
    if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
      if (rowType !== 'skeletonRow') {
        const {
          colSpan,
          width
        } = cellColSpanInfo.cellProps;
        const cellProps = {
          width,
          colSpan,
          showRightBorder: rootProps.showCellVerticalBorder,
          indexRelativeToAllColumns
        };
        cells.push(getCell(column, cellProps));
      } else {
        const {
          width
        } = cellColSpanInfo.cellProps;
        const contentWidth = Math.round(randomNumber());
        cells.push( /*#__PURE__*/_jsx(rootProps.slots.skeletonCell, {
          width: width,
          contentWidth: contentWidth,
          field: column.field,
          align: column.align
        }, column.field));
      }
    }
  }
  const emptyCellWidth = containerWidth - columnsTotalWidth;
  const eventHandlers = row ? {
    onClick: publishClick,
    onDoubleClick: publish('rowDoubleClick', onDoubleClick),
    onMouseEnter: publish('rowMouseEnter', onMouseEnter),
    onMouseLeave: publish('rowMouseLeave', onMouseLeave)
  } : null;
  return /*#__PURE__*/_jsxs("div", _extends({
    ref: handleRef,
    "data-id": rowId,
    "data-rowindex": index,
    role: "row",
    className: clsx(...rowClassNames, classes.root, className),
    "aria-rowindex": ariaRowIndex,
    "aria-selected": selected,
    style: style
  }, eventHandlers, other, {
    children: [cells, emptyCellWidth > 0 && /*#__PURE__*/_jsx(EmptyCell, {
      width: emptyCellWidth
    })]
  }));
});
process.env.NODE_ENV !== "production" ? GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  containerWidth: PropTypes.number,
  firstColumnToRender: PropTypes.number,
  /**
   * Determines which cell has focus.
   * If `null`, no cell in this row has focus.
   */
  focusedCell: PropTypes.string,
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: PropTypes.number,
  isLastVisible: PropTypes.bool,
  lastColumnToRender: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  position: PropTypes.oneOf(['center', 'left', 'right']),
  renderedColumns: PropTypes.arrayOf(PropTypes.object),
  row: PropTypes.object,
  rowHeight: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selected: PropTypes.bool,
  /**
   * Determines which cell should be tabbable by having tabIndex=0.
   * If `null`, no cell in this row is in the tab sequence.
   */
  tabbableCell: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.object)
} : void 0;
export { GridRow };