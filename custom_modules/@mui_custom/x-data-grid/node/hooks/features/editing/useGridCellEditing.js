"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridCellEditing = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _toPropertyKey2 = _interopRequireDefault(require("@babel/runtime/helpers/toPropertyKey"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _gridEditRowModel = require("../../../models/gridEditRowModel");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _gridEditingSelectors = require("./gridEditingSelectors");
var _keyboardUtils = require("../../../utils/keyboardUtils");
var _warning = require("../../../utils/warning");
var _gridRowsSelector = require("../rows/gridRowsSelector");
var _utils2 = require("../../../utils/utils");
var _gridEditCellParams = require("../../../models/params/gridEditCellParams");
const _excluded = ["id", "field"],
  _excluded2 = ["id", "field"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const missingOnProcessRowUpdateErrorWarning = (0, _warning.buildWarning)(['MUI: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.', 'To handle the error pass a callback to the `onProcessRowUpdateError` prop, e.g. `<DataGrid onProcessRowUpdateError={(error) => ...} />`.', 'For more detail, see http://mui.com/components/data-grid/editing/#persistence.'], 'error');
const useGridCellEditing = (apiRef, props) => {
  const [cellModesModel, setCellModesModel] = React.useState({});
  const cellModesModelRef = React.useRef(cellModesModel);
  const prevCellModesModel = React.useRef({});
  const {
    processRowUpdate,
    onProcessRowUpdateError,
    cellModesModel: cellModesModelProp,
    onCellModesModelChange
  } = props;
  const runIfEditModeIsCell = callback => (...args) => {
    if (props.editMode === _gridEditRowModel.GridEditModes.Cell) {
      callback(...args);
    }
  };
  const throwIfNotEditable = React.useCallback((id, field) => {
    const params = apiRef.current.getCellParams(id, field);
    if (!apiRef.current.isCellEditable(params)) {
      throw new Error(`MUI: The cell with id=${id} and field=${field} is not editable.`);
    }
  }, [apiRef]);
  const throwIfNotInMode = React.useCallback((id, field, mode) => {
    if (apiRef.current.getCellMode(id, field) !== mode) {
      throw new Error(`MUI: The cell with id=${id} and field=${field} is not in ${mode} mode.`);
    }
  }, [apiRef]);
  const handleCellDoubleClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }
    if (params.cellMode === _gridEditRowModel.GridCellModes.Edit) {
      return;
    }
    const newParams = (0, _extends2.default)({}, params, {
      reason: _gridEditCellParams.GridCellEditStartReasons.cellDoubleClick
    });
    apiRef.current.publishEvent('cellEditStart', newParams, event);
  }, [apiRef]);
  const handleCellFocusOut = React.useCallback((params, event) => {
    if (params.cellMode === _gridEditRowModel.GridCellModes.View) {
      return;
    }
    if (apiRef.current.getCellMode(params.id, params.field) === _gridEditRowModel.GridCellModes.View) {
      return;
    }
    const newParams = (0, _extends2.default)({}, params, {
      reason: _gridEditCellParams.GridCellEditStopReasons.cellFocusOut
    });
    apiRef.current.publishEvent('cellEditStop', newParams, event);
  }, [apiRef]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    if (params.cellMode === _gridEditRowModel.GridCellModes.Edit) {
      // Wait until IME is settled for Asian languages like Japanese and Chinese
      // TODO: `event.which` is deprecated but this is a temporary workaround
      if (event.which === 229) {
        return;
      }
      let reason;
      if (event.key === 'Escape') {
        reason = _gridEditCellParams.GridCellEditStopReasons.escapeKeyDown;
      } else if (event.key === 'Enter') {
        reason = _gridEditCellParams.GridCellEditStopReasons.enterKeyDown;
      } else if (event.key === 'Tab') {
        reason = event.shiftKey ? _gridEditCellParams.GridCellEditStopReasons.shiftTabKeyDown : _gridEditCellParams.GridCellEditStopReasons.tabKeyDown;
        event.preventDefault(); // Prevent going to the next element in the tab sequence
      }

      if (reason) {
        const newParams = (0, _extends2.default)({}, params, {
          reason
        });
        apiRef.current.publishEvent('cellEditStop', newParams, event);
      }
    } else if (params.isEditable) {
      let reason;
      if (event.key === ' ') {
        return; // Space scrolls to the last row
      }

      if ((0, _keyboardUtils.isPrintableKey)(event)) {
        reason = _gridEditCellParams.GridCellEditStartReasons.printableKeyDown;
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        reason = _gridEditCellParams.GridCellEditStartReasons.printableKeyDown;
      } else if (event.key === 'Enter') {
        reason = _gridEditCellParams.GridCellEditStartReasons.enterKeyDown;
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        // Delete on Windows, Backspace on macOS
        reason = _gridEditCellParams.GridCellEditStartReasons.deleteKeyDown;
      }
      if (reason) {
        const newParams = (0, _extends2.default)({}, params, {
          reason,
          key: event.key
        });
        apiRef.current.publishEvent('cellEditStart', newParams, event);
      }
    }
  }, [apiRef]);
  const handleCellEditStart = React.useCallback(params => {
    const {
      id,
      field,
      reason,
      key
    } = params;
    const startCellEditModeParams = {
      id,
      field
    };
    if (reason === _gridEditCellParams.GridCellEditStartReasons.printableKeyDown) {
      if (React.version.startsWith('17')) {
        // In React 17, cleaning the input is enough.
        // The sequence of events makes the key pressed by the end-users update the textbox directly.
        startCellEditModeParams.deleteValue = true;
      } else {
        startCellEditModeParams.initialValue = key;
      }
    } else if (reason === _gridEditCellParams.GridCellEditStartReasons.deleteKeyDown) {
      startCellEditModeParams.deleteValue = true;
    }
    apiRef.current.startCellEditMode(startCellEditModeParams);
  }, [apiRef]);
  const handleCellEditStop = React.useCallback(params => {
    const {
      id,
      field,
      reason
    } = params;
    apiRef.current.runPendingEditCellValueMutation(id, field);
    let cellToFocusAfter;
    if (reason === _gridEditCellParams.GridCellEditStopReasons.enterKeyDown) {
      cellToFocusAfter = 'below';
    } else if (reason === _gridEditCellParams.GridCellEditStopReasons.tabKeyDown) {
      cellToFocusAfter = 'right';
    } else if (reason === _gridEditCellParams.GridCellEditStopReasons.shiftTabKeyDown) {
      cellToFocusAfter = 'left';
    }
    const ignoreModifications = reason === 'escapeKeyDown';
    apiRef.current.stopCellEditMode({
      id,
      field,
      ignoreModifications,
      cellToFocusAfter
    });
  }, [apiRef]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellDoubleClick', runIfEditModeIsCell(handleCellDoubleClick));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellFocusOut', runIfEditModeIsCell(handleCellFocusOut));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellKeyDown', runIfEditModeIsCell(handleCellKeyDown));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellEditStart', runIfEditModeIsCell(handleCellEditStart));
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'cellEditStop', runIfEditModeIsCell(handleCellEditStop));
  (0, _useGridApiEventHandler.useGridApiOptionHandler)(apiRef, 'cellEditStart', props.onCellEditStart);
  (0, _useGridApiEventHandler.useGridApiOptionHandler)(apiRef, 'cellEditStop', props.onCellEditStop);
  const getCellMode = React.useCallback((id, field) => {
    const editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    const isEditing = editingState[id] && editingState[id][field];
    return isEditing ? _gridEditRowModel.GridCellModes.Edit : _gridEditRowModel.GridCellModes.View;
  }, [apiRef]);
  const updateCellModesModel = (0, _utils.unstable_useEventCallback)(newModel => {
    const isNewModelDifferentFromProp = newModel !== props.cellModesModel;
    if (onCellModesModelChange && isNewModelDifferentFromProp) {
      onCellModesModelChange(newModel, {});
    }
    if (props.cellModesModel && isNewModelDifferentFromProp) {
      return; // The prop always win
    }

    setCellModesModel(newModel);
    cellModesModelRef.current = newModel;
    apiRef.current.publishEvent('cellModesModelChange', newModel);
  });
  const updateFieldInCellModesModel = React.useCallback((id, field, newProps) => {
    // We use the ref because it always contain the up-to-date value, different from the state
    // that needs a rerender to reflect the new value
    const newModel = (0, _extends2.default)({}, cellModesModelRef.current);
    if (newProps !== null) {
      newModel[id] = (0, _extends2.default)({}, newModel[id], {
        [field]: (0, _extends2.default)({}, newProps)
      });
    } else {
      const _newModel$id = newModel[id],
        otherFields = (0, _objectWithoutPropertiesLoose2.default)(_newModel$id, [field].map(_toPropertyKey2.default)); // Ensure that we have a new object, not a reference
      newModel[id] = otherFields;
      if (Object.keys(newModel[id]).length === 0) {
        delete newModel[id];
      }
    }
    updateCellModesModel(newModel);
  }, [updateCellModesModel]);
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
  const startCellEditMode = React.useCallback(params => {
    const {
        id,
        field
      } = params,
      other = (0, _objectWithoutPropertiesLoose2.default)(params, _excluded);
    throwIfNotEditable(id, field);
    throwIfNotInMode(id, field, _gridEditRowModel.GridCellModes.View);
    updateFieldInCellModesModel(id, field, (0, _extends2.default)({
      mode: _gridEditRowModel.GridCellModes.Edit
    }, other));
  }, [throwIfNotEditable, throwIfNotInMode, updateFieldInCellModesModel]);
  const updateStateToStartCellEditMode = (0, _utils.unstable_useEventCallback)(params => {
    const {
      id,
      field,
      deleteValue,
      initialValue
    } = params;
    let newValue = apiRef.current.getCellValue(id, field);
    if (deleteValue || initialValue) {
      newValue = deleteValue ? '' : initialValue;
    }
    const newProps = {
      value: newValue,
      error: false,
      isProcessingProps: false
    };
    updateOrDeleteFieldState(id, field, newProps);
    apiRef.current.setCellFocus(id, field);
  });
  const stopCellEditMode = React.useCallback(params => {
    const {
        id,
        field
      } = params,
      other = (0, _objectWithoutPropertiesLoose2.default)(params, _excluded2);
    throwIfNotInMode(id, field, _gridEditRowModel.GridCellModes.Edit);
    updateFieldInCellModesModel(id, field, (0, _extends2.default)({
      mode: _gridEditRowModel.GridCellModes.View
    }, other));
  }, [throwIfNotInMode, updateFieldInCellModesModel]);
  const updateStateToStopCellEditMode = (0, _utils.unstable_useEventCallback)(async params => {
    const {
      id,
      field,
      ignoreModifications,
      cellToFocusAfter = 'none'
    } = params;
    throwIfNotInMode(id, field, _gridEditRowModel.GridCellModes.Edit);
    apiRef.current.runPendingEditCellValueMutation(id, field);
    const finishCellEditMode = () => {
      updateOrDeleteFieldState(id, field, null);
      updateFieldInCellModesModel(id, field, null);
      if (cellToFocusAfter !== 'none') {
        apiRef.current.moveFocusToRelativeCell(id, field, cellToFocusAfter);
      }
    };
    if (ignoreModifications) {
      finishCellEditMode();
      return;
    }
    const editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    const {
      error,
      isProcessingProps
    } = editingState[id][field];
    if (error || isProcessingProps) {
      // Attempt to change cell mode to "view" was not successful
      // Update previous mode to allow another attempt
      prevCellModesModel.current[id][field].mode = _gridEditRowModel.GridCellModes.Edit;
      // Revert the mode in the cellModesModel prop back to "edit"
      updateFieldInCellModesModel(id, field, {
        mode: _gridEditRowModel.GridCellModes.Edit
      });
      return;
    }
    const rowUpdate = apiRef.current.getRowWithUpdatedValuesFromCellEditing(id, field);
    if (processRowUpdate) {
      const handleError = errorThrown => {
        prevCellModesModel.current[id][field].mode = _gridEditRowModel.GridCellModes.Edit;
        // Revert the mode in the cellModesModel prop back to "edit"
        updateFieldInCellModesModel(id, field, {
          mode: _gridEditRowModel.GridCellModes.Edit
        });
        if (onProcessRowUpdateError) {
          onProcessRowUpdateError(errorThrown);
        } else {
          missingOnProcessRowUpdateErrorWarning();
        }
      };
      try {
        const row = apiRef.current.getRow(id);
        Promise.resolve(processRowUpdate(rowUpdate, row)).then(finalRowUpdate => {
          apiRef.current.updateRows([finalRowUpdate]);
          finishCellEditMode();
        }).catch(handleError);
      } catch (errorThrown) {
        handleError(errorThrown);
      }
    } else {
      apiRef.current.updateRows([rowUpdate]);
      finishCellEditMode();
    }
  });
  const setCellEditingEditCellValue = React.useCallback(async params => {
    const {
      id,
      field,
      value,
      debounceMs,
      unstable_skipValueParser: skipValueParser
    } = params;
    throwIfNotEditable(id, field);
    throwIfNotInMode(id, field, _gridEditRowModel.GridCellModes.Edit);
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
    if (column.preProcessEditCellProps) {
      const hasChanged = value !== editingState[id][field].value;
      newProps = (0, _extends2.default)({}, newProps, {
        isProcessingProps: true
      });
      updateOrDeleteFieldState(id, field, newProps);
      newProps = await Promise.resolve(column.preProcessEditCellProps({
        id,
        row,
        props: newProps,
        hasChanged
      }));
    }

    // Check again if the cell is in edit mode because the user may have
    // discarded the changes while the props were being processed.
    if (apiRef.current.getCellMode(id, field) === _gridEditRowModel.GridCellModes.View) {
      return false;
    }
    editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    newProps = (0, _extends2.default)({}, newProps, {
      isProcessingProps: false
    });
    // We don't update the value with the one coming from the props pre-processing
    // because when the promise resolves it may be already outdated. The only
    // exception to this rule is when there's no pre-processing.
    newProps.value = column.preProcessEditCellProps ? editingState[id][field].value : parsedValue;
    updateOrDeleteFieldState(id, field, newProps);
    editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    return !editingState[id]?.[field]?.error;
  }, [apiRef, throwIfNotEditable, throwIfNotInMode, updateOrDeleteFieldState]);
  const getRowWithUpdatedValuesFromCellEditing = React.useCallback((id, field) => {
    const column = apiRef.current.getColumn(field);
    const editingState = (0, _gridEditingSelectors.gridEditRowsStateSelector)(apiRef.current.state);
    const row = apiRef.current.getRow(id);
    if (!editingState[id] || !editingState[id][field]) {
      return apiRef.current.getRow(id);
    }
    const {
      value
    } = editingState[id][field];
    return column.valueSetter ? column.valueSetter({
      value,
      row
    }) : (0, _extends2.default)({}, row, {
      [field]: value
    });
  }, [apiRef]);
  const editingApi = {
    getCellMode,
    startCellEditMode,
    stopCellEditMode
  };
  const editingPrivateApi = {
    setCellEditingEditCellValue,
    getRowWithUpdatedValuesFromCellEditing
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, editingApi, 'public');
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, editingPrivateApi, 'private');
  React.useEffect(() => {
    if (cellModesModelProp) {
      updateCellModesModel(cellModesModelProp);
    }
  }, [cellModesModelProp, updateCellModesModel]);
  React.useEffect(() => {
    const idToIdLookup = (0, _gridRowsSelector.gridRowsDataRowIdToIdLookupSelector)(apiRef);

    // Update the ref here because updateStateToStopCellEditMode may change it later
    const copyOfPrevCellModes = prevCellModesModel.current;
    prevCellModesModel.current = (0, _utils2.deepClone)(cellModesModel); // Do a deep-clone because the attributes might be changed later

    Object.entries(cellModesModel).forEach(([id, fields]) => {
      Object.entries(fields).forEach(([field, params]) => {
        const prevMode = copyOfPrevCellModes[id]?.[field]?.mode || _gridEditRowModel.GridCellModes.View;
        const originalId = idToIdLookup[id] ?? id;
        if (params.mode === _gridEditRowModel.GridCellModes.Edit && prevMode === _gridEditRowModel.GridCellModes.View) {
          updateStateToStartCellEditMode((0, _extends2.default)({
            id: originalId,
            field
          }, params));
        } else if (params.mode === _gridEditRowModel.GridCellModes.View && prevMode === _gridEditRowModel.GridCellModes.Edit) {
          updateStateToStopCellEditMode((0, _extends2.default)({
            id: originalId,
            field
          }, params));
        }
      });
    });
  }, [apiRef, cellModesModel, updateStateToStartCellEditMode, updateStateToStopCellEditMode]);
};
exports.useGridCellEditing = useGridCellEditing;