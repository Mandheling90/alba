"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columnsStateInitializer = void 0;
exports.useGridColumns = useGridColumns;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _useGridLogger = require("../../utils/useGridLogger");
var _gridColumnsSelector = require("./gridColumnsSelector");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _pipeProcessing = require("../../core/pipeProcessing");
var _gridColumnsUtils = require("./gridColumnsUtils");
var _preferencesPanel = require("../preferencesPanel");
var _colDef = require("../../../colDef");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const defaultColumnTypes = (0, _colDef.getGridDefaultColumnTypes)();
const columnsStateInitializer = (state, props, apiRef) => {
  const columnsState = (0, _gridColumnsUtils.createColumnsState)({
    apiRef,
    columnTypes: defaultColumnTypes,
    columnsToUpsert: props.columns,
    initialState: props.initialState?.columns,
    columnVisibilityModel: props.columnVisibilityModel ?? props.initialState?.columns?.columnVisibilityModel ?? {},
    keepOnlyColumnsToUpsert: true
  });
  return (0, _extends2.default)({}, state, {
    columns: columnsState
  });
};

/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
exports.columnsStateInitializer = columnsStateInitializer;
function useGridColumns(apiRef, props) {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridColumns');
  const columnTypes = defaultColumnTypes;
  const previousColumnsProp = React.useRef(props.columns);
  const previousColumnTypesProp = React.useRef(columnTypes);
  apiRef.current.registerControlState({
    stateId: 'visibleColumns',
    propModel: props.columnVisibilityModel,
    propOnChange: props.onColumnVisibilityModelChange,
    stateSelector: _gridColumnsSelector.gridColumnVisibilityModelSelector,
    changeEvent: 'columnVisibilityModelChange'
  });
  const setGridColumnsState = React.useCallback(columnsState => {
    logger.debug('Updating columns state.');
    apiRef.current.setState((0, _gridColumnsUtils.mergeColumnsState)(columnsState));
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
  }, [logger, apiRef]);

  /**
   * API METHODS
   */
  const getColumn = React.useCallback(field => (0, _gridColumnsSelector.gridColumnLookupSelector)(apiRef)[field], [apiRef]);
  const getAllColumns = React.useCallback(() => (0, _gridColumnsSelector.gridColumnDefinitionsSelector)(apiRef), [apiRef]);
  const getVisibleColumns = React.useCallback(() => (0, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector)(apiRef), [apiRef]);
  const getColumnIndex = React.useCallback((field, useVisibleColumns = true) => {
    const columns = useVisibleColumns ? (0, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector)(apiRef) : (0, _gridColumnsSelector.gridColumnDefinitionsSelector)(apiRef);
    return columns.findIndex(col => col.field === field);
  }, [apiRef]);
  const getColumnPosition = React.useCallback(field => {
    const index = getColumnIndex(field);
    return (0, _gridColumnsSelector.gridColumnPositionsSelector)(apiRef)[index];
  }, [apiRef, getColumnIndex]);
  const setColumnVisibilityModel = React.useCallback(model => {
    const currentModel = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
    if (currentModel !== model) {
      apiRef.current.setState(state => (0, _extends2.default)({}, state, {
        columns: (0, _gridColumnsUtils.createColumnsState)({
          apiRef,
          columnTypes,
          columnsToUpsert: [],
          initialState: undefined,
          columnVisibilityModel: model,
          keepOnlyColumnsToUpsert: false
        })
      }));
      apiRef.current.forceUpdate();
    }
  }, [apiRef, columnTypes]);
  const updateColumns = React.useCallback(columns => {
    const columnsState = (0, _gridColumnsUtils.createColumnsState)({
      apiRef,
      columnTypes,
      columnsToUpsert: columns,
      initialState: undefined,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, setGridColumnsState, columnTypes]);
  const setColumnVisibility = React.useCallback((field, isVisible) => {
    const columnVisibilityModel = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
    const isCurrentlyVisible = columnVisibilityModel[field] ?? true;
    if (isVisible !== isCurrentlyVisible) {
      const newModel = (0, _extends2.default)({}, columnVisibilityModel, {
        [field]: isVisible
      });
      apiRef.current.setColumnVisibilityModel(newModel);
    }
  }, [apiRef]);
  const getColumnIndexRelativeToVisibleColumns = React.useCallback(field => {
    const allColumns = (0, _gridColumnsSelector.gridColumnFieldsSelector)(apiRef);
    return allColumns.findIndex(col => col === field);
  }, [apiRef]);
  const setColumnIndex = React.useCallback((field, targetIndexPosition) => {
    const allColumns = (0, _gridColumnsSelector.gridColumnFieldsSelector)(apiRef);
    const oldIndexPosition = getColumnIndexRelativeToVisibleColumns(field);
    if (oldIndexPosition === targetIndexPosition) {
      return;
    }
    logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);
    const updatedColumns = [...allColumns];
    const fieldRemoved = updatedColumns.splice(oldIndexPosition, 1)[0];
    updatedColumns.splice(targetIndexPosition, 0, fieldRemoved);
    setGridColumnsState((0, _extends2.default)({}, (0, _gridColumnsSelector.gridColumnsStateSelector)(apiRef.current.state), {
      orderedFields: updatedColumns
    }));
    const params = {
      column: apiRef.current.getColumn(field),
      targetIndex: apiRef.current.getColumnIndexRelativeToVisibleColumns(field),
      oldIndex: oldIndexPosition
    };
    apiRef.current.publishEvent('columnIndexChange', params);
  }, [apiRef, logger, setGridColumnsState, getColumnIndexRelativeToVisibleColumns]);
  const setColumnWidth = React.useCallback((field, width) => {
    logger.debug(`Updating column ${field} width to ${width}`);
    const column = apiRef.current.getColumn(field);
    const newColumn = (0, _extends2.default)({}, column, {
      width
    });
    apiRef.current.updateColumns([newColumn]);
    apiRef.current.publishEvent('columnWidthChange', {
      element: apiRef.current.getColumnHeaderElement(field),
      colDef: newColumn,
      width
    });
  }, [apiRef, logger]);
  const columnApi = {
    getColumn,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnIndexRelativeToVisibleColumns,
    updateColumns,
    setColumnVisibilityModel,
    setColumnVisibility,
    setColumnWidth
  };
  const columnReorderApi = {
    setColumnIndex
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, columnApi, 'public');
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, columnReorderApi, props.signature === _useGridApiEventHandler.GridSignature.DataGrid ? 'private' : 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    const columnsStateToExport = {};
    const columnVisibilityModelToExport = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
    const shouldExportColumnVisibilityModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the model is controlled
    props.columnVisibilityModel != null ||
    // Always export if the model has been initialized
    // TODO v6 Do a nullish check instead to export even if the initial model equals "{}"
    Object.keys(props.initialState?.columns?.columnVisibilityModel ?? {}).length > 0 ||
    // Always export if the model is not empty
    Object.keys(columnVisibilityModelToExport).length > 0;
    if (shouldExportColumnVisibilityModel) {
      columnsStateToExport.columnVisibilityModel = columnVisibilityModelToExport;
    }
    columnsStateToExport.orderedFields = (0, _gridColumnsSelector.gridColumnFieldsSelector)(apiRef);
    const columns = (0, _gridColumnsSelector.gridColumnDefinitionsSelector)(apiRef);
    const dimensions = {};
    columns.forEach(colDef => {
      if (colDef.hasBeenResized) {
        const colDefDimensions = {};
        _gridColumnsUtils.COLUMNS_DIMENSION_PROPERTIES.forEach(propertyName => {
          let propertyValue = colDef[propertyName];
          if (propertyValue === Infinity) {
            propertyValue = -1;
          }
          colDefDimensions[propertyName] = propertyValue;
        });
        dimensions[colDef.field] = colDefDimensions;
      }
    });
    if (Object.keys(dimensions).length > 0) {
      columnsStateToExport.dimensions = dimensions;
    }
    return (0, _extends2.default)({}, prevState, {
      columns: columnsStateToExport
    });
  }, [apiRef, props.columnVisibilityModel, props.initialState?.columns]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const columnVisibilityModelToImport = context.stateToRestore.columns?.columnVisibilityModel;
    const initialState = context.stateToRestore.columns;
    if (columnVisibilityModelToImport == null && initialState == null) {
      return params;
    }
    const columnsState = (0, _gridColumnsUtils.createColumnsState)({
      apiRef,
      columnTypes,
      columnsToUpsert: [],
      initialState,
      columnVisibilityModel: columnVisibilityModelToImport,
      keepOnlyColumnsToUpsert: false
    });
    apiRef.current.setState((0, _gridColumnsUtils.mergeColumnsState)(columnsState));
    if (initialState != null) {
      apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
    }
    return params;
  }, [apiRef, columnTypes]);
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === _preferencesPanel.GridPreferencePanelsValue.columns) {
      const ColumnsPanel = props.slots.columnsPanel;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(ColumnsPanel, (0, _extends2.default)({}, props.slotProps?.columnsPanel));
    }
    return initialValue;
  }, [props.slots.columnsPanel, props.slotProps?.columnsPanel]);
  const addColumnMenuItems = React.useCallback(columnMenuItems => {
    if (props.disableColumnSelector) {
      return columnMenuItems;
    }
    return [...columnMenuItems, 'ColumnMenuColumnsItem'];
  }, [props.disableColumnSelector]);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuItems);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'preferencePanel', preferencePanelPreProcessing);

  /**
   * EVENTS
   */
  const prevInnerWidth = React.useRef(null);
  const handleGridSizeChange = viewportInnerSize => {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      setGridColumnsState((0, _gridColumnsUtils.hydrateColumnsWidth)((0, _gridColumnsSelector.gridColumnsStateSelector)(apiRef.current.state), viewportInnerSize.width));
    }
  };
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);

  /**
   * APPLIERS
   */
  const hydrateColumns = React.useCallback(() => {
    logger.info(`Columns pipe processing have changed, regenerating the columns`);
    const columnsState = (0, _gridColumnsUtils.createColumnsState)({
      apiRef,
      columnTypes,
      columnsToUpsert: [],
      initialState: undefined,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, logger, setGridColumnsState, columnTypes]);
  (0, _pipeProcessing.useGridRegisterPipeApplier)(apiRef, 'hydrateColumns', hydrateColumns);

  /**
   * EFFECTS
   */
  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    logger.info(`GridColumns have changed, new length ${props.columns.length}`);
    if (previousColumnsProp.current === props.columns && previousColumnTypesProp.current === columnTypes) {
      return;
    }
    const columnsState = (0, _gridColumnsUtils.createColumnsState)({
      apiRef,
      columnTypes,
      initialState: undefined,
      // If the user provides a model, we don't want to set it in the state here because it has it's dedicated `useEffect` which calls `setColumnVisibilityModel`
      columnsToUpsert: props.columns,
      keepOnlyColumnsToUpsert: true
    });
    previousColumnsProp.current = props.columns;
    previousColumnTypesProp.current = columnTypes;
    setGridColumnsState(columnsState);
  }, [logger, apiRef, setGridColumnsState, props.columns, columnTypes]);
  React.useEffect(() => {
    if (props.columnVisibilityModel !== undefined) {
      apiRef.current.setColumnVisibilityModel(props.columnVisibilityModel);
    }
  }, [apiRef, logger, props.columnVisibilityModel]);
}