"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridFilter = exports.filterStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _useGridLogger = require("../../utils/useGridLogger");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
var _gridPreferencePanelsValue = require("../preferencesPanel/gridPreferencePanelsValue");
var _gridFilterState = require("./gridFilterState");
var _gridFilterSelector = require("./gridFilterSelector");
var _useFirstRender = require("../../utils/useFirstRender");
var _rows = require("../rows");
var _pipeProcessing = require("../../core/pipeProcessing");
var _strategyProcessing = require("../../core/strategyProcessing");
var _gridFilterUtils = require("./gridFilterUtils");
var _utils = require("../../../utils/utils");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const filterStateInitializer = (state, props, apiRef) => {
  const filterModel = props.filterModel ?? props.initialState?.filter?.filterModel ?? (0, _gridFilterState.getDefaultGridFilterModel)();
  return (0, _extends2.default)({}, state, {
    filter: {
      filterModel: (0, _gridFilterUtils.sanitizeFilterModel)(filterModel, props.disableMultipleColumnsFiltering, apiRef),
      visibleRowsLookup: {},
      filteredDescendantCountLookup: {}
    }
  });
};

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */
exports.filterStateInitializer = filterStateInitializer;
const useGridFilter = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridFilter');
  apiRef.current.registerControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: _gridFilterSelector.gridFilterModelSelector,
    changeEvent: 'filterModelChange'
  });
  const updateFilteredRows = React.useCallback(() => {
    apiRef.current.setState(state => {
      const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(state, apiRef.current.instanceId);
      const isRowMatchingFilters = props.filterMode === 'client' ? (0, _gridFilterUtils.buildAggregatedFilterApplier)(filterModel, apiRef) : null;
      const filteringResult = apiRef.current.applyStrategyProcessor('filtering', {
        isRowMatchingFilters,
        filterModel: filterModel ?? (0, _gridFilterState.getDefaultGridFilterModel)()
      });
      return (0, _extends2.default)({}, state, {
        filter: (0, _extends2.default)({}, state.filter, filteringResult)
      });
    });
    apiRef.current.publishEvent('filteredRowsSet');
  }, [props.filterMode, apiRef]);
  const addColumnMenuItem = React.useCallback((columnMenuItems, colDef) => {
    if (colDef == null || colDef.filterable === false || props.disableColumnFilter) {
      return columnMenuItems;
    }
    return [...columnMenuItems, 'ColumnMenuFilterItem'];
  }, [props.disableColumnFilter]);

  /**
   * API METHODS
   */
  const applyFilters = React.useCallback(() => {
    updateFilteredRows();
    apiRef.current.forceUpdate();
  }, [apiRef, updateFilteredRows]);
  const upsertFilterItem = React.useCallback(item => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const items = [...filterModel.items];
    const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);
    if (itemIndex === -1) {
      items.push(item);
    } else {
      items[itemIndex] = item;
    }
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items
    }), 'upsertFilterItem');
  }, [apiRef]);
  const upsertFilterItems = React.useCallback(items => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const existingItems = [...filterModel.items];
    items.forEach(item => {
      const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);
      if (itemIndex === -1) {
        existingItems.push(item);
      } else {
        existingItems[itemIndex] = item;
      }
    });
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items
    }), 'upsertFilterItems');
  }, [apiRef]);
  const deleteFilterItem = React.useCallback(itemToDelete => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const items = filterModel.items.filter(item => item.id !== itemToDelete.id);
    if (items.length === filterModel.items.length) {
      return;
    }
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items
    }), 'deleteFilterItem');
  }, [apiRef]);
  const showFilterPanel = React.useCallback(targetColumnField => {
    logger.debug('Displaying filter panel');
    if (targetColumnField) {
      const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
      const filterItemsWithValue = filterModel.items.filter(item => {
        if (item.value !== undefined) {
          return true;
        }
        const column = apiRef.current.getColumn(item.field);
        const filterOperator = column.filterOperators?.find(operator => operator.value === item.operator);
        const requiresFilterValue = typeof filterOperator?.requiresFilterValue === 'undefined' ? true : filterOperator?.requiresFilterValue;

        // Operators like `isEmpty` don't have and don't require `item.value`.
        // So we don't want to remove them from the filter model if `item.value === undefined`.
        // See https://github.com/mui/mui-x/issues/5402
        if (requiresFilterValue) {
          return false;
        }
        return true;
      });
      let newFilterItems;
      const filterItemOnTarget = filterItemsWithValue.find(item => item.field === targetColumnField);
      const targetColumn = apiRef.current.getColumn(targetColumnField);
      if (filterItemOnTarget) {
        newFilterItems = filterItemsWithValue;
      } else if (props.disableMultipleColumnsFiltering) {
        newFilterItems = [(0, _gridFilterUtils.cleanFilterItem)({
          field: targetColumnField,
          operator: targetColumn.filterOperators[0].value
        }, apiRef)];
      } else {
        newFilterItems = [...filterItemsWithValue, (0, _gridFilterUtils.cleanFilterItem)({
          field: targetColumnField,
          operator: targetColumn.filterOperators[0].value
        }, apiRef)];
      }
      apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
        items: newFilterItems
      }));
    }
    apiRef.current.showPreferences(_gridPreferencePanelsValue.GridPreferencePanelsValue.filters);
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const hideFilterPanel = React.useCallback(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);
  const setFilterLogicOperator = React.useCallback(logicOperator => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    if (filterModel.logicOperator === logicOperator) {
      return;
    }
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      logicOperator
    }), 'changeLogicOperator');
  }, [apiRef]);
  const setQuickFilterValues = React.useCallback(values => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    if ((0, _utils.isDeepEqual)(filterModel.quickFilterValues, values)) {
      return;
    }
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      quickFilterValues: [...values]
    }));
  }, [apiRef]);
  const setFilterModel = React.useCallback((model, reason) => {
    const currentModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    if (currentModel !== model) {
      logger.debug('Setting filter model');
      apiRef.current.updateControlState('filter', (0, _gridFilterUtils.mergeStateWithFilterModel)(model, props.disableMultipleColumnsFiltering, apiRef), reason);
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const filterApi = {
    setFilterLogicOperator,
    unstable_applyFilters: applyFilters,
    deleteFilterItem,
    upsertFilterItem,
    upsertFilterItems,
    setFilterModel,
    showFilterPanel,
    hideFilterPanel,
    setQuickFilterValues
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, filterApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    const filterModelToExport = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const shouldExportFilterModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the model is controlled
    props.filterModel != null ||
    // Always export if the model has been initialized
    props.initialState?.filter?.filterModel != null ||
    // Export if the model is not equal to the default value
    !(0, _utils.isDeepEqual)(filterModelToExport, (0, _gridFilterState.getDefaultGridFilterModel)());
    if (!shouldExportFilterModel) {
      return prevState;
    }
    return (0, _extends2.default)({}, prevState, {
      filter: {
        filterModel: filterModelToExport
      }
    });
  }, [apiRef, props.filterModel, props.initialState?.filter?.filterModel]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const filterModel = context.stateToRestore.filter?.filterModel;
    if (filterModel == null) {
      return params;
    }
    apiRef.current.updateControlState('filter', (0, _gridFilterUtils.mergeStateWithFilterModel)(filterModel, props.disableMultipleColumnsFiltering, apiRef), 'restoreState');
    return (0, _extends2.default)({}, params, {
      callbacks: [...params.callbacks, apiRef.current.unstable_applyFilters]
    });
  }, [apiRef, props.disableMultipleColumnsFiltering]);
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === _gridPreferencePanelsValue.GridPreferencePanelsValue.filters) {
      const FilterPanel = props.slots.filterPanel;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(FilterPanel, (0, _extends2.default)({}, props.slotProps?.filterPanel));
    }
    return initialValue;
  }, [props.slots.filterPanel, props.slotProps?.filterPanel]);
  const flatFilteringMethod = React.useCallback(params => {
    if (props.filterMode === 'client' && params.isRowMatchingFilters) {
      const tree = (0, _rows.gridRowTreeSelector)(apiRef);
      const rowIds = tree[_rows.GRID_ROOT_GROUP_ID].children;
      const filteredRowsLookup = {};
      for (let i = 0; i < rowIds.length; i += 1) {
        const rowId = rowIds[i];
        let isRowPassing;
        if (typeof rowId === 'string' && rowId.startsWith('auto-generated-group-footer')) {
          isRowPassing = true;
        } else {
          const {
            passingFilterItems,
            passingQuickFilterValues
          } = params.isRowMatchingFilters(rowId);
          isRowPassing = (0, _gridFilterUtils.passFilterLogic)([passingFilterItems], [passingQuickFilterValues], params.filterModel, apiRef);
        }
        filteredRowsLookup[rowId] = isRowPassing;
      }
      return {
        filteredRowsLookup,
        // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` are equals since no row is collapsed.
        visibleRowsLookup: filteredRowsLookup,
        filteredDescendantCountLookup: {}
      };
    }
    return {
      visibleRowsLookup: {},
      filteredRowsLookup: {},
      filteredDescendantCountLookup: {}
    };
  }, [apiRef, props.filterMode]);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuItem);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  (0, _strategyProcessing.useGridRegisterStrategyProcessor)(apiRef, _strategyProcessing.GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);

  /**
   * EVENTS
   */
  const handleColumnsChange = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const filterableColumnsLookup = (0, _gridColumnsSelector.gridFilterableColumnLookupSelector)(apiRef);
    const newFilterItems = filterModel.items.filter(item => item.field && filterableColumnsLookup[item.field]);
    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
        items: newFilterItems
      }));
    }
  }, [apiRef, logger]);
  const handleStrategyProcessorChange = React.useCallback(methodName => {
    if (methodName === 'filtering') {
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef]);

  // Do not call `apiRef.current.forceUpdate` to avoid re-render before updating the sorted rows.
  // Otherwise, the state is not consistent during the render
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'rowsSet', updateFilteredRows);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'rowExpansionChange', apiRef.current.unstable_applyFilters);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnsChange', handleColumnsChange);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);

  /**
   * 1ST RENDER
   */
  (0, _useFirstRender.useFirstRender)(() => {
    apiRef.current.unstable_applyFilters();
  });

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);
};
exports.useGridFilter = useGridFilter;