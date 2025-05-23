"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.binarySearch = binarySearch;
exports.useGridVirtualScroller = exports.getRenderableIndexes = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _utils = require("@mui/utils");
var _styles = require("@mui/material/styles");
var _reselect = require("reselect");
var _useGridPrivateApiContext = require("../../utils/useGridPrivateApiContext");
var _useGridRootProps = require("../../utils/useGridRootProps");
var _useGridSelector = require("../../utils/useGridSelector");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
var _gridFocusStateSelector = require("../focus/gridFocusStateSelector");
var _useGridVisibleRows = require("../../utils/useGridVisibleRows");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _utils2 = require("../../../utils/utils");
var _gridRowSelectionSelector = require("../rowSelection/gridRowSelectionSelector");
var _gridRowsMetaSelector = require("../rows/gridRowsMetaSelector");
var _gridColumnsUtils = require("../columns/gridColumnsUtils");
var _gridRowsUtils = require("../rows/gridRowsUtils");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["style"],
  _excluded2 = ["style"],
  _excluded3 = ["style"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Uses binary search to avoid looping through all possible positions
function binarySearch(offset, positions, sliceStart = 0, sliceEnd = positions.length) {
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
const getRenderableIndexes = ({
  firstIndex,
  lastIndex,
  buffer,
  minFirstIndex,
  maxLastIndex
}) => {
  return [(0, _utils2.clamp)(firstIndex - buffer, minFirstIndex, maxLastIndex), (0, _utils2.clamp)(lastIndex + buffer, minFirstIndex, maxLastIndex)];
};
exports.getRenderableIndexes = getRenderableIndexes;
const areRenderContextsEqual = (context1, context2) => {
  if (context1 === context2) {
    return true;
  }
  return context1.firstRowIndex === context2.firstRowIndex && context1.lastRowIndex === context2.lastRowIndex && context1.firstColumnIndex === context2.firstColumnIndex && context1.lastColumnIndex === context2.lastColumnIndex;
};
const useGridVirtualScroller = props => {
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const visibleColumns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector);
  const {
    ref,
    disableVirtualization,
    onRenderZonePositioning,
    renderZoneMinColumnIndex = 0,
    renderZoneMaxColumnIndex = visibleColumns.length,
    getRowProps
  } = props;
  const theme = (0, _styles.useTheme)();
  const columnPositions = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnPositionsSelector);
  const columnsTotalWidth = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnsTotalWidthSelector);
  const cellFocus = (0, _useGridSelector.useGridSelector)(apiRef, _gridFocusStateSelector.gridFocusCellSelector);
  const cellTabIndex = (0, _useGridSelector.useGridSelector)(apiRef, _gridFocusStateSelector.gridTabIndexCellSelector);
  const rowsMeta = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsMetaSelector.gridRowsMetaSelector);
  const selectedRowsLookup = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowSelectionSelector.selectedIdsLookupSelector);
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, rootProps);
  const renderZoneRef = React.useRef(null);
  const rootRef = React.useRef(null);
  const handleRef = (0, _utils.unstable_useForkRef)(ref, rootRef);
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
  const getRenderedColumnsRef = React.useRef((0, _reselect.defaultMemoize)((columns, firstColumnToRender, lastColumnToRender) => {
    return columns.slice(firstColumnToRender, lastColumnToRender);
  }));
  const getNearestIndexToRender = React.useCallback(offset => {
    const lastMeasuredIndexRelativeToAllRows = apiRef.current.getLastMeasuredRowIndex();
    let allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
    if (currentPage.range?.lastRowIndex && !allRowsMeasured) {
      // Check if all rows in this page are already measured
      allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= currentPage.range.lastRowIndex;
    }
    const lastMeasuredIndexRelativeToCurrentPage = (0, _utils2.clamp)(lastMeasuredIndexRelativeToAllRows - (currentPage.range?.firstRowIndex || 0), 0, rowsMeta.positions.length);
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
  }, [apiRef, currentPage.range?.firstRowIndex, currentPage.range?.lastRowIndex, rowsMeta.positions]);
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
  (0, _utils.unstable_useEnhancedEffect)(() => {
    if (disableVirtualization) {
      renderZoneRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
    } else {
      // TODO a scroll reset should not be necessary
      rootRef.current.scrollLeft = 0;
      rootRef.current.scrollTop = 0;
    }
  }, [disableVirtualization]);
  (0, _utils.unstable_useEnhancedEffect)(() => {
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
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'debouncedResize', handleResize);
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
    const firstColumnToRender = (0, _gridColumnsUtils.getFirstNonSpannedColumnToRender)({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const direction = theme.direction === 'ltr' ? 1 : -1;
    const top = (0, _gridRowsMetaSelector.gridRowsMetaSelector)(apiRef.current.state).positions[firstRowToRender];
    const left = direction * (0, _gridColumnsSelector.gridColumnPositionsSelector)(apiRef)[firstColumnToRender]; // Call directly the selector because it might be outdated when this method is called
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
  (0, _utils.unstable_useEnhancedEffect)(() => {
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
    const firstColumnToRender = (0, _gridColumnsUtils.getFirstNonSpannedColumnToRender)({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const renderedColumns = getRenderedColumnsRef.current(visibleColumns, firstColumnToRender, lastColumnToRender);
    const _ref = rootProps.slotProps?.row || {},
      {
        style: rootRowStyle
      } = _ref,
      rootRowProps = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
    const invalidatesCachedRowStyle = prevGetRowProps.current !== getRowProps || prevRootRowStyle.current !== rootRowStyle;
    if (invalidatesCachedRowStyle) {
      rowStyleCache.current = {};
    }
    const rows = [];
    for (let i = 0; i < renderedRows.length; i += 1) {
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
        rowProps = (0, _objectWithoutPropertiesLoose2.default)(_ref2, _excluded2);
      if (!rowStyleCache.current[id]) {
        const style = (0, _extends2.default)({}, rowStyle, rootRowStyle);
        rowStyleCache.current[id] = style;
      }
      rows.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.row, (0, _extends2.default)({
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
        index: rowIndexOffset + (currentPage?.range?.firstRowIndex || 0) + firstRowToRender + i,
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
    if (rootRef?.current && height <= rootRef?.current.clientHeight) {
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
    contentSize.height = (0, _gridRowsUtils.getMinimalContentHeight)(apiRef, rootProps.rowHeight); // Give room to show the overlay when there no rows.
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
        other = (0, _objectWithoutPropertiesLoose2.default)(_ref3, _excluded3);
      return (0, _extends2.default)({
        ref: handleRef,
        onScroll: handleScroll,
        onWheel: handleWheel,
        onTouchMove: handleTouchMove,
        style: (0, _extends2.default)({}, style, rootStyle)
      }, other);
    },
    getContentProps: ({
      style = {}
    } = {}) => ({
      style: (0, _extends2.default)({}, style, contentSize)
    }),
    getRenderZoneProps: () => ({
      ref: renderZoneRef
    })
  };
};
exports.useGridVirtualScroller = useGridVirtualScroller;