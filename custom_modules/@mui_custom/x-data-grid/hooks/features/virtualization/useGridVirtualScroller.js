import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["style"],
  _excluded2 = ["style"],
  _excluded3 = ["style"];
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { unstable_useForkRef as useForkRef, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import { defaultMemoize } from 'reselect';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridVisibleColumnDefinitionsSelector, gridColumnsTotalWidthSelector, gridColumnPositionsSelector } from '../columns/gridColumnsSelector';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { clamp } from '../../../utils/utils';
import { selectedIdsLookupSelector } from '../rowSelection/gridRowSelectionSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { getFirstNonSpannedColumnToRender } from '../columns/gridColumnsUtils';
import { getMinimalContentHeight } from '../rows/gridRowsUtils';
import { jsx as _jsx } from "react/jsx-runtime";
// Uses binary search to avoid looping through all possible positions
export function binarySearch(offset, positions, sliceStart = 0, sliceEnd = positions.length) {
  if (positions.length <= 0) {
    return -1;
  }
  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }
  const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  const itemOffset = positions[pivot];
  return offset <= itemOffset ? binarySearch(offset, positions, sliceStart, pivot) : binarySearch(offset, positions, pivot + 1, sliceEnd);
}
function exponentialSearch(offset, positions, index) {
  let interval = 1;
  while (index < positions.length && Math.abs(positions[index]) < offset) {
    index += interval;
    interval *= 2;
  }
  return binarySearch(offset, positions, Math.floor(index / 2), Math.min(index, positions.length));
}
export const getRenderableIndexes = ({
  firstIndex,
  lastIndex,
  buffer,
  minFirstIndex,
  maxLastIndex
}) => {
  return [clamp(firstIndex - buffer, minFirstIndex, maxLastIndex), clamp(lastIndex + buffer, minFirstIndex, maxLastIndex)];
};
const areRenderContextsEqual = (context1, context2) => {
  if (context1 === context2) {
    return true;
  }
  return context1.firstRowIndex === context2.firstRowIndex && context1.lastRowIndex === context2.lastRowIndex && context1.firstColumnIndex === context2.firstColumnIndex && context1.lastColumnIndex === context2.lastColumnIndex;
};
export const useGridVirtualScroller = props => {
  var _currentPage$range3, _currentPage$range4;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const {
    ref,
    disableVirtualization,
    onRenderZonePositioning,
    renderZoneMinColumnIndex = 0,
    renderZoneMaxColumnIndex = visibleColumns.length,
    getRowProps
  } = props;
  const theme = useTheme();
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
  const cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const selectedRowsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const renderZoneRef = React.useRef(null);
  const rootRef = React.useRef(null);
  const handleRef = useForkRef(ref, rootRef);
  const [renderContext, setRenderContext] = React.useState(null);
  const prevRenderContext = React.useRef(renderContext);
  const scrollPosition = React.useRef({
    top: 0,
    left: 0
  });
  const [containerDimensions, setContainerDimensions] = React.useState({
    width: null,
    height: null
  });
  const prevTotalWidth = React.useRef(columnsTotalWidth);
  const rowStyleCache = React.useRef({});
  const prevGetRowProps = React.useRef();
  const prevRootRowStyle = React.useRef();
  const getRenderedColumnsRef = React.useRef(defaultMemoize((columns, firstColumnToRender, lastColumnToRender) => {
    return columns.slice(firstColumnToRender, lastColumnToRender);
  }));
  const getNearestIndexToRender = React.useCallback(offset => {
    var _currentPage$range, _currentPage$range2;
    const lastMeasuredIndexRelativeToAllRows = apiRef.current.getLastMeasuredRowIndex();
    let allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
    if ((_currentPage$range = currentPage.range) != null && _currentPage$range.lastRowIndex && !allRowsMeasured) {
      // Check if all rows in this page are already measured
      allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= currentPage.range.lastRowIndex;
    }
    const lastMeasuredIndexRelativeToCurrentPage = clamp(lastMeasuredIndexRelativeToAllRows - (((_currentPage$range2 = currentPage.range) == null ? void 0 : _currentPage$range2.firstRowIndex) || 0), 0, rowsMeta.positions.length);
    if (allRowsMeasured || rowsMeta.positions[lastMeasuredIndexRelativeToCurrentPage] >= offset) {
      // If all rows were measured (when no row has "auto" as height) or all rows before the offset
      // were measured, then use a binary search because it's faster.
      return binarySearch(offset, rowsMeta.positions);
    }

    // Otherwise, use an exponential search.
    // If rows have "auto" as height, their positions will be based on estimated heights.
    // In this case, we can skip several steps until we find a position higher than the offset.
    // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
    return exponentialSearch(offset, rowsMeta.positions, lastMeasuredIndexRelativeToCurrentPage);
  }, [apiRef, (_currentPage$range3 = currentPage.range) == null ? void 0 : _currentPage$range3.firstRowIndex, (_currentPage$range4 = currentPage.range) == null ? void 0 : _currentPage$range4.lastRowIndex, rowsMeta.positions]);
  const computeRenderContext = React.useCallback(() => {
    if (disableVirtualization) {
      return {
        firstRowIndex: 0,
        lastRowIndex: currentPage.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: visibleColumns.length
      };
    }
    const {
      top,
      left
    } = scrollPosition.current;

    // Clamp the value because the search may return an index out of bounds.
    // In the last index, this is not needed because Array.slice doesn't include it.
    const firstRowIndex = Math.min(getNearestIndexToRender(top), rowsMeta.positions.length - 1);
    const lastRowIndex = rootProps.autoHeight ? firstRowIndex + currentPage.rows.length : getNearestIndexToRender(top + containerDimensions.height);
    let hasRowWithAutoHeight = false;
    let firstColumnIndex = 0;
    let lastColumnIndex = columnPositions.length;
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: firstRowIndex,
      lastIndex: lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    for (let i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
      const row = currentPage.rows[i];
      hasRowWithAutoHeight = apiRef.current.rowHasAutoHeight(row.id);
    }
    if (!hasRowWithAutoHeight) {
      firstColumnIndex = binarySearch(Math.abs(left), columnPositions);
      lastColumnIndex = binarySearch(Math.abs(left) + containerDimensions.width, columnPositions);
    }
    return {
      firstRowIndex,
      lastRowIndex,
      firstColumnIndex,
      lastColumnIndex
    };
  }, [disableVirtualization, getNearestIndexToRender, rowsMeta.positions.length, rootProps.autoHeight, rootProps.rowBuffer, currentPage.rows, columnPositions, visibleColumns.length, apiRef, containerDimensions]);
  useEnhancedEffect(() => {
    if (disableVirtualization) {
      renderZoneRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
    } else {
      // TODO a scroll reset should not be necessary
      rootRef.current.scrollLeft = 0;
      rootRef.current.scrollTop = 0;
    }
  }, [disableVirtualization]);
  useEnhancedEffect(() => {
    setContainerDimensions({
      width: rootRef.current.clientWidth,
      height: rootRef.current.clientHeight
    });
  }, [rowsMeta.currentPageTotalHeight]);
  const handleResize = React.useCallback(params => {
    setContainerDimensions({
      width: params.width,
      height: params.height
    });
  }, []);
  useGridApiEventHandler(apiRef, 'debouncedResize', handleResize);
  const updateRenderZonePosition = React.useCallback(nextRenderContext => {
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    const [initialFirstColumnToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: renderZoneMinColumnIndex,
      maxLastIndex: renderZoneMaxColumnIndex,
      buffer: rootProps.columnBuffer
    });
    const firstColumnToRender = getFirstNonSpannedColumnToRender({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const direction = theme.direction === 'ltr' ? 1 : -1;
    const top = gridRowsMetaSelector(apiRef.current.state).positions[firstRowToRender];
    const left = direction * gridColumnPositionsSelector(apiRef)[firstColumnToRender]; // Call directly the selector because it might be outdated when this method is called
    renderZoneRef.current.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
    if (typeof onRenderZonePositioning === 'function') {
      onRenderZonePositioning({
        top,
        left
      });
    }
  }, [apiRef, currentPage.rows, onRenderZonePositioning, renderZoneMinColumnIndex, renderZoneMaxColumnIndex, rootProps.columnBuffer, rootProps.rowBuffer, theme.direction]);
  const updateRenderContext = React.useCallback(nextRenderContext => {
    if (prevRenderContext.current && areRenderContextsEqual(nextRenderContext, prevRenderContext.current)) {
      updateRenderZonePosition(nextRenderContext);
      return;
    }
    setRenderContext(nextRenderContext);
    updateRenderZonePosition(nextRenderContext);
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    apiRef.current.publishEvent('renderedRowsIntervalChange', {
      firstRowToRender,
      lastRowToRender
    });
    prevRenderContext.current = nextRenderContext;
  }, [apiRef, setRenderContext, prevRenderContext, currentPage.rows.length, rootProps.rowBuffer, updateRenderZonePosition]);
  useEnhancedEffect(() => {
    if (containerDimensions.width == null) {
      return;
    }
    const initialRenderContext = computeRenderContext();
    updateRenderContext(initialRenderContext);
    const {
      top,
      left
    } = scrollPosition.current;
    const params = {
      top,
      left,
      renderContext: initialRenderContext
    };
    apiRef.current.publishEvent('scrollPositionChange', params);
  }, [apiRef, computeRenderContext, containerDimensions.width, updateRenderContext]);
  const handleScroll = event => {
    const {
      scrollTop,
      scrollLeft
    } = event.currentTarget;
    scrollPosition.current.top = scrollTop;
    scrollPosition.current.left = scrollLeft;

    // On iOS and macOS, negative offsets are possible when swiping past the start
    if (!prevRenderContext.current || scrollTop < 0) {
      return;
    }
    if (theme.direction === 'ltr') {
      if (scrollLeft < 0) {
        return;
      }
    }
    if (theme.direction === 'rtl') {
      if (scrollLeft > 0) {
        return;
      }
    }

    // When virtualization is disabled, the context never changes during scroll
    const nextRenderContext = disableVirtualization ? prevRenderContext.current : computeRenderContext();
    const topRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstRowIndex - prevRenderContext.current.firstRowIndex);
    const bottomRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastRowIndex - prevRenderContext.current.lastRowIndex);
    const topColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstColumnIndex - prevRenderContext.current.firstColumnIndex);
    const bottomColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastColumnIndex - prevRenderContext.current.lastColumnIndex);
    const shouldSetState = topRowsScrolledSincePreviousRender >= rootProps.rowThreshold || bottomRowsScrolledSincePreviousRender >= rootProps.rowThreshold || topColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || bottomColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || prevTotalWidth.current !== columnsTotalWidth;
    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollTop,
      left: scrollLeft,
      renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current
    }, event);
    if (shouldSetState) {
      // Prevents batching render context changes
      ReactDOM.flushSync(() => {
        updateRenderContext(nextRenderContext);
      });
      prevTotalWidth.current = columnsTotalWidth;
    }
  };
  const handleWheel = event => {
    apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
  };
  const handleTouchMove = event => {
    apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
  };
  const getRows = (params = {
    renderContext
  }) => {
    var _rootProps$slotProps;
    const {
      renderContext: nextRenderContext,
      minFirstColumn = renderZoneMinColumnIndex,
      maxLastColumn = renderZoneMaxColumnIndex,
      availableSpace = containerDimensions.width,
      rowIndexOffset = 0,
      position = 'center'
    } = params;
    if (!nextRenderContext || availableSpace == null) {
      return null;
    }
    const rowBuffer = !disableVirtualization ? rootProps.rowBuffer : 0;
    const columnBuffer = !disableVirtualization ? rootProps.columnBuffer : 0;
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rowBuffer
    });
    const renderedRows = [];
    if (params.rows) {
      params.rows.forEach(row => {
        renderedRows.push(row);
        apiRef.current.calculateColSpan({
          rowId: row.id,
          minFirstColumn,
          maxLastColumn,
          columns: visibleColumns
        });
      });
    } else {
      if (!currentPage.range) {
        return null;
      }
      for (let i = firstRowToRender; i < lastRowToRender; i += 1) {
        const row = currentPage.rows[i];
        renderedRows.push(row);
        apiRef.current.calculateColSpan({
          rowId: row.id,
          minFirstColumn,
          maxLastColumn,
          columns: visibleColumns
        });
      }
    }
    const [initialFirstColumnToRender, lastColumnToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: minFirstColumn,
      maxLastIndex: maxLastColumn,
      buffer: columnBuffer
    });
    const firstColumnToRender = getFirstNonSpannedColumnToRender({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const renderedColumns = getRenderedColumnsRef.current(visibleColumns, firstColumnToRender, lastColumnToRender);
    const _ref = ((_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.row) || {},
      {
        style: rootRowStyle
      } = _ref,
      rootRowProps = _objectWithoutPropertiesLoose(_ref, _excluded);
    const invalidatesCachedRowStyle = prevGetRowProps.current !== getRowProps || prevRootRowStyle.current !== rootRowStyle;
    if (invalidatesCachedRowStyle) {
      rowStyleCache.current = {};
    }
    const rows = [];
    for (let i = 0; i < renderedRows.length; i += 1) {
      var _currentPage$range5;
      const {
        id,
        model
      } = renderedRows[i];
      const lastVisibleRowIndex = firstRowToRender + i === currentPage.rows.length - 1;
      const baseRowHeight = !apiRef.current.rowHasAutoHeight(id) ? apiRef.current.unstable_getRowHeight(id) : 'auto';
      let isSelected;
      if (selectedRowsLookup[id] == null) {
        isSelected = false;
      } else {
        isSelected = apiRef.current.isRowSelectable(id);
      }
      const focusedCell = cellFocus !== null && cellFocus.id === id ? cellFocus.field : null;
      let tabbableCell = null;
      if (cellTabIndex !== null && cellTabIndex.id === id) {
        const cellParams = apiRef.current.getCellParams(id, cellTabIndex.field);
        tabbableCell = cellParams.cellMode === 'view' ? cellTabIndex.field : null;
      }
      const _ref2 = typeof getRowProps === 'function' && getRowProps(id, model) || {},
        {
          style: rowStyle
        } = _ref2,
        rowProps = _objectWithoutPropertiesLoose(_ref2, _excluded2);
      if (!rowStyleCache.current[id]) {
        const style = _extends({}, rowStyle, rootRowStyle);
        rowStyleCache.current[id] = style;
      }
      rows.push( /*#__PURE__*/_jsx(rootProps.slots.row, _extends({
        row: model,
        rowId: id,
        rowHeight: baseRowHeight,
        focusedCell: focusedCell,
        tabbableCell: tabbableCell,
        renderedColumns: renderedColumns,
        visibleColumns: visibleColumns,
        firstColumnToRender: firstColumnToRender,
        lastColumnToRender: lastColumnToRender,
        selected: isSelected,
        index: rowIndexOffset + ((currentPage == null ? void 0 : (_currentPage$range5 = currentPage.range) == null ? void 0 : _currentPage$range5.firstRowIndex) || 0) + firstRowToRender + i,
        containerWidth: availableSpace,
        isLastVisible: lastVisibleRowIndex,
        position: position
      }, rowProps, rootRowProps, {
        style: rowStyleCache.current[id]
      }), id));
    }
    prevGetRowProps.current = getRowProps;
    prevRootRowStyle.current = rootRowStyle;
    return rows;
  };
  const needsHorizontalScrollbar = containerDimensions.width && columnsTotalWidth > containerDimensions.width;
  const contentSize = React.useMemo(() => {
    // In cases where the columns exceed the available width,
    // the horizontal scrollbar should be shown even when there're no rows.
    // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
    const height = Math.max(rowsMeta.currentPageTotalHeight, 1);
    let shouldExtendContent = false;
    if (rootRef != null && rootRef.current && height <= (rootRef == null ? void 0 : rootRef.current.clientHeight)) {
      shouldExtendContent = true;
    }
    const size = {
      width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
      height,
      minHeight: shouldExtendContent ? '100%' : 'auto'
    };
    return size;
  }, [rootRef, columnsTotalWidth, rowsMeta.currentPageTotalHeight, needsHorizontalScrollbar]);
  React.useEffect(() => {
    apiRef.current.publishEvent('virtualScrollerContentSizeChange');
  }, [apiRef, contentSize]);
  if (rootProps.autoHeight && currentPage.rows.length === 0) {
    contentSize.height = getMinimalContentHeight(apiRef, rootProps.rowHeight); // Give room to show the overlay when there no rows.
  }

  const rootStyle = {};
  if (!needsHorizontalScrollbar) {
    rootStyle.overflowX = 'hidden';
  }
  if (rootProps.autoHeight) {
    rootStyle.overflowY = 'hidden';
  }
  const getRenderContext = React.useCallback(() => {
    return prevRenderContext.current;
  }, []);
  apiRef.current.register('private', {
    getRenderContext
  });
  return {
    renderContext,
    updateRenderZonePosition,
    getRows,
    getRootProps: (_ref3 = {}) => {
      let {
          style = {}
        } = _ref3,
        other = _objectWithoutPropertiesLoose(_ref3, _excluded3);
      return _extends({
        ref: handleRef,
        onScroll: handleScroll,
        onWheel: handleWheel,
        onTouchMove: handleTouchMove,
        style: _extends({}, style, rootStyle)
      }, other);
    },
    getContentProps: ({
      style = {}
    } = {}) => ({
      style: _extends({}, style, contentSize)
    }),
    getRenderZoneProps: () => ({
      ref: renderZoneRef
    })
  };
};