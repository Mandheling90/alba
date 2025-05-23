import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import _regeneratorRuntime from "@babel/runtime/regenerator";
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
  return new Promise(function (resolve) {
    requestAnimationFrame(function () {
      resolve();
    });
  });
}
function buildPrintWindow(title) {
  var iframeEl = document.createElement('iframe');
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
export var useGridPrintExport = function useGridPrintExport(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridPrintExport');
  var doc = React.useRef(null);
  var previousGridState = React.useRef(null);
  var previousColumnVisibility = React.useRef({});
  React.useEffect(function () {
    doc.current = ownerDocument(apiRef.current.rootElementRef.current);
  }, [apiRef]);

  // Returns a promise because updateColumns triggers state update and
  // the new state needs to be in place before the grid can be sized correctly
  var updateGridColumnsForPrint = React.useCallback(function (fields, allColumns) {
    return new Promise(function (resolve) {
      // TODO remove unused Promise
      if (!fields && !allColumns) {
        resolve();
        return;
      }
      var exportedColumnFields = getColumnsToExport({
        apiRef: apiRef,
        options: {
          fields: fields,
          allColumns: allColumns
        }
      }).map(function (column) {
        return column.field;
      });
      var columns = gridColumnDefinitionsSelector(apiRef);
      var newColumnVisibilityModel = {};
      columns.forEach(function (column) {
        newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
      });
      apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
      resolve();
    });
  }, [apiRef]);
  var handlePrintWindowLoad = React.useCallback(function (printWindow, options) {
    var _querySelector, _querySelector2;
    var normalizeOptions = _extends({
      copyStyles: true,
      hideToolbar: false,
      hideFooter: false
    }, options);
    var printDoc = printWindow.contentDocument;
    if (!printDoc) {
      return;
    }
    var rowsMeta = gridRowsMetaSelector(apiRef.current.state);
    var gridRootElement = apiRef.current.rootElementRef.current;
    var gridClone = gridRootElement.cloneNode(true);

    // Allow to overflow to not hide the border of the last row
    var gridMain = gridClone.querySelector(".".concat(gridClasses.main));
    gridMain.style.overflow = 'visible';

    // See https://support.google.com/chrome/thread/191619088?hl=en&msgid=193009642
    gridClone.style.contain = 'size';
    var columnHeaders = gridClone.querySelector(".".concat(gridClasses.columnHeaders));
    var columnHeadersInner = columnHeaders.querySelector(".".concat(gridClasses.columnHeadersInner));
    columnHeadersInner.style.width = '100%';
    var gridToolbarElementHeight = ((_querySelector = gridRootElement.querySelector(".".concat(gridClasses.toolbarContainer))) == null ? void 0 : _querySelector.offsetHeight) || 0;
    var gridFooterElementHeight = ((_querySelector2 = gridRootElement.querySelector(".".concat(gridClasses.footerContainer))) == null ? void 0 : _querySelector2.offsetHeight) || 0;
    if (normalizeOptions.hideToolbar) {
      var _gridClone$querySelec;
      (_gridClone$querySelec = gridClone.querySelector(".".concat(gridClasses.toolbarContainer))) == null ? void 0 : _gridClone$querySelec.remove();
      gridToolbarElementHeight = 0;
    }
    if (normalizeOptions.hideFooter) {
      var _gridClone$querySelec2;
      (_gridClone$querySelec2 = gridClone.querySelector(".".concat(gridClasses.footerContainer))) == null ? void 0 : _gridClone$querySelec2.remove();
      gridFooterElementHeight = 0;
    }

    // Expand container height to accommodate all rows
    gridClone.style.height = "".concat(rowsMeta.currentPageTotalHeight + getTotalHeaderHeight(apiRef, props.columnHeaderHeight) + gridToolbarElementHeight + gridFooterElementHeight, "px");
    // The height above does not include grid border width, so we need to exclude it
    gridClone.style.boxSizing = 'content-box';

    // printDoc.body.appendChild(gridClone); should be enough but a clone isolation bug in Safari
    // prevents us to do it
    var container = document.createElement('div');
    container.appendChild(gridClone);
    printDoc.body.innerHTML = container.innerHTML;
    var defaultPageStyle = typeof normalizeOptions.pageStyle === 'function' ? normalizeOptions.pageStyle() : normalizeOptions.pageStyle;
    if (typeof defaultPageStyle === 'string') {
      // TODO custom styles should always win
      var styleElement = printDoc.createElement('style');
      styleElement.appendChild(printDoc.createTextNode(defaultPageStyle));
      printDoc.head.appendChild(styleElement);
    }
    if (normalizeOptions.bodyClassName) {
      var _printDoc$body$classL;
      (_printDoc$body$classL = printDoc.body.classList).add.apply(_printDoc$body$classL, _toConsumableArray(normalizeOptions.bodyClassName.split(' ')));
    }
    if (normalizeOptions.copyStyles) {
      var headStyleElements = doc.current.querySelectorAll("style, link[rel='stylesheet']");
      for (var i = 0; i < headStyleElements.length; i += 1) {
        var node = headStyleElements[i];
        if (node.tagName === 'STYLE') {
          var newHeadStyleElements = printDoc.createElement(node.tagName);
          var sheet = node.sheet;
          if (sheet) {
            var styleCSS = '';
            // NOTE: for-of is not supported by IE
            for (var j = 0; j < sheet.cssRules.length; j += 1) {
              if (typeof sheet.cssRules[j].cssText === 'string') {
                styleCSS += "".concat(sheet.cssRules[j].cssText, "\r\n");
              }
            }
            newHeadStyleElements.appendChild(printDoc.createTextNode(styleCSS));
            printDoc.head.appendChild(newHeadStyleElements);
          }
        } else if (node.getAttribute('href')) {
          // If `href` tag is empty, avoid loading these links

          var _newHeadStyleElements = printDoc.createElement(node.tagName);
          for (var _j = 0; _j < node.attributes.length; _j += 1) {
            var attr = node.attributes[_j];
            if (attr) {
              _newHeadStyleElements.setAttribute(attr.nodeName, attr.nodeValue || '');
            }
          }
          printDoc.head.appendChild(_newHeadStyleElements);
        }
      }
    }

    // Trigger print
    if (process.env.NODE_ENV !== 'test') {
      printWindow.contentWindow.print();
    }
  }, [apiRef, doc, props.columnHeaderHeight]);
  var handlePrintWindowAfterPrint = React.useCallback(function (printWindow) {
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
  var exportDataAsPrint = React.useCallback( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(options) {
      var visibleRowCount, printWindow;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger.debug("Export data as Print");
              if (apiRef.current.rootElementRef.current) {
                _context.next = 3;
                break;
              }
              throw new Error('MUI: No grid root element available.');
            case 3:
              previousGridState.current = apiRef.current.exportState();
              // It appends that the visibility model is not exported, especially if columnVisibility is not controlled
              previousColumnVisibility.current = gridColumnVisibilityModelSelector(apiRef);
              if (props.pagination) {
                visibleRowCount = gridExpandedRowCountSelector(apiRef);
                apiRef.current.setPageSize(visibleRowCount);
              }
              _context.next = 8;
              return updateGridColumnsForPrint(options == null ? void 0 : options.fields, options == null ? void 0 : options.allColumns);
            case 8:
              apiRef.current.unstable_disableVirtualization();
              _context.next = 11;
              return raf();
            case 11:
              // wait for the state changes to take action
              printWindow = buildPrintWindow(options == null ? void 0 : options.fileName);
              if (process.env.NODE_ENV === 'test') {
                doc.current.body.appendChild(printWindow);
                // In test env, run the all pipeline without waiting for loading
                handlePrintWindowLoad(printWindow, options);
                handlePrintWindowAfterPrint(printWindow);
              } else {
                printWindow.onload = function () {
                  handlePrintWindowLoad(printWindow, options);
                  var mediaQueryList = printWindow.contentWindow.matchMedia('print');
                  mediaQueryList.addEventListener('change', function (mql) {
                    var isAfterPrint = mql.matches === false;
                    if (isAfterPrint) {
                      handlePrintWindowAfterPrint(printWindow);
                    }
                  });
                };
                doc.current.body.appendChild(printWindow);
              }
            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [props, logger, apiRef, handlePrintWindowLoad, handlePrintWindowAfterPrint, updateGridColumnsForPrint]);
  var printExportApi = {
    exportDataAsPrint: exportDataAsPrint
  };
  useGridApiMethod(apiRef, printExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  var addExportMenuButtons = React.useCallback(function (initialValue, options) {
    var _options$printOptions;
    if ((_options$printOptions = options.printOptions) != null && _options$printOptions.disableToolbarButton) {
      return initialValue;
    }
    return [].concat(_toConsumableArray(initialValue), [{
      component: /*#__PURE__*/_jsx(GridPrintExportMenuItem, {
        options: options.printOptions
      }),
      componentName: 'printExport'
    }]);
  }, []);
  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);
};