import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
var _excluded = ["style"],
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
export function binarySearch(offset, positions) {
  var sliceStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var sliceEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : positions.length;
  if (positions.length <= 0) {
    return -1;
  }
  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }
  var pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  var itemOffset = positions[pivot];
  return offset <= itemOffset ? binarySearch(offset, positions, sliceStart, pivot) : binarySearch(offset, positions, pivot + 1, sliceEnd);
}
function exponentialSearch(offset, positions, index) {
  var interval = 1;
  while (index < positions.length && Math.abs(positions[index]) < offset) {
    index += interval;
    interval *= 2;
  }
  return binarySearch(offset, positions, Math.floor(index / 2), Math.min(index, positions.length));
}
export var getRenderableIndexes = function getRenderableIndexes(_ref) {
  var firstIndex = _ref.firstIndex,
    lastIndex = _ref.lastIndex,
    buffer = _ref.buffer,
    minFirstIndex = _ref.minFirstIndex,
    maxLastIndex = _ref.maxLastIndex;
  return [clamp(firstIndex - buffer, minFirstIndex, maxLastIndex), clamp(lastIndex + buffer, minFirstIndex, maxLastIndex)];
};
var areRenderContextsEqual = function areRenderContextsEqual(context1, context2) {
  if (context1 === context2) {
    return true;
  }
  return context1.firstRowIndex === context2.firstRowIndex && context1.lastRowIndex === context2.lastRowIndex && context1.firstColumnIndex === context2.firstColumnIndex && context1.lastColumnIndex === context2.lastColumnIndex;
};
export var useGridVirtualScroller = function useGridVirtualScroller(props) {
  var _currentPage$range3, _currentPage$range4;
  var apiRef = useGridPrivateApiContext();
  var rootProps = useGridRootProps();
  var visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  var ref = props.ref,
    disableVirtualization = props.disableVirtualization,
    onRenderZonePositioning = props.onRenderZonePositioning,
    _props$renderZoneMinC = props.renderZoneMinColumnIndex,
    renderZoneMinColumnIndex = _props$renderZoneMinC === void 0 ? 0 : _props$renderZoneMinC,
    _props$renderZoneMaxC = props.renderZoneMaxColumnIndex,
    renderZoneMaxColumnIndex = _props$renderZoneMaxC === void 0 ? visibleColumns.length : _props$renderZoneMaxC,
    getRowProps = props.getRowProps;
  var theme = useTheme();
  var columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  var columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  var cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
  var cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
  var rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  var selectedRowsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  var currentPage = useGridVisibleRows(apiRef, rootProps);
  var renderZoneRef = React.useRef(null);
  var rootRef = React.useRef(null);
  var handleRef = useForkRef(ref, rootRef);
  var _React$useState = React.useState(null),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    renderContext = _React$useState2[0],
    setRenderContext = _React$useState2[1];
  var prevRenderContext = React.useRef(renderContext);
  var scrollPosition = React.useRef({
    top: 0,
    left: 0
  });
  var _React$useState3 = React.useState({
      width: null,
      height: null
    }),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    containerDimensions = _React$useState4[0],
    setContainerDimensions = _React$useState4[1];
  var prevTotalWidth = React.useRef(columnsTotalWidth);
  var rowStyleCache = React.useRef({});
  var prevGetRowProps = React.useRef();
  var prevRootRowStyle = React.useRef();
  var getRenderedColumnsRef = React.useRef(defaultMemoize(function (columns, firstColumnToRender, lastColumnToRender) {
    return columns.slice(firstColumnToRender, lastColumnToRender);
  }));
  var getNearestIndexToRender = React.useCallback(function (offset) {
    var _currentPage$range, _currentPage$range2;
    var lastMeasuredIndexRelativeToAllRows = apiRef.current.getLastMeasuredRowIndex();
    var allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
    if ((_currentPage$range = currentPage.range) != null && _currentPage$range.lastRowIndex && !allRowsMeasured) {
      // Check if all rows in this page are already measured
      allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= currentPage.range.lastRowIndex;
    }
    var lastMeasuredIndexRelativeToCurrentPage = clamp(lastMeasuredIndexRelativeToAllRows - (((_currentPage$range2 = currentPage.range) == null ? void 0 : _currentPage$range2.firstRowIndex) || 0), 0, rowsMeta.positions.length);
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
  var computeRenderContext = React.useCallback(function () {
    if (disableVirtualization) {
      return {
        firstRowIndex: 0,
        lastRowIndex: currentPage.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: visibleColumns.length
      };
    }
    var _ref2 = scrollPosition.current,
      top = _ref2.top,
      left = _ref2.left;

    // Clamp the value because the search may return an index out of bounds.
    // In the last index, this is not needed because Array.slice doesn't include it.
    var firstRowIndex = Math.min(getNearestIndexToRender(top), rowsMeta.positions.length - 1);
    var lastRowIndex = rootProps.autoHeight ? firstRowIndex + currentPage.rows.length : getNearestIndexToRender(top + containerDimensions.height);
    var hasRowWithAutoHeight = false;
    var firstColumnIndex = 0;
    var lastColumnIndex = columnPositions.length;
    var _getRenderableIndexes = getRenderableIndexes({
        firstIndex: firstRowIndex,
        lastIndex: lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer
      }),
      _getRenderableIndexes2 = _slicedToArray(_getRenderableIndexes, 2),
      firstRowToRender = _getRenderableIndexes2[0],
      lastRowToRender = _getRenderableIndexes2[1];
    for (var i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
      var row = currentPage.rows[i];
      hasRowWithAutoHeight = apiRef.current.rowHasAutoHeight(row.id);
    }
    if (!hasRowWithAutoHeight) {
      firstColumnIndex = binarySearch(Math.abs(left), columnPositions);
      lastColumnIndex = binarySearch(Math.abs(left) + containerDimensions.width, columnPositions);
    }
    return {
      firstRowIndex: firstRowIndex,
      lastRowIndex: lastRowIndex,
      firstColumnIndex: firstColumnIndex,
      lastColumnIndex: lastColumnIndex
    };
  }, [disableVirtualization, getNearestIndexToRender, rowsMeta.positions.length, rootProps.autoHeight, rootProps.rowBuffer, currentPage.rows, columnPositions, visibleColumns.length, apiRef, containerDimensions]);
  useEnhancedEffect(function () {
    if (disableVirtualization) {
      renderZoneRef.current.style.transform = "translate3d(0px, 0px, 0px)";
    } else {
      // TODO a scroll reset should not be necessary
      rootRef.current.scrollLeft = 0;
      rootRef.current.scrollTop = 0;
    }
  }, [disableVirtualization]);
  useEnhancedEffect(function () {
    setContainerDimensions({
      width: rootRef.current.clientWidth,
      height: rootRef.current.clientHeight
    });
  }, [rowsMeta.currentPageTotalHeight]);
  var handleResize = React.useCallback(function (params) {
    setContainerDimensions({
      width: params.width,
      height: params.height
    });
  }, []);
  useGridApiEventHandler(apiRef, 'debouncedResize', handleResize);
  var updateRenderZonePosition = React.useCallback(function (nextRenderContext) {
    var _getRenderableIndexes3 = getRenderableIndexes({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer
      }),
      _getRenderableIndexes4 = _slicedToArray(_getRenderableIndexes3, 2),
      firstRowToRender = _getRenderableIndexes4[0],
      lastRowToRender = _getRenderableIndexes4[1];
    var _getRenderableIndexes5 = getRenderableIndexes({
        firstIndex: nextRenderContext.firstColumnIndex,
        lastIndex: nextRenderContext.lastColumnIndex,
        minFirstIndex: renderZoneMinColumnIndex,
        maxLastIndex: renderZoneMaxColumnIndex,
        buffer: rootProps.columnBuffer
      }),
      _getRenderableIndexes6 = _slicedToArray(_getRenderableIndexes5, 1),
      initialFirstColumnToRender = _getRenderableIndexes6[0];
    var firstColumnToRender = getFirstNonSpannedColumnToRender({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var direction = theme.direction === 'ltr' ? 1 : -1;
    var top = gridRowsMetaSelector(apiRef.current.state).positions[firstRowToRender];
    var left = direction * gridColumnPositionsSelector(apiRef)[firstColumnToRender]; // Call directly the selector because it might be outdated when this method is called
    renderZoneRef.current.style.transform = "translate3d(".concat(left, "px, ").concat(top, "px, 0px)");
    if (typeof onRenderZonePositioning === 'function') {
      onRenderZonePositioning({
        top: top,
        left: left
      });
    }
  }, [apiRef, currentPage.rows, onRenderZonePositioning, renderZoneMinColumnIndex, renderZoneMaxColumnIndex, rootProps.columnBuffer, rootProps.rowBuffer, theme.direction]);
  var updateRenderContext = React.useCallback(function (nextRenderContext) {
    if (prevRenderContext.current && areRenderContextsEqual(nextRenderContext, prevRenderContext.current)) {
      updateRenderZonePosition(nextRenderContext);
      return;
    }
    setRenderContext(nextRenderContext);
    updateRenderZonePosition(nextRenderContext);
    var _getRenderableIndexes7 = getRenderableIndexes({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer
      }),
      _getRenderableIndexes8 = _slicedToArray(_getRenderableIndexes7, 2),
      firstRowToRender = _getRenderableIndexes8[0],
      lastRowToRender = _getRenderableIndexes8[1];
    apiRef.current.publishEvent('renderedRowsIntervalChange', {
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender
    });
    prevRenderContext.current = nextRenderContext;
  }, [apiRef, setRenderContext, prevRenderContext, currentPage.rows.length, rootProps.rowBuffer, updateRenderZonePosition]);
  useEnhancedEffect(function () {
    if (containerDimensions.width == null) {
      return;
    }
    var initialRenderContext = computeRenderContext();
    updateRenderContext(initialRenderContext);
    var _ref3 = scrollPosition.current,
      top = _ref3.top,
      left = _ref3.left;
    var params = {
      top: top,
      left: left,
      renderContext: initialRenderContext
    };
    apiRef.current.publishEvent('scrollPositionChange', params);
  }, [apiRef, computeRenderContext, containerDimensions.width, updateRenderContext]);
  var handleScroll = function handleScroll(event) {
    var _event$currentTarget = event.currentTarget,
      scrollTop = _event$currentTarget.scrollTop,
      scrollLeft = _event$currentTarget.scrollLeft;
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
    var nextRenderContext = disableVirtualization ? prevRenderContext.current : computeRenderContext();
    var topRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstRowIndex - prevRenderContext.current.firstRowIndex);
    var bottomRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastRowIndex - prevRenderContext.current.lastRowIndex);
    var topColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstColumnIndex - prevRenderContext.current.firstColumnIndex);
    var bottomColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastColumnIndex - prevRenderContext.current.lastColumnIndex);
    var shouldSetState = topRowsScrolledSincePreviousRender >= rootProps.rowThreshold || bottomRowsScrolledSincePreviousRender >= rootProps.rowThreshold || topColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || bottomColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || prevTotalWidth.current !== columnsTotalWidth;
    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollTop,
      left: scrollLeft,
      renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current
    }, event);
    if (shouldSetState) {
      // Prevents batching render context changes
      ReactDOM.flushSync(function () {
        updateRenderContext(nextRenderContext);
      });
      prevTotalWidth.current = columnsTotalWidth;
    }
  };
  var handleWheel = function handleWheel(event) {
    apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
  };
  var handleTouchMove = function handleTouchMove(event) {
    apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
  };
  var getRows = function getRows() {
    var _rootProps$slotProps;
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      renderContext: renderContext
    };
    var nextRenderContext = params.renderContext,
      _params$minFirstColum = params.minFirstColumn,
      minFirstColumn = _params$minFirstColum === void 0 ? renderZoneMinColumnIndex : _params$minFirstColum,
      _params$maxLastColumn = params.maxLastColumn,
      maxLastColumn = _params$maxLastColumn === void 0 ? renderZoneMaxColumnIndex : _params$maxLastColumn,
      _params$availableSpac = params.availableSpace,
      availableSpace = _params$availableSpac === void 0 ? containerDimensions.width : _params$availableSpac,
      _params$rowIndexOffse = params.rowIndexOffset,
      rowIndexOffset = _params$rowIndexOffse === void 0 ? 0 : _params$rowIndexOffse,
      _params$position = params.position,
      position = _params$position === void 0 ? 'center' : _params$position;
    if (!nextRenderContext || availableSpace == null) {
      return null;
    }
    var rowBuffer = !disableVirtualization ? rootProps.rowBuffer : 0;
    var columnBuffer = !disableVirtualization ? rootProps.columnBuffer : 0;
    var _getRenderableIndexes9 = getRenderableIndexes({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rowBuffer
      }),
      _getRenderableIndexes10 = _slicedToArray(_getRenderableIndexes9, 2),
      firstRowToRender = _getRenderableIndexes10[0],
      lastRowToRender = _getRenderableIndexes10[1];
    var renderedRows = [];
    if (params.rows) {
      params.rows.forEach(function (row) {
        renderedRows.push(row);
        apiRef.current.calculateColSpan({
          rowId: row.id,
          minFirstColumn: minFirstColumn,
          maxLastColumn: maxLastColumn,
          columns: visibleColumns
        });
      });
    } else {
      if (!currentPage.range) {
        return null;
      }
      for (var i = firstRowToRender; i < lastRowToRender; i += 1) {
        var row = currentPage.rows[i];
        renderedRows.push(row);
        apiRef.current.calculateColSpan({
          rowId: row.id,
          minFirstColumn: minFirstColumn,
          maxLastColumn: maxLastColumn,
          columns: visibleColumns
        });
      }
    }
    var _getRenderableIndexes11 = getRenderableIndexes({
        firstIndex: nextRenderContext.firstColumnIndex,
        lastIndex: nextRenderContext.lastColumnIndex,
        minFirstIndex: minFirstColumn,
        maxLastIndex: maxLastColumn,
        buffer: columnBuffer
      }),
      _getRenderableIndexes12 = _slicedToArray(_getRenderableIndexes11, 2),
      initialFirstColumnToRender = _getRenderableIndexes12[0],
      lastColumnToRender = _getRenderableIndexes12[1];
    var firstColumnToRender = getFirstNonSpannedColumnToRender({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var renderedColumns = getRenderedColumnsRef.current(visibleColumns, firstColumnToRender, lastColumnToRender);
    var _ref4 = ((_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.row) || {},
      rootRowStyle = _ref4.style,
      rootRowProps = _objectWithoutProperties(_ref4, _excluded);
    var invalidatesCachedRowStyle = prevGetRowProps.current !== getRowProps || prevRootRowStyle.current !== rootRowStyle;
    if (invalidatesCachedRowStyle) {
      rowStyleCache.current = {};
    }
    var rows = [];
    for (var i = 0; i < renderedRows.length; i += 1) {
      var _currentPage$range5;
      var _renderedRows$i = renderedRows[i],
        _id = _renderedRows$i.id,
        _model = _renderedRows$i.model;
      var lastVisibleRowIndex = firstRowToRender + i === currentPage.rows.length - 1;
      var baseRowHeight = !apiRef.current.rowHasAutoHeight(_id) ? apiRef.current.unstable_getRowHeight(_id) : 'auto';
      var isSelected = void 0;
      if (selectedRowsLookup[_id] == null) {
        isSelected = false;
      } else {
        isSelected = apiRef.current.isRowSelectable(_id);
      }
      var focusedCell = cellFocus !== null && cellFocus.id === _id ? cellFocus.field : null;
      var tabbableCell = null;
      if (cellTabIndex !== null && cellTabIndex.id === _id) {
        var cellParams = apiRef.current.getCellParams(_id, cellTabIndex.field);
        tabbableCell = cellParams.cellMode === 'view' ? cellTabIndex.field : null;
      }
      var _ref5 = typeof getRowProps === 'function' && getRowProps(_id, _model) || {},
        rowStyle = _ref5.style,
        rowProps = _objectWithoutProperties(_ref5, _excluded2);
      if (!rowStyleCache.current[_id]) {
        var style = _extends({}, rowStyle, rootRowStyle);
        rowStyleCache.current[_id] = style;
      }
      rows.push( /*#__PURE__*/_jsx(rootProps.slots.row, _extends({
        row: _model,
        rowId: _id,
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
        style: rowStyleCache.current[_id]
      }), _id));
    }
    prevGetRowProps.current = getRowProps;
    prevRootRowStyle.current = rootRowStyle;
    return rows;
  };
  var needsHorizontalScrollbar = containerDimensions.width && columnsTotalWidth > containerDimensions.width;
  var contentSize = React.useMemo(function () {
    // In cases where the columns exceed the available width,
    // the horizontal scrollbar should be shown even when there're no rows.
    // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
    var height = Math.max(rowsMeta.currentPageTotalHeight, 1);
    var shouldExtendContent = false;
    if (rootRef != null && rootRef.current && height <= (rootRef == null ? void 0 : rootRef.current.clientHeight)) {
      shouldExtendContent = true;
    }
    var size = {
      width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
      height: height,
      minHeight: shouldExtendContent ? '100%' : 'auto'
    };
    return size;
  }, [rootRef, columnsTotalWidth, rowsMeta.currentPageTotalHeight, needsHorizontalScrollbar]);
  React.useEffect(function () {
    apiRef.current.publishEvent('virtualScrollerContentSizeChange');
  }, [apiRef, contentSize]);
  if (rootProps.autoHeight && currentPage.rows.length === 0) {
    contentSize.height = getMinimalContentHeight(apiRef, rootProps.rowHeight); // Give room to show the overlay when there no rows.
  }

  var rootStyle = {};
  if (!needsHorizontalScrollbar) {
    rootStyle.overflowX = 'hidden';
  }
  if (rootProps.autoHeight) {
    rootStyle.overflowY = 'hidden';
  }
  var getRenderContext = React.useCallback(function () {
    return prevRenderContext.current;
  }, []);
  apiRef.current.register('private', {
    getRenderContext: getRenderContext
  });
  return {
    renderContext: renderContext,
    updateRenderZonePosition: updateRenderZonePosition,
    getRows: getRows,
    getRootProps: function getRootProps() {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _ref6$style = _ref6.style,
        style = _ref6$style === void 0 ? {} : _ref6$style,
        other = _objectWithoutProperties(_ref6, _excluded3);
      return _extends({
        ref: handleRef,
        onScroll: handleScroll,
        onWheel: handleWheel,
        onTouchMove: handleTouchMove,
        style: _extends({}, style, rootStyle)
      }, other);
    },
    getContentProps: function getContentProps() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$style = _ref7.style,
        style = _ref7$style === void 0 ? {} : _ref7$style;
      return {
        style: _extends({}, style, contentSize)
      };
    },
    getRenderZoneProps: function getRenderZoneProps() {
      return {
        ref: renderZoneRef
      };
    }
  };
};