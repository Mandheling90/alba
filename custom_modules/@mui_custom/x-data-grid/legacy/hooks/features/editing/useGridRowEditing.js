import _toPropertyKey from "@babel/runtime/helpers/esm/toPropertyKey";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
var _excluded = ["id"],
  _excluded2 = ["id"];
import * as React from 'react';
import { unstable_useEventCallback as useEventCallback } from '@mui/utils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { GridEditModes, GridRowModes } from '../../../models/gridEditRowModel';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridEditRowsStateSelector } from './gridEditingSelectors';
import { isPrintableKey } from '../../../utils/keyboardUtils';
import { gridColumnFieldsSelector } from '../columns/gridColumnsSelector';
import { buildWarning } from '../../../utils/warning';
import { gridRowsDataRowIdToIdLookupSelector } from '../rows/gridRowsSelector';
import { deepClone } from '../../../utils/utils';
import { GridRowEditStopReasons, GridRowEditStartReasons } from '../../../models/params/gridRowParams';
var missingOnProcessRowUpdateErrorWarning = buildWarning(['MUI: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.', 'To handle the error pass a callback to the `onProcessRowUpdateError` prop, e.g. `<DataGrid onProcessRowUpdateError={(error) => ...} />`.', 'For more detail, see http://mui.com/components/data-grid/editing/#persistence.'], 'error');
export var useGridRowEditing = function useGridRowEditing(apiRef, props) {
  var _React$useState = React.useState({}),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    rowModesModel = _React$useState2[0],
    setRowModesModel = _React$useState2[1];
  var rowModesModelRef = React.useRef(rowModesModel);
  var prevRowModesModel = React.useRef({});
  var focusTimeout = React.useRef(null);
  var nextFocusedCell = React.useRef(null);
  var processRowUpdate = props.processRowUpdate,
    onProcessRowUpdateError = props.onProcessRowUpdateError,
    rowModesModelProp = props.rowModesModel,
    onRowModesModelChange = props.onRowModesModelChange;
  var runIfEditModeIsRow = function runIfEditModeIsRow(callback) {
    return function () {
      if (props.editMode === GridEditModes.Row) {
        callback.apply(void 0, arguments);
      }
    };
  };
  var throwIfNotEditable = React.useCallback(function (id, field) {
    var params = apiRef.current.getCellParams(id, field);
    if (!apiRef.current.isCellEditable(params)) {
      throw new Error("MUI: The cell with id=".concat(id, " and field=").concat(field, " is not editable."));
    }
  }, [apiRef]);
  var throwIfNotInMode = React.useCallback(function (id, mode) {
    if (apiRef.current.getRowMode(id) !== mode) {
      throw new Error("MUI: The row with id=".concat(id, " is not in ").concat(mode, " mode."));
    }
  }, [apiRef]);
  var handleCellDoubleClick = React.useCallback(function (params, event) {
    if (!params.isEditable) {
      return;
    }
    if (apiRef.current.getRowMode(params.id) === GridRowModes.Edit) {
      return;
    }
    var rowParams = apiRef.current.getRowParams(params.id);
    var newParams = _extends({}, rowParams, {
      field: params.field,
      reason: GridRowEditStartReasons.cellDoubleClick
    });
    apiRef.current.publishEvent('rowEditStart', newParams, event);
  }, [apiRef]);
  var handleCellFocusIn = React.useCallback(function (params) {
    nextFocusedCell.current = params;
  }, []);
  var handleCellFocusOut = React.useCallback(function (params, event) {
    if (!params.isEditable) {
      return;
    }
    if (apiRef.current.getRowMode(params.id) === GridRowModes.View) {
      return;
    }
    // The mechanism to detect if we can stop editing a row is different from
    // the cell editing. Instead of triggering it when clicking outside a cell,
    // we must check if another cell in the same row was not clicked. To achieve
    // that, first we keep track of all cells that gained focus. When a cell loses
    // focus we check if the next cell that received focus is from a different row.
    nextFocusedCell.current = null;
    focusTimeout.current = setTimeout(function () {
      var _nextFocusedCell$curr;
      focusTimeout.current = null;
      if (((_nextFocusedCell$curr = nextFocusedCell.current) == null ? void 0 : _nextFocusedCell$curr.id) !== params.id) {
        // The row might have been deleted during the click
        if (!apiRef.current.getRow(params.id)) {
          return;
        }

        // The row may already changed its mode
        if (apiRef.current.getRowMode(params.id) === GridRowModes.View) {
          return;
        }
        var rowParams = apiRef.current.getRowParams(params.id);
        var newParams = _extends({}, rowParams, {
          field: params.field,
          reason: GridRowEditStopReasons.rowFocusOut
        });
        apiRef.current.publishEvent('rowEditStop', newParams, event);
      }
    });
  }, [apiRef]);
  React.useEffect(function () {
    return function () {
      clearTimeout(focusTimeout.current);
    };
  }, []);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    if (params.cellMode === GridRowModes.Edit) {
      // Wait until IME is settled for Asian languages like Japanese and Chinese
      // TODO: `event.which` is deprecated but this is a temporary workaround
      if (event.which === 229) {
        return;
      }
      var reason;
      if (event.key === 'Escape') {
        reason = GridRowEditStopReasons.escapeKeyDown;
      } else if (event.key === 'Enter') {
        reason = GridRowEditStopReasons.enterKeyDown;
      } else if (event.key === 'Tab') {
        var columnFields = gridColumnFieldsSelector(apiRef).filter(function (field) {
          return apiRef.current.isCellEditable(apiRef.current.getCellParams(params.id, field));
        });
        if (event.shiftKey) {
          if (params.field === columnFields[0]) {
            // Exit if user pressed Shift+Tab on the first field
            reason = GridRowEditStopReasons.shiftTabKeyDown;
          }
        } else if (params.field === columnFields[columnFields.length - 1]) {
          // Exit if user pressed Tab on the last field
          reason = GridRowEditStopReasons.tabKeyDown;
        }

        // Always prevent going to the next element in the tab sequence because the focus is
        // handled manually to support edit components rendered inside Portals
        event.preventDefault();
        if (!reason) {
          var index = columnFields.findIndex(function (field) {
            return field === params.field;
          });
          var nextFieldToFocus = columnFields[event.shiftKey ? index - 1 : index + 1];
          apiRef.current.setCellFocus(params.id, nextFieldToFocus);
        }
      }
      if (reason) {
        var rowParams = apiRef.current.getRowParams(params.id);
        var newParams = _extends({}, rowParams, {
          reason: reason,
          field: params.field
        });
        apiRef.current.publishEvent('rowEditStop', newParams, event);
      }
    } else if (params.isEditable) {
      var _reason;
      if (event.key === ' ') {
        return; // Space scrolls to the last row
      }

      if (isPrintableKey(event)) {
        _reason = GridRowEditStartReasons.printableKeyDown;
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        _reason = GridRowEditStartReasons.printableKeyDown;
      } else if (event.key === 'Enter') {
        _reason = GridRowEditStartReasons.enterKeyDown;
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        // Delete on Windows, Backspace on macOS
        _reason = GridRowEditStartReasons.deleteKeyDown;
      }
      if (_reason) {
        var _rowParams = apiRef.current.getRowParams(params.id);
        var _newParams = _extends({}, _rowParams, {
          field: params.field,
          key: event.key,
          reason: _reason
        });
        apiRef.current.publishEvent('rowEditStart', _newParams, event);
      }
    }
  }, [apiRef]);
  var handleRowEditStart = React.useCallback(function (params) {
    var id = params.id,
      field = params.field,
      reason = params.reason,
      key = params.key;
    var startRowEditModeParams = {
      id: id,
      fieldToFocus: field
    };
    if (reason === GridRowEditStartReasons.printableKeyDown) {
      if (React.version.startsWith('17')) {
        // In React 17, cleaning the input is enough.
        // The sequence of events makes the key pressed by the end-users update the textbox directly.
        startRowEditModeParams.deleteValue = !!field;
      } else {
        startRowEditModeParams.initialValue = key;
      }
    } else if (reason === GridRowEditStartReasons.deleteKeyDown) {
      startRowEditModeParams.deleteValue = !!field;
    }
    apiRef.current.startRowEditMode(startRowEditModeParams);
  }, [apiRef]);
  var handleRowEditStop = React.useCallback(function (params) {
    var id = params.id,
      reason = params.reason,
      field = params.field;
    apiRef.current.runPendingEditCellValueMutation(id);
    var cellToFocusAfter;
    if (reason === GridRowEditStopReasons.enterKeyDown) {
      cellToFocusAfter = 'below';
    } else if (reason === GridRowEditStopReasons.tabKeyDown) {
      cellToFocusAfter = 'right';
    } else if (reason === GridRowEditStopReasons.shiftTabKeyDown) {
      cellToFocusAfter = 'left';
    }
    var ignoreModifications = reason === 'escapeKeyDown';
    apiRef.current.stopRowEditMode({
      id: id,
      ignoreModifications: ignoreModifications,
      field: field,
      cellToFocusAfter: cellToFocusAfter
    });
  }, [apiRef]);
  useGridApiEventHandler(apiRef, 'cellDoubleClick', runIfEditModeIsRow(handleCellDoubleClick));
  useGridApiEventHandler(apiRef, 'cellFocusIn', runIfEditModeIsRow(handleCellFocusIn));
  useGridApiEventHandler(apiRef, 'cellFocusOut', runIfEditModeIsRow(handleCellFocusOut));
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfEditModeIsRow(handleCellKeyDown));
  useGridApiEventHandler(apiRef, 'rowEditStart', runIfEditModeIsRow(handleRowEditStart));
  useGridApiEventHandler(apiRef, 'rowEditStop', runIfEditModeIsRow(handleRowEditStop));
  useGridApiOptionHandler(apiRef, 'rowEditStart', props.onRowEditStart);
  useGridApiOptionHandler(apiRef, 'rowEditStop', props.onRowEditStop);
  var getRowMode = React.useCallback(function (id) {
    if (props.editMode === GridEditModes.Cell) {
      return GridRowModes.View;
    }
    var editingState = gridEditRowsStateSelector(apiRef.current.state);
    var isEditing = editingState[id] && Object.keys(editingState[id]).length > 0;
    return isEditing ? GridRowModes.Edit : GridRowModes.View;
  }, [apiRef, props.editMode]);
  var updateRowModesModel = useEventCallback(function (newModel) {
    var isNewModelDifferentFromProp = newModel !== props.rowModesModel;
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
  var updateRowInRowModesModel = React.useCallback(function (id, newProps) {
    var newModel = _extends({}, rowModesModelRef.current);
    if (newProps !== null) {
      newModel[id] = _extends({}, newProps);
    } else {
      delete newModel[id];
    }
    updateRowModesModel(newModel);
  }, [updateRowModesModel]);
  var updateOrDeleteRowState = React.useCallback(function (id, newProps) {
    apiRef.current.setState(function (state) {
      var newEditingState = _extends({}, state.editRows);
      if (newProps !== null) {
        newEditingState[id] = newProps;
      } else {
        delete newEditingState[id];
      }
      return _extends({}, state, {
        editRows: newEditingState
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  var updateOrDeleteFieldState = React.useCallback(function (id, field, newProps) {
    apiRef.current.setState(function (state) {
      var newEditingState = _extends({}, state.editRows);
      if (newProps !== null) {
        newEditingState[id] = _extends({}, newEditingState[id], _defineProperty({}, field, _extends({}, newProps)));
      } else {
        delete newEditingState[id][field];
        if (Object.keys(newEditingState[id]).length === 0) {
          delete newEditingState[id];
        }
      }
      return _extends({}, state, {
        editRows: newEditingState
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  var startRowEditMode = React.useCallback(function (params) {
    var id = params.id,
      other = _objectWithoutProperties(params, _excluded);
    throwIfNotInMode(id, GridRowModes.View);
    updateRowInRowModesModel(id, _extends({
      mode: GridRowModes.Edit
    }, other));
  }, [throwIfNotInMode, updateRowInRowModesModel]);
  var updateStateToStartRowEditMode = useEventCallback(function (params) {
    var id = params.id,
      fieldToFocus = params.fieldToFocus,
      deleteValue = params.deleteValue,
      initialValue = params.initialValue;
    var columnFields = gridColumnFieldsSelector(apiRef);
    var newProps = columnFields.reduce(function (acc, field) {
      var cellParams = apiRef.current.getCellParams(id, field);
      if (!cellParams.isEditable) {
        return acc;
      }
      var newValue = apiRef.current.getCellValue(id, field);
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
  var stopRowEditMode = React.useCallback(function (params) {
    var id = params.id,
      other = _objectWithoutProperties(params, _excluded2);
    throwIfNotInMode(id, GridRowModes.Edit);
    updateRowInRowModesModel(id, _extends({
      mode: GridRowModes.View
    }, other));
  }, [throwIfNotInMode, updateRowInRowModesModel]);
  var updateStateToStopRowEditMode = useEventCallback(function (params) {
    var id = params.id,
      ignoreModifications = params.ignoreModifications,
      focusedField = params.field,
      _params$cellToFocusAf = params.cellToFocusAfter,
      cellToFocusAfter = _params$cellToFocusAf === void 0 ? 'none' : _params$cellToFocusAf;
    apiRef.current.runPendingEditCellValueMutation(id);
    var finishRowEditMode = function finishRowEditMode() {
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
    var editingState = gridEditRowsStateSelector(apiRef.current.state);
    var row = apiRef.current.getRow(id);
    var isSomeFieldProcessingProps = Object.values(editingState[id]).some(function (fieldProps) {
      return fieldProps.isProcessingProps;
    });
    if (isSomeFieldProcessingProps) {
      prevRowModesModel.current[id].mode = GridRowModes.Edit;
      return;
    }
    var hasSomeFieldWithError = Object.values(editingState[id]).some(function (fieldProps) {
      return fieldProps.error;
    });
    if (hasSomeFieldWithError) {
      prevRowModesModel.current[id].mode = GridRowModes.Edit;
      // Revert the mode in the rowModesModel prop back to "edit"
      updateRowInRowModesModel(id, {
        mode: GridRowModes.Edit
      });
      return;
    }
    var rowUpdate = apiRef.current.getRowWithUpdatedValuesFromRowEditing(id);
    if (processRowUpdate) {
      var handleError = function handleError(errorThrown) {
        prevRowModesModel.current[id].mode = GridRowModes.Edit;
        // Revert the mode in the rowModesModel prop back to "edit"
        updateRowInRowModesModel(id, {
          mode: GridRowModes.Edit
        });
        if (onProcessRowUpdateError) {
          onProcessRowUpdateError(errorThrown);
        } else {
          missingOnProcessRowUpdateErrorWarning();
        }
      };
      try {
        Promise.resolve(processRowUpdate(rowUpdate, row)).then(function (finalRowUpdate) {
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
  var setRowEditingEditCellValue = React.useCallback(function (params) {
    var id = params.id,
      field = params.field,
      value = params.value,
      debounceMs = params.debounceMs,
      skipValueParser = params.unstable_skipValueParser;
    throwIfNotEditable(id, field);
    var column = apiRef.current.getColumn(field);
    var row = apiRef.current.getRow(id);
    var parsedValue = value;
    if (column.valueParser && !skipValueParser) {
      parsedValue = column.valueParser(value, apiRef.current.getCellParams(id, field));
    }
    var editingState = gridEditRowsStateSelector(apiRef.current.state);
    var newProps = _extends({}, editingState[id][field], {
      value: parsedValue,
      changeReason: debounceMs ? 'debouncedSetEditCellValue' : 'setEditCellValue'
    });
    if (!column.preProcessEditCellProps) {
      updateOrDeleteFieldState(id, field, newProps);
    }
    return new Promise(function (resolve) {
      var promises = [];
      if (column.preProcessEditCellProps) {
        var hasChanged = newProps.value !== editingState[id][field].value;
        newProps = _extends({}, newProps, {
          isProcessingProps: true
        });
        updateOrDeleteFieldState(id, field, newProps);
        var _editingState$id = editingState[id],
          ignoredField = _editingState$id[field],
          otherFieldsProps = _objectWithoutProperties(_editingState$id, [field].map(_toPropertyKey));
        var promise = Promise.resolve(column.preProcessEditCellProps({
          id: id,
          row: row,
          props: newProps,
          hasChanged: hasChanged,
          otherFieldsProps: otherFieldsProps
        })).then(function (processedProps) {
          // Check again if the row is in edit mode because the user may have
          // discarded the changes while the props were being processed.
          if (apiRef.current.getRowMode(id) === GridRowModes.View) {
            resolve(false);
            return;
          }
          editingState = gridEditRowsStateSelector(apiRef.current.state);
          processedProps = _extends({}, processedProps, {
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
      Object.entries(editingState[id]).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          thisField = _ref2[0],
          fieldProps = _ref2[1];
        if (thisField === field) {
          return;
        }
        var fieldColumn = apiRef.current.getColumn(thisField);
        if (!fieldColumn.preProcessEditCellProps) {
          return;
        }
        fieldProps = _extends({}, fieldProps, {
          isProcessingProps: true
        });
        updateOrDeleteFieldState(id, thisField, fieldProps);
        editingState = gridEditRowsStateSelector(apiRef.current.state);
        var _editingState$id2 = editingState[id],
          ignoredField = _editingState$id2[thisField],
          otherFieldsProps = _objectWithoutProperties(_editingState$id2, [thisField].map(_toPropertyKey));
        var promise = Promise.resolve(fieldColumn.preProcessEditCellProps({
          id: id,
          row: row,
          props: fieldProps,
          hasChanged: false,
          otherFieldsProps: otherFieldsProps
        })).then(function (processedProps) {
          // Check again if the row is in edit mode because the user may have
          // discarded the changes while the props were being processed.
          if (apiRef.current.getRowMode(id) === GridRowModes.View) {
            resolve(false);
            return;
          }
          processedProps = _extends({}, processedProps, {
            isProcessingProps: false
          });
          updateOrDeleteFieldState(id, thisField, processedProps);
        });
        promises.push(promise);
      });
      Promise.all(promises).then(function () {
        if (apiRef.current.getRowMode(id) === GridRowModes.Edit) {
          editingState = gridEditRowsStateSelector(apiRef.current.state);
          resolve(!editingState[id][field].error);
        } else {
          resolve(false);
        }
      });
    });
  }, [apiRef, throwIfNotEditable, updateOrDeleteFieldState]);
  var getRowWithUpdatedValuesFromRowEditing = React.useCallback(function (id) {
    var editingState = gridEditRowsStateSelector(apiRef.current.state);
    var row = apiRef.current.getRow(id);
    if (!editingState[id]) {
      return apiRef.current.getRow(id);
    }
    var rowUpdate = _extends({}, row);
    Object.entries(editingState[id]).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        field = _ref4[0],
        fieldProps = _ref4[1];
      var column = apiRef.current.getColumn(field);
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
  var editingApi = {
    getRowMode: getRowMode,
    startRowEditMode: startRowEditMode,
    stopRowEditMode: stopRowEditMode
  };
  var editingPrivateApi = {
    setRowEditingEditCellValue: setRowEditingEditCellValue,
    getRowWithUpdatedValuesFromRowEditing: getRowWithUpdatedValuesFromRowEditing
  };
  useGridApiMethod(apiRef, editingApi, 'public');
  useGridApiMethod(apiRef, editingPrivateApi, 'private');
  React.useEffect(function () {
    if (rowModesModelProp) {
      updateRowModesModel(rowModesModelProp);
    }
  }, [rowModesModelProp, updateRowModesModel]);
  React.useEffect(function () {
    var idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);

    // Update the ref here because updateStateToStopRowEditMode may change it later
    var copyOfPrevRowModesModel = prevRowModesModel.current;
    prevRowModesModel.current = deepClone(rowModesModel); // Do a deep-clone because the attributes might be changed later

    Object.entries(rowModesModel).forEach(function (_ref5) {
      var _copyOfPrevRowModesMo, _idToIdLookup$id;
      var _ref6 = _slicedToArray(_ref5, 2),
        id = _ref6[0],
        params = _ref6[1];
      var prevMode = ((_copyOfPrevRowModesMo = copyOfPrevRowModesModel[id]) == null ? void 0 : _copyOfPrevRowModesMo.mode) || GridRowModes.View;
      var originalId = (_idToIdLookup$id = idToIdLookup[id]) != null ? _idToIdLookup$id : id;
      if (params.mode === GridRowModes.Edit && prevMode === GridRowModes.View) {
        updateStateToStartRowEditMode(_extends({
          id: originalId
        }, params));
      } else if (params.mode === GridRowModes.View && prevMode === GridRowModes.Edit) {
        updateStateToStopRowEditMode(_extends({
          id: originalId
        }, params));
      }
    });
  }, [apiRef, rowModesModel, updateStateToStartRowEditMode, updateStateToStopRowEditMode]);
};