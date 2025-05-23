import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_ownerDocument as ownerDocument } from '@mui/utils';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridExpandedRowCountSelector } from '../filter/gridFilterSelector';
import { gridColumnDefinitionsSelector, gridColumnVisibilityModelSelector } from '../columns/gridColumnsSelector';
import { gridClasses } from '../../../constants/gridClasses';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { getColumnsToExport } from './utils';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { GridPrintExportMenuItem } from '../../../components/toolbar/GridToolbarExport';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { jsx as _jsx } from "react/jsx-runtime";
function raf() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}
function buildPrintWindow(title) {
  const iframeEl = document.createElement('iframe');
  iframeEl.style.position = 'absolute';
  iframeEl.style.width = '0px';
  iframeEl.style.height = '0px';
  iframeEl.title = title || document.title;
  return iframeEl;
}

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridParamsApi (method)
 */
export const useGridPrintExport = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridPrintExport');
  const doc = React.useRef(null);
  const previousGridState = React.useRef(null);
  const previousColumnVisibility = React.useRef({});
  React.useEffect(() => {
    doc.current = ownerDocument(apiRef.current.rootElementRef.current);
  }, [apiRef]);

  // Returns a promise because updateColumns triggers state update and
  // the new state needs to be in place before the grid can be sized correctly
  const updateGridColumnsForPrint = React.useCallback((fields, allColumns) => new Promise(resolve => {
    // TODO remove unused Promise
    if (!fields && !allColumns) {
      resolve();
      return;
    }
    const exportedColumnFields = getColumnsToExport({
      apiRef,
      options: {
        fields,
        allColumns
      }
    }).map(column => column.field);
    const columns = gridColumnDefinitionsSelector(apiRef);
    const newColumnVisibilityModel = {};
    columns.forEach(column => {
      newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
    });
    apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
    resolve();
  }), [apiRef]);
  const handlePrintWindowLoad = React.useCallback((printWindow, options) => {
    var _querySelector, _querySelector2;
    const normalizeOptions = _extends({
      copyStyles: true,
      hideToolbar: false,
      hideFooter: false
    }, options);
    const printDoc = printWindow.contentDocument;
    if (!printDoc) {
      return;
    }
    const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
    const gridRootElement = apiRef.current.rootElementRef.current;
    const gridClone = gridRootElement.cloneNode(true);

    // Allow to overflow to not hide the border of the last row
    const gridMain = gridClone.querySelector(`.${gridClasses.main}`);
    gridMain.style.overflow = 'visible';

    // See https://support.google.com/chrome/thread/191619088?hl=en&msgid=193009642
    gridClone.style.contain = 'size';
    const columnHeaders = gridClone.querySelector(`.${gridClasses.columnHeaders}`);
    const columnHeadersInner = columnHeaders.querySelector(`.${gridClasses.columnHeadersInner}`);
    columnHeadersInner.style.width = '100%';
    let gridToolbarElementHeight = ((_querySelector = gridRootElement.querySelector(`.${gridClasses.toolbarContainer}`)) == null ? void 0 : _querySelector.offsetHeight) || 0;
    let gridFooterElementHeight = ((_querySelector2 = gridRootElement.querySelector(`.${gridClasses.footerContainer}`)) == null ? void 0 : _querySelector2.offsetHeight) || 0;
    if (normalizeOptions.hideToolbar) {
      var _gridClone$querySelec;
      (_gridClone$querySelec = gridClone.querySelector(`.${gridClasses.toolbarContainer}`)) == null ? void 0 : _gridClone$querySelec.remove();
      gridToolbarElementHeight = 0;
    }
    if (normalizeOptions.hideFooter) {
      var _gridClone$querySelec2;
      (_gridClone$querySelec2 = gridClone.querySelector(`.${gridClasses.footerContainer}`)) == null ? void 0 : _gridClone$querySelec2.remove();
      gridFooterElementHeight = 0;
    }

    // Expand container height to accommodate all rows
    gridClone.style.height = `${rowsMeta.currentPageTotalHeight + getTotalHeaderHeight(apiRef, props.columnHeaderHeight) + gridToolbarElementHeight + gridFooterElementHeight}px`;
    // The height above does not include grid border width, so we need to exclude it
    gridClone.style.boxSizing = 'content-box';

    // printDoc.body.appendChild(gridClone); should be enough but a clone isolation bug in Safari
    // prevents us to do it
    const container = document.createElement('div');
    container.appendChild(gridClone);
    printDoc.body.innerHTML = container.innerHTML;
    const defaultPageStyle = typeof normalizeOptions.pageStyle === 'function' ? normalizeOptions.pageStyle() : normalizeOptions.pageStyle;
    if (typeof defaultPageStyle === 'string') {
      // TODO custom styles should always win
      const styleElement = printDoc.createElement('style');
      styleElement.appendChild(printDoc.createTextNode(defaultPageStyle));
      printDoc.head.appendChild(styleElement);
    }
    if (normalizeOptions.bodyClassName) {
      printDoc.body.classList.add(...normalizeOptions.bodyClassName.split(' '));
    }
    if (normalizeOptions.copyStyles) {
      const headStyleElements = doc.current.querySelectorAll("style, link[rel='stylesheet']");
      for (let i = 0; i < headStyleElements.length; i += 1) {
        const node = headStyleElements[i];
        if (node.tagName === 'STYLE') {
          const newHeadStyleElements = printDoc.createElement(node.tagName);
          const sheet = node.sheet;
          if (sheet) {
            let styleCSS = '';
            // NOTE: for-of is not supported by IE
            for (let j = 0; j < sheet.cssRules.length; j += 1) {
              if (typeof sheet.cssRules[j].cssText === 'string') {
                styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
              }
            }
            newHeadStyleElements.appendChild(printDoc.createTextNode(styleCSS));
            printDoc.head.appendChild(newHeadStyleElements);
          }
        } else if (node.getAttribute('href')) {
          // If `href` tag is empty, avoid loading these links

          const newHeadStyleElements = printDoc.createElement(node.tagName);
          for (let j = 0; j < node.attributes.length; j += 1) {
            const attr = node.attributes[j];
            if (attr) {
              newHeadStyleElements.setAttribute(attr.nodeName, attr.nodeValue || '');
            }
          }
          printDoc.head.appendChild(newHeadStyleElements);
        }
      }
    }

    // Trigger print
    if (process.env.NODE_ENV !== 'test') {
      printWindow.contentWindow.print();
    }
  }, [apiRef, doc, props.columnHeaderHeight]);
  const handlePrintWindowAfterPrint = React.useCallback(printWindow => {
    var _previousGridState$cu, _previousGridState$cu2;
    // Remove the print iframe
    doc.current.body.removeChild(printWindow);

    // Revert grid to previous state
    apiRef.current.restoreState(previousGridState.current || {});
    if (!((_previousGridState$cu = previousGridState.current) != null && (_previousGridState$cu2 = _previousGridState$cu.columns) != null && _previousGridState$cu2.columnVisibilityModel)) {
      // if the apiRef.current.exportState(); did not exported the column visibility, we update it
      apiRef.current.setColumnVisibilityModel(previousColumnVisibility.current);
    }
    apiRef.current.unstable_enableVirtualization();

    // Clear local state
    previousGridState.current = null;
    previousColumnVisibility.current = {};
  }, [apiRef]);
  const exportDataAsPrint = React.useCallback(async options => {
    logger.debug(`Export data as Print`);
    if (!apiRef.current.rootElementRef.current) {
      throw new Error('MUI: No grid root element available.');
    }
    previousGridState.current = apiRef.current.exportState();
    // It appends that the visibility model is not exported, especially if columnVisibility is not controlled
    previousColumnVisibility.current = gridColumnVisibilityModelSelector(apiRef);
    if (props.pagination) {
      const visibleRowCount = gridExpandedRowCountSelector(apiRef);
      apiRef.current.setPageSize(visibleRowCount);
    }
    await updateGridColumnsForPrint(options == null ? void 0 : options.fields, options == null ? void 0 : options.allColumns);
    apiRef.current.unstable_disableVirtualization();
    await raf(); // wait for the state changes to take action
    const printWindow = buildPrintWindow(options == null ? void 0 : options.fileName);
    if (process.env.NODE_ENV === 'test') {
      doc.current.body.appendChild(printWindow);
      // In test env, run the all pipeline without waiting for loading
      handlePrintWindowLoad(printWindow, options);
      handlePrintWindowAfterPrint(printWindow);
    } else {
      printWindow.onload = () => {
        handlePrintWindowLoad(printWindow, options);
        const mediaQueryList = printWindow.contentWindow.matchMedia('print');
        mediaQueryList.addEventListener('change', mql => {
          const isAfterPrint = mql.matches === false;
          if (isAfterPrint) {
            handlePrintWindowAfterPrint(printWindow);
          }
        });
      };
      doc.current.body.appendChild(printWindow);
    }
  }, [props, logger, apiRef, handlePrintWindowLoad, handlePrintWindowAfterPrint, updateGridColumnsForPrint]);
  const printExportApi = {
    exportDataAsPrint
  };
  useGridApiMethod(apiRef, printExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback((initialValue, options) => {
    var _options$printOptions;
    if ((_options$printOptions = options.printOptions) != null && _options$printOptions.disableToolbarButton) {
      return initialValue;
    }
    return [...initialValue, {
      component: /*#__PURE__*/_jsx(GridPrintExportMenuItem, {
        options: options.printOptions
      }),
      componentName: 'printExport'
    }];
  }, []);
  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);
};