import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridSortedRowEntriesSelector, gridSortedRowIdsSelector, gridSortModelSelector } from './gridSortingSelector';
import { GRID_ROOT_GROUP_ID, gridRowTreeSelector } from '../rows';
import { useFirstRender } from '../../utils/useFirstRender';
import { useGridRegisterStrategyProcessor, GRID_DEFAULT_STRATEGY } from '../../core/strategyProcessing';
import { buildAggregatedSortingApplier, mergeStateWithSortModel, getNextGridSortDirection, sanitizeSortModel } from './gridSortingUtils';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { getTreeNodeDescendants } from '../rows/gridRowsUtils';
export var sortingStateInitializer = function sortingStateInitializer(state, props) {
  var _ref, _props$sortModel, _props$initialState, _props$initialState$s;
  var sortModel = (_ref = (_props$sortModel = props.sortModel) != null ? _props$sortModel : (_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$s = _props$initialState.sorting) == null ? void 0 : _props$initialState$s.sortModel) != null ? _ref : [];
  return _extends({}, state, {
    sorting: {
      sortModel: sanitizeSortModel(sortModel, props.disableMultipleColumnsSorting),
      sortedRows: []
    }
  });
};

/**
 * @requires useGridRows (event)
 * @requires useGridColumns (event)
 */
export var useGridSorting = function useGridSorting(apiRef, props) {
  var _props$initialState3, _props$initialState3$;
  var logger = useGridLogger(apiRef, 'useGridSorting');
  apiRef.current.registerControlState({
    stateId: 'sortModel',
    propModel: props.sortModel,
    propOnChange: props.onSortModelChange,
    stateSelector: gridSortModelSelector,
    changeEvent: 'sortModelChange'
  });
  var upsertSortModel = React.useCallback(function (field, sortItem) {
    var sortModel = gridSortModelSelector(apiRef);
    var existingIdx = sortModel.findIndex(function (c) {
      return c.field === field;
    });
    var newSortModel = _toConsumableArray(sortModel);
    if (existingIdx > -1) {
      if (!sortItem) {
        newSortModel.splice(existingIdx, 1);
      } else {
        newSortModel.splice(existingIdx, 1, sortItem);
      }
    } else {
      newSortModel = [].concat(_toConsumableArray(sortModel), [sortItem]);
    }
    return newSortModel;
  }, [apiRef]);
  var createSortItem = React.useCallback(function (col, directionOverride) {
    var _col$sortingOrder2;
    var sortModel = gridSortModelSelector(apiRef);
    var existing = sortModel.find(function (c) {
      return c.field === col.field;
    });
    if (existing) {
      var _col$sortingOrder;
      var nextSort = directionOverride === undefined ? getNextGridSortDirection((_col$sortingOrder = col.sortingOrder) != null ? _col$sortingOrder : props.sortingOrder, existing.sort) : directionOverride;
      return nextSort == null ? undefined : _extends({}, existing, {
        sort: nextSort
      });
    }
    return {
      field: col.field,
      sort: directionOverride === undefined ? getNextGridSortDirection((_col$sortingOrder2 = col.sortingOrder) != null ? _col$sortingOrder2 : props.sortingOrder) : directionOverride
    };
  }, [apiRef, props.sortingOrder]);
  var addColumnMenuItem = React.useCallback(function (columnMenuItems, colDef) {
    if (colDef == null || colDef.sortable === false) {
      return columnMenuItems;
    }
    var sortingOrder = colDef.sortingOrder || props.sortingOrder;
    if (sortingOrder.some(function (item) {
      return !!item;
    })) {
      return [].concat(_toConsumableArray(columnMenuItems), ['ColumnMenuSortItem']);
    }
    return columnMenuItems;
  }, [props.sortingOrder]);

  /**
   * API METHODS
   */
  var applySorting = React.useCallback(function () {
    apiRef.current.setState(function (state) {
      if (props.sortingMode === 'server') {
        logger.debug('Skipping sorting rows as sortingMode = server');
        return _extends({}, state, {
          sorting: _extends({}, state.sorting, {
            sortedRows: getTreeNodeDescendants(gridRowTreeSelector(apiRef), GRID_ROOT_GROUP_ID, false)
          })
        });
      }
      var sortModel = gridSortModelSelector(state, apiRef.current.instanceId);
      var sortRowList = buildAggregatedSortingApplier(sortModel, apiRef);
      var sortedRows = apiRef.current.applyStrategyProcessor('sorting', {
        sortRowList: sortRowList
      });
      return _extends({}, state, {
        sorting: _extends({}, state.sorting, {
          sortedRows: sortedRows
        })
      });
    });
    apiRef.current.publishEvent('sortedRowsSet');
    apiRef.current.forceUpdate();
  }, [apiRef, logger, props.sortingMode]);
  var setSortModel = React.useCallback(function (model) {
    var currentModel = gridSortModelSelector(apiRef);
    if (currentModel !== model) {
      logger.debug("Setting sort model");
      apiRef.current.setState(mergeStateWithSortModel(model, props.disableMultipleColumnsSorting));
      apiRef.current.forceUpdate();
      apiRef.current.applySorting();
    }
  }, [apiRef, logger, props.disableMultipleColumnsSorting]);
  var sortColumn = React.useCallback(function (column, direction, allowMultipleSorting) {
    if (!column.sortable) {
      return;
    }
    var sortItem = createSortItem(column, direction);
    var sortModel;
    if (!allowMultipleSorting || props.disableMultipleColumnsSorting) {
      sortModel = !sortItem ? [] : [sortItem];
    } else {
      sortModel = upsertSortModel(column.field, sortItem);
    }
    apiRef.current.setSortModel(sortModel);
  }, [apiRef, upsertSortModel, createSortItem, props.disableMultipleColumnsSorting]);
  var getSortModel = React.useCallback(function () {
    return gridSortModelSelector(apiRef);
  }, [apiRef]);
  var getSortedRows = React.useCallback(function () {
    var sortedRows = gridSortedRowEntriesSelector(apiRef);
    return sortedRows.map(function (row) {
      return row.model;
    });
  }, [apiRef]);
  var getSortedRowIds = React.useCallback(function () {
    return gridSortedRowIdsSelector(apiRef);
  }, [apiRef]);
  var getRowIdFromRowIndex = React.useCallback(function (index) {
    return apiRef.current.getSortedRowIds()[index];
  }, [apiRef]);
  var sortApi = {
    getSortModel: getSortModel,
    getSortedRows: getSortedRows,
    getSortedRowIds: getSortedRowIds,
    getRowIdFromRowIndex: getRowIdFromRowIndex,
    setSortModel: setSortModel,
    sortColumn: sortColumn,
    applySorting: applySorting
  };
  useGridApiMethod(apiRef, sortApi, 'public');

  /**
   * PRE-PROCESSING
   */
  var stateExportPreProcessing = React.useCallback(function (prevState, context) {
    var _props$initialState2, _props$initialState2$;
    var sortModelToExport = gridSortModelSelector(apiRef);
    var shouldExportSortModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the model is controlled
    props.sortModel != null ||
    // Always export if the model has been initialized
    ((_props$initialState2 = props.initialState) == null ? void 0 : (_props$initialState2$ = _props$initialState2.sorting) == null ? void 0 : _props$initialState2$.sortModel) != null ||
    // Export if the model is not empty
    sortModelToExport.length > 0;
    if (!shouldExportSortModel) {
      return prevState;
    }
    return _extends({}, prevState, {
      sorting: {
        sortModel: sortModelToExport
      }
    });
  }, [apiRef, props.sortModel, (_props$initialState3 = props.initialState) == null ? void 0 : (_props$initialState3$ = _props$initialState3.sorting) == null ? void 0 : _props$initialState3$.sortModel]);
  var stateRestorePreProcessing = React.useCallback(function (params, context) {
    var _context$stateToResto;
    var sortModel = (_context$stateToResto = context.stateToRestore.sorting) == null ? void 0 : _context$stateToResto.sortModel;
    if (sortModel == null) {
      return params;
    }
    apiRef.current.setState(mergeStateWithSortModel(sortModel, props.disableMultipleColumnsSorting));
    return _extends({}, params, {
      callbacks: [].concat(_toConsumableArray(params.callbacks), [apiRef.current.applySorting])
    });
  }, [apiRef, props.disableMultipleColumnsSorting]);
  var flatSortingMethod = React.useCallback(function (params) {
    var rowTree = gridRowTreeSelector(apiRef);
    var rootGroupNode = rowTree[GRID_ROOT_GROUP_ID];
    var sortedChildren = params.sortRowList ? params.sortRowList(rootGroupNode.children.map(function (childId) {
      return rowTree[childId];
    })) : _toConsumableArray(rootGroupNode.children);
    if (rootGroupNode.footerId != null) {
      sortedChildren.push(rootGroupNode.footerId);
    }
    return sortedChildren;
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'sorting', flatSortingMethod);

  /**
   * EVENTS
   */
  var handleColumnHeaderClick = React.useCallback(function (_ref2, event) {
    var colDef = _ref2.colDef;
    var allowMultipleSorting = event.shiftKey || event.metaKey || event.ctrlKey;
    sortColumn(colDef, undefined, allowMultipleSorting);
  }, [sortColumn]);
  var handleColumnHeaderKeyDown = React.useCallback(function (_ref3, event) {
    var colDef = _ref3.colDef;
    // Ctrl + Enter opens the column menu
    if (isEnterKey(event.key) && !event.ctrlKey && !event.metaKey) {
      sortColumn(colDef, undefined, event.shiftKey);
    }
  }, [sortColumn]);
  var handleColumnsChange = React.useCallback(function () {
    // When the columns change we check that the sorted columns are still part of the dataset
    var sortModel = gridSortModelSelector(apiRef);
    var latestColumns = gridColumnLookupSelector(apiRef);
    if (sortModel.length > 0) {
      var newModel = sortModel.filter(function (sortItem) {
        return latestColumns[sortItem.field];
      });
      if (newModel.length < sortModel.length) {
        apiRef.current.setSortModel(newModel);
      }
    }
  }, [apiRef]);
  var handleStrategyProcessorChange = React.useCallback(function (methodName) {
    if (methodName === 'sorting') {
      apiRef.current.applySorting();
    }
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItem);
  useGridApiEventHandler(apiRef, 'columnHeaderClick', handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'rowsSet', apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, 'columnsChange', handleColumnsChange);
  useGridApiEventHandler(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);

  /**
   * 1ST RENDER
   */
  useFirstRender(function () {
    apiRef.current.applySorting();
  });

  /**
   * EFFECTS
   */
  React.useEffect(function () {
    if (props.sortModel !== undefined) {
      apiRef.current.setSortModel(props.sortModel);
    }
  }, [apiRef, props.sortModel]);
};