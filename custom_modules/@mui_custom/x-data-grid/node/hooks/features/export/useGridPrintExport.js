"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridPrintExport = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _useGridLogger = require("../../utils/useGridLogger");
var _gridFilterSelector = require("../filter/gridFilterSelector");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
var _gridClasses = require("../../../constants/gridClasses");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _gridRowsMetaSelector = require("../rows/gridRowsMetaSelector");
var _utils2 = require("./utils");
var _pipeProcessing = require("../../core/pipeProcessing");
var _GridToolbarExport = require("../../../components/toolbar/GridToolbarExport");
var _gridColumnsUtils = require("../columns/gridColumnsUtils");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
const useGridPrintExport = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridPrintExport');
  const doc = React.useRef(null);
  const previousGridState = React.useRef(null);
  const previousColumnVisibility = React.useRef({});
  React.useEffect(() => {
    doc.current = (0, _utils.unstable_ownerDocument)(apiRef.current.rootElementRef.current);
  }, [apiRef]);

  // Returns a promise because updateColumns triggers state update and
  // the new state needs to be in place before the grid can be sized correctly
  const updateGridColumnsForPrint = React.useCallback((fields, allColumns) => new Promise(resolve => {
    // TODO remove unused Promise
    if (!fields && !allColumns) {
      resolve();
      return;
    }
    const exportedColumnFields = (0, _utils2.getColumnsToExport)({
      apiRef,
      options: {
        fields,
        allColumns
      }
    }).map(column => column.field);
    const columns = (0, _gridColumnsSelector.gridColumnDefinitionsSelector)(apiRef);
    const newColumnVisibilityModel = {};
    columns.forEach(column => {
      newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
    });
    apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
    resolve();
  }), [apiRef]);
  const handlePrintWindowLoad = React.useCallback((printWindow, options) => {
    const normalizeOptions = (0, _extends2.default)({
      copyStyles: true,
      hideToolbar: false,
      hideFooter: false
    }, options);
    const printDoc = printWindow.contentDocument;
    if (!printDoc) {
      return;
    }
    const rowsMeta = (0, _gridRowsMetaSelector.gridRowsMetaSelector)(apiRef.current.state);
    const gridRootElement = apiRef.current.rootElementRef.current;
    const gridClone = gridRootElement.cloneNode(true);

    // Allow to overflow to not hide the border of the last row
    const gridMain = gridClone.querySelector(`.${_gridClasses.gridClasses.main}`);
    gridMain.style.overflow = 'visible';

    // See https://support.google.com/chrome/thread/191619088?hl=en&msgid=193009642
    gridClone.style.contain = 'size';
    const columnHeaders = gridClone.querySelector(`.${_gridClasses.gridClasses.columnHeaders}`);
    const columnHeadersInner = columnHeaders.querySelector(`.${_gridClasses.gridClasses.columnHeadersInner}`);
    columnHeadersInner.style.width = '100%';
    let gridToolbarElementHeight = gridRootElement.querySelector(`.${_gridClasses.gridClasses.toolbarContainer}`)?.offsetHeight || 0;
    let gridFooterElementHeight = gridRootElement.querySelector(`.${_gridClasses.gridClasses.footerContainer}`)?.offsetHeight || 0;
    if (normalizeOptions.hideToolbar) {
      gridClone.querySelector(`.${_gridClasses.gridClasses.toolbarContainer}`)?.remove();
      gridToolbarElementHeight = 0;
    }
    if (normalizeOptions.hideFooter) {
      gridClone.querySelector(`.${_gridClasses.gridClasses.footerContainer}`)?.remove();
      gridFooterElementHeight = 0;
    }

    // Expand container height to accommodate all rows
    gridClone.style.height = `${rowsMeta.currentPageTotalHeight + (0, _gridColumnsUtils.getTotalHeaderHeight)(apiRef, props.columnHeaderHeight) + gridToolbarElementHeight + gridFooterElementHeight}px`;
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
    // Remove the print iframe
    doc.current.body.removeChild(printWindow);

    // Revert grid to previous state
    apiRef.current.restoreState(previousGridState.current || {});
    if (!previousGridState.current?.columns?.columnVisibilityModel) {
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
    previousColumnVisibility.current = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
    if (props.pagination) {
      const visibleRowCount = (0, _gridFilterSelector.gridExpandedRowCountSelector)(apiRef);
      apiRef.current.setPageSize(visibleRowCount);
    }
    await updateGridColumnsForPrint(options?.fields, options?.allColumns);
    apiRef.current.unstable_disableVirtualization();
    await raf(); // wait for the state changes to take action
    const printWindow = buildPrintWindow(options?.fileName);
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
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, printExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback((initialValue, options) => {
    if (options.printOptions?.disableToolbarButton) {
      return initialValue;
    }
    return [...initialValue, {
      component: /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarExport.GridPrintExportMenuItem, {
        options: options.printOptions
      }),
      componentName: 'printExport'
    }];
  }, []);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportMenu', addExportMenuButtons);
};
exports.useGridPrintExport = useGridPrintExport;