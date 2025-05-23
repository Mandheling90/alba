import * as React from 'react';
import { unstable_debounce as debounce, unstable_ownerDocument as ownerDocument, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnsTotalWidthSelector } from '../columns';
import { gridDensityFactorSelector } from '../density';
import { useGridSelector } from '../../utils';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';
const isTestEnvironment = process.env.NODE_ENV === 'test';
const hasScroll = ({
  content,
  container,
  scrollBarSize
}) => {
  const hasScrollXIfNoYScrollBar = content.width > container.width;
  const hasScrollYIfNoXScrollBar = content.height > container.height;
  let hasScrollX = false;
  let hasScrollY = false;
  if (hasScrollXIfNoYScrollBar || hasScrollYIfNoXScrollBar) {
    hasScrollX = hasScrollXIfNoYScrollBar;
    hasScrollY = content.height + (hasScrollX ? scrollBarSize : 0) > container.height;

    // We recalculate the scroll x to consider the size of the y scrollbar.
    if (hasScrollY) {
      hasScrollX = content.width + scrollBarSize > container.width;
    }
  }
  return {
    hasScrollX,
    hasScrollY
  };
};
export function useGridDimensions(apiRef, props) {
  const logger = useGridLogger(apiRef, 'useResizeContainer');
  const errorShown = React.useRef(false);
  const rootDimensionsRef = React.useRef(null);
  const fullDimensionsRef = React.useRef(null);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const rowHeight = Math.floor(props.rowHeight * densityFactor);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, props.columnHeaderHeight);
  const updateGridDimensionsRef = React.useCallback(() => {
    const rootElement = apiRef.current.rootElementRef?.current;
    const columnsTotalWidth = gridColumnsTotalWidthSelector(apiRef);
    const pinnedRowsHeight = calculatePinnedRowsHeight(apiRef);
    if (!rootDimensionsRef.current) {
      return;
    }
    let scrollBarSize;
    if (props.scrollbarSize != null) {
      scrollBarSize = props.scrollbarSize;
    } else if (!columnsTotalWidth || !rootElement) {
      scrollBarSize = 0;
    } else {
      const doc = ownerDocument(rootElement);
      const scrollDiv = doc.createElement('div');
      scrollDiv.style.width = '99px';
      scrollDiv.style.height = '99px';
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.overflow = 'scroll';
      scrollDiv.className = 'scrollDiv';
      rootElement.appendChild(scrollDiv);
      scrollBarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      rootElement.removeChild(scrollDiv);
    }
    let viewportOuterSize;
    let hasScrollX;
    let hasScrollY;
    if (props.autoHeight) {
      hasScrollY = false;
      hasScrollX = Math.round(columnsTotalWidth) > rootDimensionsRef.current.width;
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rowsMeta.currentPageTotalHeight + (hasScrollX ? scrollBarSize : 0)
      };
    } else {
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rootDimensionsRef.current.height - totalHeaderHeight
      };
      const scrollInformation = hasScroll({
        content: {
          width: Math.round(columnsTotalWidth),
          height: rowsMeta.currentPageTotalHeight
        },
        container: {
          width: viewportOuterSize.width,
          height: viewportOuterSize.height - pinnedRowsHeight.top - pinnedRowsHeight.bottom
        },
        scrollBarSize
      });
      hasScrollY = scrollInformation.hasScrollY;
      hasScrollX = scrollInformation.hasScrollX;
    }
    const viewportInnerSize = {
      width: viewportOuterSize.width - (hasScrollY ? scrollBarSize : 0),
      height: viewportOuterSize.height - (hasScrollX ? scrollBarSize : 0)
    };
    const newFullDimensions = {
      viewportOuterSize,
      viewportInnerSize,
      hasScrollX,
      hasScrollY,
      scrollBarSize
    };
    const prevDimensions = fullDimensionsRef.current;
    fullDimensionsRef.current = newFullDimensions;
    if (newFullDimensions.viewportInnerSize.width !== prevDimensions?.viewportInnerSize.width || newFullDimensions.viewportInnerSize.height !== prevDimensions?.viewportInnerSize.height) {
      apiRef.current.publishEvent('viewportInnerSizeChange', newFullDimensions.viewportInnerSize);
    }
  }, [apiRef, props.scrollbarSize, props.autoHeight, rowsMeta.currentPageTotalHeight, totalHeaderHeight]);
  const resize = React.useCallback(() => {
    updateGridDimensionsRef();
    apiRef.current.publishEvent('debouncedResize', rootDimensionsRef.current);
  }, [apiRef, updateGridDimensionsRef]);
  const getRootDimensions = React.useCallback(() => fullDimensionsRef.current, []);
  const getViewportPageSize = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();
    if (!dimensions) {
      return 0;
    }
    const currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode
    });

    // TODO: Use a combination of scrollTop, dimensions.viewportInnerSize.height and rowsMeta.possitions
    // to find out the maximum number of rows that can fit in the visible part of the grid
    if (props.getRowHeight) {
      const renderContext = apiRef.current.getRenderContext();
      const viewportPageSize = renderContext.lastRowIndex - renderContext.firstRowIndex;
      return Math.min(viewportPageSize - 1, currentPage.rows.length);
    }
    const maximumPageSizeWithoutScrollBar = Math.floor(dimensions.viewportInnerSize.height / rowHeight);
    return Math.min(maximumPageSizeWithoutScrollBar, currentPage.rows.length);
  }, [apiRef, props.pagination, props.paginationMode, props.getRowHeight, rowHeight]);
  const dimensionsApi = {
    resize,
    getRootDimensions
  };
  const dimensionsPrivateApi = {
    getViewportPageSize,
    updateGridDimensionsRef
  };
  useGridApiMethod(apiRef, dimensionsApi, 'public');
  useGridApiMethod(apiRef, dimensionsPrivateApi, 'private');
  const debounceResize = React.useMemo(() => debounce(resize, 60), [resize]);
  const isFirstSizing = React.useRef(true);
  const handleResize = React.useCallback(size => {
    rootDimensionsRef.current = size;

    // jsdom has no layout capabilities
    const isJSDOM = /jsdom/.test(window.navigator.userAgent);
    if (size.height === 0 && !errorShown.current && !props.autoHeight && !isJSDOM) {
      logger.error(['The parent DOM element of the data grid has an empty height.', 'Please make sure that this element has an intrinsic height.', 'The grid displays with a height of 0px.', '', 'More details: https://mui.com/r/x-data-grid-no-dimensions.'].join('\n'));
      errorShown.current = true;
    }
    if (size.width === 0 && !errorShown.current && !isJSDOM) {
      logger.error(['The parent DOM element of the data grid has an empty width.', 'Please make sure that this element has an intrinsic width.', 'The grid displays with a width of 0px.', '', 'More details: https://mui.com/r/x-data-grid-no-dimensions.'].join('\n'));
      errorShown.current = true;
    }
    if (isTestEnvironment) {
      // We don't need to debounce the resize for tests.
      resize();
      isFirstSizing.current = false;
      return;
    }
    if (isFirstSizing.current) {
      // We want to initialize the grid dimensions as soon as possible to avoid flickering
      resize();
      isFirstSizing.current = false;
      return;
    }
    debounceResize();
  }, [props.autoHeight, debounceResize, logger, resize]);
  useEnhancedEffect(() => updateGridDimensionsRef(), [updateGridDimensionsRef]);
  useGridApiOptionHandler(apiRef, 'sortedRowsSet', updateGridDimensionsRef);
  useGridApiOptionHandler(apiRef, 'paginationModelChange', updateGridDimensionsRef);
  useGridApiOptionHandler(apiRef, 'columnsChange', updateGridDimensionsRef);
  useGridApiEventHandler(apiRef, 'resize', handleResize);
  useGridApiOptionHandler(apiRef, 'debouncedResize', props.onResize);
}