"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridRowEditing = void 0;
var _toPropertyKey2 = _interopRequireDefault(require("@babel/runtime/helpers/toPropertyKey"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _gridEditRowModel = require("../../../models/gridEditRowModel");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _gridEditingSelectors = require("./gridEditingSelectors");
var _keyboardUtils = require("../../../utils/keyboardUtils");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
var _warning = require("../../../utils/warning");
var _gridRowsSelector = require("../rows/gridRowsSelector");
var _utils2 = require("../../../utils/utils");
var _gridRowParams = require("../../../models/params/gridRowParams");
const _excluded = ["id"],
  _excluded2 = ["id"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const missingOnProcessRowUpdateErrorWarning = (0, _warning.buildWarning)(['MUI: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.', 'To handle the error pass a callback to the `onProcessRowUpdateError` prop, e.g. `<DataGrid onProcessRowUpdateError={(error) => ...} />`.', 'For more detail, see http://mui.com/components/data-grid/editing/#persistence.'], 'error');
const useGridRowEditing = (apiRef, props) => {
  const [rowModesModel, setRowModesModel] = React.useState({});
  const rowModesModelRef = React.useRef(rowModesModel);
  const prevRowModesModel = React.useRef({});
  const focusTimeout = React.useRef(null);
  const nextFocusedCell = React.useRef(null);
  const {
    processRowUpdate,
    onProcessRowUpdateError,
    rowModesModel: rowModesModelProp,
    onRowModesModelChange
  } = props;
  const runIfEditModeIsRow = callback => (...args) => {
    if (props.editMode === _gridEditRowModel.GridEditModes.Row) {
      callback(...args);
    }
  };
  const throwIfNotEditable = React.useCallback((id, field) => {
    const params = apiRef.current.getCellParams(id, field);
    if (!apiRef.current.isCellEditable(params)) {
      throw new Error(`MUI: The cell with id=${id} and field=${field} is not editable.`);
    }
  }, [apiRef]);
  const throwIfNotInMode = React.useCallback((id, mode) => {
    if (apiRef.current.getRowMode(id) !== mode) {
      throw new Error(`MUI: The row with id=${id} is not in ${mode} mode.`);
    }
  }, [apiRef]);
  const handleCellDoubleClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }
    if (apiRef.current.getRowMode(params.id) === _gridEditRowModel.GridRowModes.Edit) {
      return;
    }
    const rowParams = apiRef.current.getRowParams(params.id);
    const newParams = (0, _extends2.default)({}, rowParams, {
      field: params.field,
      reason: _gridRowParams.GridRowEditStartReasons.cellDoubleClick
    });
    apiRef.current.publishEvent('rowEditStart', newParams, event);
  }, [apiRef]);
  const handleCellFocusIn = React.useCallback(params => {
    nextFocusedCell.current = params;
  }, []);
  const handleCellFocusOut = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }
    if (apiRef.current.getRowMode(params.id) === _gridEditRowModel.GridRowModes.View) {
      return;
    }
    // The mechanism to detect if we can stop editing a row is different from
    // the cell editing. Instead of triggering it when clicking outside a cell,
    // we must check if another cell in the same row was not clicked. To achieve
    // that, first we keep track of all cells that gained focus. When a cell loses
    // focus we check if the next cell that received focus is from a different row.
    nextFocusedCell.current = null;
    focusTimeout.current = setTimeout(() => {
      focusTimeout.current = null;
      if (nextFocusedCell.current?.id !== params.id) {
        // The row might have been deleted during the click
        if (!apiRef.current.getRow(params.id)) {
          return;
        }

        // The row may already changed its mode
        if (apiRef.current.getRowMode(params.id) === _gridEditRowModel.GridRowModes.View) {
          return;
        }
        const rowParams = apiRef.current.getRowParams(params.id);
        const newParams = (0, _extends2.default)({}, rowParams, {
          field: params.field,
          reason: _gridRowParams.GridRowEditStopReasons.rowFocusOut
        });
        apiRef.current.publishEvent('rowEditStop', newParams, event);
      }
    });
  }, [apiRef]);
  React.useEffect(() => {
    return () => {
      clearTimeout(focusTimeout.current);
    };
  }, []);
  const handleCellKeyDown = React.useCallback((params, event) => {
    if (params.cellMode === _gridEditRowModel.GridRowModes.Edit) {
      // Wait until IME is settled for Asian languages like Japanese and Chinese
      // TODO: `event.which` is deprecated but this is a temporary workaround
      if (event.which === 229) {
        return;
      }
      let reason;
      if (event.key === 'Escape') {
        reason = _gridRowParams.GridRowEditStopReasons.escapeKeyDown;
      } else if (event.key === 'Enter') {
        reason = _gridRowParams.GridRowEditStopReasons.enterKeyDown;
      } else if (event.key === 'Tab') {
        const columnFields = (0, _gridColumnsSelector.gridColumnFieldsSelector)(apiRef).filter(field => apiRef.current.isCellEditable(apiRef.current.getCellParams(params.id, field)));
        if (event.shiftKey) {
          if (params.field === columnFields[0]) {
            // Exit if user pressed Shift+Tab on the first field
            reason = _gridRowParams.GridRowEditStopReasons.shiftTabKeyDown;
          }
        } else if (params.field === columnFields[columnFields.length - 1]) {
          // Exit if user pressed Tab on the last field
          reason = _gridRowParams.GridRowEditStopReasons.tabKeyDown;
        }

        // Always prevent going to the next element in the tab sequence because the focus is
        // handled manually to support edit components rendered inside Portals
        event.preventDefault();
        if (!reason) {
          const index = columnFields.findIndex(field => field === params.field);
          const nextFieldToFocus = columnFields[event.shiftKey ? index - 1 : index + 1];
          apiRef.current.setCellFocus(params.id, nextFieldToFocus);
        }
      }
      if (reason) {
        const rowParams = apiRef.current.getRowParams(params.id);
        const newParams = (0, _extends2.default)({}, rowParams, {
          reason,
          field: params.field
        });
        apiRef.current.publishEvent('rowEditStop', newParams, event);
      }
    } else if (params.isEditable) {
      let reason;
      if (event.key === ' ') {
        return; // Space scrolls to the last row
      }

      if ((0, _keyboardUtils.isPrintableKey)(event)) {
        reason = _gridRowParams.GridRowEditStartReasons.printableKeyDown;
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        reason = _gridRowParams.GridRowEditStartReasons.printableKeyDown;
      } else if (event.key === 'Enter') {
        reason = _gridRowParams.GridRowEditStartReasons.enterKeyDown;
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        // Delete on Windows, Backspace on macOS
        reason = _gridRowParams.GridRowEditStartReasons.deleteKeyDown;
      }
      if (reason) {
        const rowParams = apiRef.current.getRowParams(params.id);
        const newParams = (0, _extends2.default)({}, rowParams, {
          field: params.field,
          key: event.key,
          reason
        });
        apiRef.current.publishEvent('rowEditStart', newParams, event);
      }
    }
  }, [apiRef]);
  const handleRowEditStart = React.useCallback(params => {
    const {
      id,
      field,
      reason,
      key
    } = params;
    const startRowEditModeParams = {
      id,
      fieldToFocus: field
    };
    if (reason === _gridRowParams.GridRowEditStartReasons.printableKeyDown) {
      if (React.version.startsWith('17')) {
        // In React 17, cleaning the input is enough.
        // The sequence of events makes the key pressed by the end-users update the textbox directly.
        startRowEditModeParams.deleteValue = !!field;
      } else {
        startRowEditModeParams.initialValue = key;
      }
    } else if (reason === _gridRowParams.GridRowEditStartReasons.deleteKeyDown) {
      startRowEditModeParams.deleteValue = !!field;
    }
    apiRef.current.startRowEditMode(startRowEditModeParams);
  }, [apiRef]);
  const handleRowEditStop = React.useCallback(params => {
    const {
      id,
      reason,
      field
    } = params;
    apiRef.current.runPendingEditCellValueMutation(id);
    let cellToFocusAfter;
    if (reason === _gridRowParams.GridRowEditStopReasons.enterKeyDown) {
      cellToFocusAfter = 'below';
    } else if (reason === _gridRowParams.GridRowEditStopReasons.tabKeyDown) {
      cellToFocusAfter = 'right';
    } else if (reason === _gridRowParams.GridRowEditStopReasons.shiftTabKeyDown) {
      cellToFocusAfter = 'left';
    }
    const ignoreModifications = reason === 'escapeKeyDown';
    apiRef.current.stopRowEditMode({
      id,
      ignoreModifications,
      field,
      cellToFocusAfter
    });
  }, [apiRef]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellDoubleClick', runIfEditModeIsRow(handleCellDoubleClick));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellFocusIn', runIfEditModeIsRow(handleCellFocusIn));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellFocusOut', runIfEditModeIsRow(handleCellFocusOut));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellKeyDown', runIfEditModeIsRow(handleCellKeyDown));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'rowEditStart', runIfEditModeIsRow(handleRowEditStart));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'rowEditStop', runIfEditModeIsRow(handleRowEditStop));
  (0, _useGridApiEventHandler.useGridApiOptionHandler)(apiRef, 'rowEditStart', props.onRowEditStart);
  (0, _useGridApiEventHandler.useGridApiOptionHandler)(apiRef, 'rowEditStop', props.onRowEditStop);
  const getRowMode = React.useCallback(id => {
    if (props.editMode === _gridEditRowModel.GridEditModes.Cell) {
      return _gridEditRowModel.GridRowModes.View;
    }
    const editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    const isEditing = editingState[id] && Object.keys(editingState[id]).length > 0;
    return isEditing ? _gridEditRowModel.GridRowModes.Edit : _gridEditRowModel.GridRowModes.View;
  }, [apiRef, props.editMode]);
  const updateRowModesModel = (0, _utils.unstable_useEventCallback)(newModel => {
    const isNewModelDifferentFromProp = newModel !== props.rowModesModel;
    if (onRowModesModelChange && isNewModelDifferentFromProp) {
      onRowModesModelChange(newModel, {});
    }
    if (props.rowModesModel && isNewModelDifferentFromProp) {
      return; // The prop always win
    }

    setRowModesModel(newModel);
    rowModesModelRef.current = newModel;
    apiRef.current.publishEvent('rowModesModelChange', newModel);
  });
  const updateRowInRowModesModel = React.useCallback((id, newProps) => {
    const newModel = (0, _extends2.default)({}, rowModesModelRef.current);
    if (newProps !== null) {
      newModel[id] = (0, _extends2.default)({}, newProps);
    } else {
      delete newModel[id];
    }
    updateRowModesModel(newModel);
  }, [updateRowModesModel]);
  const updateOrDeleteRowState = React.useCallback((id, newProps) => {
    apiRef.current.setState(state => {
      const newEditingState = (0, _extends2.default)({}, state.editRows);
      if (newProps !== null) {
        newEditingState[id] = newProps;
      } else {
        delete newEditingState[id];
      }
      return (0, _extends2.default)({}, state, {
        editRows: newEditingState
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  const updateOrDeleteFieldState = React.useCallback((id, field, newProps) => {
    apiRef.current.setState(state => {
      const newEditingState = (0, _extends2.default)({}, state.editRows);
      if (newProps !== null) {
        newEditingState[id] = (0, _extends2.default)({}, newEditingState[id], {
          [field]: (0, _extends2.default)({}, newProps)
        });
      } else {
        delete newEditingState[id][field];
        if (Object.keys(newEditingState[id]).length === 0) {
          delete newEditingState[id];
        }
      }
      return (0, _extends2.default)({}, state, {
        editRows: newEditingState
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  const startRowEditMode = React.useCallback(params => {
    const {
        id
      } = params,
      other = (0, _objectWithoutPropertiesLoose2.default)(params, _excluded);
    throwIfNotInMode(id, _gridEditRowModel.GridRowModes.View);
    updateRowInRowModesModel(id, (0, _extends2.default)({
      mode: _gridEditRowModel.GridRowModes.Edit
    }, other));
  }, [throwIfNotInMode, updateRowInRowModesModel]);
  const updateStateToStartRowEditMode = (0, _utils.unstable_useEventCallback)(params => {
    const {
      id,
      fieldToFocus,
      deleteValue,
      initialValue
    } = params;
    const columnFields = (0, _gridColumnsSelector.gridColumnFieldsSelector)(apiRef);
    const newProps = columnFields.reduce((acc, field) => {
      const cellParams = apiRef.current.getCellParams(id, field);
      if (!cellParams.isEditable) {
        return acc;
      }
      let newValue = apiRef.current.getCellValue(id, field);
      if (fieldToFocus === field && (deleteValue || initialValue)) {
        newValue = deleteValue ? '' : initialValue;
      }
      acc[field] = {
        value: newValue,
        error: false,
        isProcessingProps: false
      };
      return acc;
    }, {});
    updateOrDeleteRowState(id, newProps);
    if (fieldToFocus) {
      apiRef.current.setCellFocus(id, fieldToFocus);
    }
  });
  const stopRowEditMode = React.useCallback(params => {
    const {
        id
      } = params,
      other = (0, _objectWithoutPropertiesLoose2.default)(params, _excluded2);
    throwIfNotInMode(id, _gridEditRowModel.GridRowModes.Edit);
    updateRowInRowModesModel(id, (0, _extends2.default)({
      mode: _gridEditRowModel.GridRowModes.View
    }, other));
  }, [throwIfNotInMode, updateRowInRowModesModel]);
  const updateStateToStopRowEditMode = (0, _utils.unstable_useEventCallback)(params => {
    const {
      id,
      ignoreModifications,
      field: focusedField,
      cellToFocusAfter = 'none'
    } = params;
    apiRef.current.runPendingEditCellValueMutation(id);
    const finishRowEditMode = () => {
      if (cellToFocusAfter !== 'none' && focusedField) {
        apiRef.current.moveFocusToRelativeCell(id, focusedField, cellToFocusAfter);
      }
      updateOrDeleteRowState(id, null);
      updateRowInRowModesModel(id, null);
    };
    if (ignoreModifications) {
      finishRowEditMode();
      return;
    }
    const editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    const row = apiRef.current.getRow(id);
    const isSomeFieldProcessingProps = Object.values(editingState[id]).some(fieldProps => fieldProps.isProcessingProps);
    if (isSomeFieldProcessingProps) {
      prevRowModesModel.current[id].mode = _gridEditRowModel.GridRowModes.Edit;
      return;
    }
    const hasSomeFieldWithError = Object.values(editingState[id]).some(fieldProps => fieldProps.error);
    if (hasSomeFieldWithError) {
      prevRowModesModel.current[id].mode = _gridEditRowModel.GridRowModes.Edit;
      // Revert the mode in the rowModesModel prop back to "edit"
      updateRowInRowModesModel(id, {
        mode: _gridEditRowModel.GridRowModes.Edit
      });
      return;
    }
    const rowUpdate = apiRef.current.getRowWithUpdatedValuesFromRowEditing(id);
    if (processRowUpdate) {
      const handleError = errorThrown => {
        prevRowModesModel.current[id].mode = _gridEditRowModel.GridRowModes.Edit;
        // Revert the mode in the rowModesModel prop back to "edit"
        updateRowInRowModesModel(id, {
          mode: _gridEditRowModel.GridRowModes.Edit
        });
        if (onProcessRowUpdateError) {
          onProcessRowUpdateError(errorThrown);
        } else {
          missingOnProcessRowUpdateErrorWarning();
        }
      };
      try {
        Promise.resolve(processRowUpdate(rowUpdate, row)).then(finalRowUpdate => {
          apiRef.current.updateRows([finalRowUpdate]);
          finishRowEditMode();
        }).catch(handleError);
      } catch (errorThrown) {
        handleError(errorThrown);
      }
    } else {
      apiRef.current.updateRows([rowUpdate]);
      finishRowEditMode();
    }
  });
  const setRowEditingEditCellValue = React.useCallback(params => {
    const {
      id,
      field,
      value,
      debounceMs,
      unstable_skipValueParser: skipValueParser
    } = params;
    throwIfNotEditable(id, field);
    const column = apiRef.current.getColumn(field);
    const row = apiRef.current.getRow(id);
    let parsedValue = value;
    if (column.valueParser && !skipValueParser) {
      parsedValue = column.valueParser(value, apiRef.current.getCellParams(id, field));
    }
    let editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    let newProps = (0, _extends2.default)({}, editingState[id][field], {
      value: parsedValue,
      changeReason: debounceMs ? 'debouncedSetEditCellValue' : 'setEditCellValue'
    });
    if (!column.preProcessEditCellProps) {
      updateOrDeleteFieldState(id, field, newProps);
    }
    return new Promise(resolve => {
      const promises = [];
      if (column.preProcessEditCellProps) {
        const hasChanged = newProps.value !== editingState[id][field].value;
        newProps = (0, _extends2.default)({}, newProps, {
          isProcessingProps: true
        });
        updateOrDeleteFieldState(id, field, newProps);
        const _editingState$id = editingState[id],
          otherFieldsProps = (0, _objectWithoutPropertiesLoose2.default)(_editingState$id, [field].map(_toPropertyKey2.default));
        const promise = Promise.resolve(column.preProcessEditCellProps({
          id,
          row,
          props: newProps,
          hasChanged,
          otherFieldsProps
        })).then(processedProps => {
          // Check again if the row is in edit mode because the user may have
          // discarded the changes while the props were being processed.
          if (apiRef.current.getRowMode(id) === _gridEditRowModel.GridRowModes.View) {
            resolve(false);
            return;
          }
          editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
          processedProps = (0, _extends2.default)({}, processedProps, {
            isProcessingProps: false
          });
          // We don't reuse the value from the props pre-processing because when the
          // promise resolves it may be already outdated. The only exception to this rule
          // is when there's no pre-processing.
          processedProps.value = column.preProcessEditCellProps ? editingState[id][field].value : parsedValue;
          updateOrDeleteFieldState(id, field, processedProps);
        });
        promises.push(promise);
      }
      Object.entries(editingState[id]).forEach(([thisField, fieldProps]) => {
        if (thisField === field) {
          return;
        }
        const fieldColumn = apiRef.current.getColumn(thisField);
        if (!fieldColumn.preProcessEditCellProps) {
          return;
        }
        fieldProps = (0, _extends2.default)({}, fieldProps, {
          isProcessingProps: true
        });
        updateOrDeleteFieldState(id, thisField, fieldProps);
        editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
        const _editingState$id2 = editingState[id],
          otherFieldsProps = (0, _objectWithoutPropertiesLoose2.default)(_editingState$id2, [thisField].map(_toPropertyKey2.default));
        const promise = Promise.resolve(fieldColumn.preProcessEditCellProps({
          id,
          row,
          props: fieldProps,
          hasChanged: false,
          otherFieldsProps
        })).then(processedProps => {
          // Check again if the row is in edit mode because the user may have
          // discarded the changes while the props were being processed.
          if (apiRef.current.getRowMode(id) === _gridEditRowModel.GridRowModes.View) {
            resolve(false);
            return;
          }
          processedProps = (0, _extends2.default)({}, processedProps, {
            isProcessingProps: false
          });
          updateOrDeleteFieldState(id, thisField, processedProps);
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        if (apiRef.current.getRowMode(id) === _gridEditRowModel.GridRowModes.Edit) {
          editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
          resolve(!editingState[id][field].error);
        } else {
          resolve(false);
        }
      });
    });
  }, [apiRef, throwIfNotEditable, updateOrDeleteFieldState]);
  const getRowWithUpdatedValuesFromRowEditing = React.useCallback(id => {
    const editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    const row = apiRef.current.getRow(id);
    if (!editingState[id]) {
      return apiRef.current.getRow(id);
    }
    let rowUpdate = (0, _extends2.default)({}, row);
    Object.entries(editingState[id]).forEach(([field, fieldProps]) => {
      const column = apiRef.current.getColumn(field);
      if (column.valueSetter) {
        rowUpdate = column.valueSetter({
          value: fieldProps.value,
          row: rowUpdate
        });
      } else {
        rowUpdate[field] = fieldProps.value;
      }
    });
    return rowUpdate;
  }, [apiRef]);
  const editingApi = {
    getRowMode,
    startRowEditMode,
    stopRowEditMode
  };
  const editingPrivateApi = {
    setRowEditingEditCellValue,
    getRowWithUpdatedValuesFromRowEditing
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, editingApi, 'public');
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, editingPrivateApi, 'private');
  React.useEffect(() => {
    if (rowModesModelProp) {
      updateRowModesModel(rowModesModelProp);
    }
  }, [rowModesModelProp, updateRowModesModel]);
  React.useEffect(() => {
    const idToIdLookup = (0, _gridRowsSelector.gridRowsDataRowIdToIdLookupSelector)(apiRef);

    // Update the ref here because updateStateToStopRowEditMode may change it later
    const copyOfPrevRowModesModel = prevRowModesModel.current;
    prevRowModesModel.current = (0, _utils2.deepClone)(rowModesModel); // Do a deep-clone because the attributes might be changed later

    Object.entries(rowModesModel).forEach(([id, params]) => {
      const prevMode = copyOfPrevRowModesModel[id]?.mode || _gridEditRowModel.GridRowModes.View;
      const originalId = idToIdLookup[id] ?? id;
      if (params.mode === _gridEditRowModel.GridRowModes.Edit && prevMode === _gridEditRowModel.GridRowModes.View) {
        updateStateToStartRowEditMode((0, _extends2.default)({
          id: originalId
        }, params));
      } else if (params.mode === _gridEditRowModel.GridRowModes.View && prevMode === _gridEditRowModel.GridRowModes.Edit) {
        updateStateToStopRowEditMode((0, _extends2.default)({
          id: originalId
        }, params));
      }
    });
  }, [apiRef, rowModesModel, updateStateToStartRowEditMode, updateStateToStopRowEditMode]);
};
exports.useGridRowEditing = useGridRowEditing;