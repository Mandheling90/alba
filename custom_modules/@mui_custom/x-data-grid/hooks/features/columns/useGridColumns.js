import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnFieldsSelector, gridColumnDefinitionsSelector, gridColumnLookupSelector, gridColumnsStateSelector, gridColumnVisibilityModelSelector, gridVisibleColumnDefinitionsSelector, gridColumnPositionsSelector } from './gridColumnsSelector';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridRegisterPipeProcessor, useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { hydrateColumnsWidth, createColumnsState, mergeColumnsState, COLUMNS_DIMENSION_PROPERTIES } from './gridColumnsUtils';
import { GridPreferencePanelsValue } from '../preferencesPanel';
import { getGridDefaultColumnTypes } from '../../../colDef';
import { jsx as _jsx } from "react/jsx-runtime";
const defaultColumnTypes = getGridDefaultColumnTypes();
export const columnsStateInitializer = (state, props, apiRef) => {
  var _props$initialState, _ref, _props$columnVisibili, _props$initialState2, _props$initialState2$;
  const columnsState = createColumnsState({
    apiRef,
    columnTypes: defaultColumnTypes,
    columnsToUpsert: props.columns,
    initialState: (_props$initialState = props.initialState) == null ? void 0 : _props$initialState.columns,
    columnVisibilityModel: (_ref = (_props$columnVisibili = props.columnVisibilityModel) != null ? _props$columnVisibili : (_props$initialState2 = props.initialState) == null ? void 0 : (_props$initialState2$ = _props$initialState2.columns) == null ? void 0 : _props$initialState2$.columnVisibilityModel) != null ? _ref : {},
    keepOnlyColumnsToUpsert: true
  });
  return _extends({}, state, {
    columns: columnsState
  });
};

/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
export function useGridColumns(apiRef, props) {
  var _props$initialState4, _props$slotProps2;
  const logger = useGridLogger(apiRef, 'useGridColumns');
  const columnTypes = defaultColumnTypes;
  const previousColumnsProp = React.useRef(props.columns);
  const previousColumnTypesProp = React.useRef(columnTypes);
  apiRef.current.registerControlState({
    stateId: 'visibleColumns',
    propModel: props.columnVisibilityModel,
    propOnChange: props.onColumnVisibilityModelChange,
    stateSelector: gridColumnVisibilityModelSelector,
    changeEvent: 'columnVisibilityModelChange'
  });
  const setGridColumnsState = React.useCallback(columnsState => {
    logger.debug('Updating columns state.');
    apiRef.current.setState(mergeColumnsState(columnsState));
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
  }, [logger, apiRef]);

  /**
   * API METHODS
   */
  const getColumn = React.useCallback(field => gridColumnLookupSelector(apiRef)[field], [apiRef]);
  const getAllColumns = React.useCallback(() => gridColumnDefinitionsSelector(apiRef), [apiRef]);
  const getVisibleColumns = React.useCallback(() => gridVisibleColumnDefinitionsSelector(apiRef), [apiRef]);
  const getColumnIndex = React.useCallback((field, useVisibleColumns = true) => {
    const columns = useVisibleColumns ? gridVisibleColumnDefinitionsSelector(apiRef) : gridColumnDefinitionsSelector(apiRef);
    return columns.findIndex(col => col.field === field);
  }, [apiRef]);
  const getColumnPosition = React.useCallback(field => {
    const index = getColumnIndex(field);
    return gridColumnPositionsSelector(apiRef)[index];
  }, [apiRef, getColumnIndex]);
  const setColumnVisibilityModel = React.useCallback(model => {
    const currentModel = gridColumnVisibilityModelSelector(apiRef);
    if (currentModel !== model) {
      apiRef.current.setState(state => _extends({}, state, {
        columns: createColumnsState({
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
    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      columnsToUpsert: columns,
      initialState: undefined,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, setGridColumnsState, columnTypes]);
  const setColumnVisibility = React.useCallback((field, isVisible) => {
    var _columnVisibilityMode;
    const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
    const isCurrentlyVisible = (_columnVisibilityMode = columnVisibilityModel[field]) != null ? _columnVisibilityMode : true;
    if (isVisible !== isCurrentlyVisible) {
      const newModel = _extends({}, columnVisibilityModel, {
        [field]: isVisible
      });
      apiRef.current.setColumnVisibilityModel(newModel);
    }
  }, [apiRef]);
  const getColumnIndexRelativeToVisibleColumns = React.useCallback(field => {
    const allColumns = gridColumnFieldsSelector(apiRef);
    return allColumns.findIndex(col => col === field);
  }, [apiRef]);
  const setColumnIndex = React.useCallback((field, targetIndexPosition) => {
    const allColumns = gridColumnFieldsSelector(apiRef);
    const oldIndexPosition = getColumnIndexRelativeToVisibleColumns(field);
    if (oldIndexPosition === targetIndexPosition) {
      return;
    }
    logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);
    const updatedColumns = [...allColumns];
    const fieldRemoved = updatedColumns.splice(oldIndexPosition, 1)[0];
    updatedColumns.splice(targetIndexPosition, 0, fieldRemoved);
    setGridColumnsState(_extends({}, gridColumnsStateSelector(apiRef.current.state), {
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
    const newColumn = _extends({}, column, {
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
  useGridApiMethod(apiRef, columnApi, 'public');
  useGridApiMethod(apiRef, columnReorderApi, props.signature === GridSignature.DataGrid ? 'private' : 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    var _props$initialState$c, _props$initialState3, _props$initialState3$;
    const columnsStateToExport = {};
    const columnVisibilityModelToExport = gridColumnVisibilityModelSelector(apiRef);
    const shouldExportColumnVisibilityModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the model is controlled
    props.columnVisibilityModel != null ||
    // Always export if the model has been initialized
    // TODO v6 Do a nullish check instead to export even if the initial model equals "{}"
    Object.keys((_props$initialState$c = (_props$initialState3 = props.initialState) == null ? void 0 : (_props$initialState3$ = _props$initialState3.columns) == null ? void 0 : _props$initialState3$.columnVisibilityModel) != null ? _props$initialState$c : {}).length > 0 ||
    // Always export if the model is not empty
    Object.keys(columnVisibilityModelToExport).length > 0;
    if (shouldExportColumnVisibilityModel) {
      columnsStateToExport.columnVisibilityModel = columnVisibilityModelToExport;
    }
    columnsStateToExport.orderedFields = gridColumnFieldsSelector(apiRef);
    const columns = gridColumnDefinitionsSelector(apiRef);
    const dimensions = {};
    columns.forEach(colDef => {
      if (colDef.hasBeenResized) {
        const colDefDimensions = {};
        COLUMNS_DIMENSION_PROPERTIES.forEach(propertyName => {
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
    return _extends({}, prevState, {
      columns: columnsStateToExport
    });
  }, [apiRef, props.columnVisibilityModel, (_props$initialState4 = props.initialState) == null ? void 0 : _props$initialState4.columns]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    var _context$stateToResto;
    const columnVisibilityModelToImport = (_context$stateToResto = context.stateToRestore.columns) == null ? void 0 : _context$stateToResto.columnVisibilityModel;
    const initialState = context.stateToRestore.columns;
    if (columnVisibilityModelToImport == null && initialState == null) {
      return params;
    }
    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      columnsToUpsert: [],
      initialState,
      columnVisibilityModel: columnVisibilityModelToImport,
      keepOnlyColumnsToUpsert: false
    });
    apiRef.current.setState(mergeColumnsState(columnsState));
    if (initialState != null) {
      apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
    }
    return params;
  }, [apiRef, columnTypes]);
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === GridPreferencePanelsValue.columns) {
      var _props$slotProps;
      const ColumnsPanel = props.slots.columnsPanel;
      return /*#__PURE__*/_jsx(ColumnsPanel, _extends({}, (_props$slotProps = props.slotProps) == null ? void 0 : _props$slotProps.columnsPanel));
    }
    return initialValue;
  }, [props.slots.columnsPanel, (_props$slotProps2 = props.slotProps) == null ? void 0 : _props$slotProps2.columnsPanel]);
  const addColumnMenuItems = React.useCallback(columnMenuItems => {
    if (props.disableColumnSelector) {
      return columnMenuItems;
    }
    return [...columnMenuItems, 'ColumnMenuColumnsItem'];
  }, [props.disableColumnSelector]);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItems);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);

  /**
   * EVENTS
   */
  const prevInnerWidth = React.useRef(null);
  const handleGridSizeChange = viewportInnerSize => {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      setGridColumnsState(hydrateColumnsWidth(gridColumnsStateSelector(apiRef.current.state), viewportInnerSize.width));
    }
  };
  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);

  /**
   * APPLIERS
   */
  const hydrateColumns = React.useCallback(() => {
    logger.info(`Columns pipe processing have changed, regenerating the columns`);
    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      columnsToUpsert: [],
      initialState: undefined,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, logger, setGridColumnsState, columnTypes]);
  useGridRegisterPipeApplier(apiRef, 'hydrateColumns', hydrateColumns);

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
    const columnsState = createColumnsState({
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