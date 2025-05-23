import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toPropertyKey from "@babel/runtime/helpers/esm/toPropertyKey";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
var _excluded = ["id", "field"],
  _excluded2 = ["id", "field"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import { unstable_useEventCallback as useEventCallback } from '@mui/utils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { GridEditModes, GridCellModes } from '../../../models/gridEditRowModel';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridEditRowsStateSelector } from './gridEditingSelectors';
import { isPrintableKey } from '../../../utils/keyboardUtils';
import { buildWarning } from '../../../utils/warning';
import { gridRowsDataRowIdToIdLookupSelector } from '../rows/gridRowsSelector';
import { deepClone } from '../../../utils/utils';
import { GridCellEditStartReasons, GridCellEditStopReasons } from '../../../models/params/gridEditCellParams';
var missingOnProcessRowUpdateErrorWarning = buildWarning(['MUI: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.', 'To handle the error pass a callback to the `onProcessRowUpdateError` prop, e.g. `<DataGrid onProcessRowUpdateError={(error) => ...} />`.', 'For more detail, see http://mui.com/components/data-grid/editing/#persistence.'], 'error');
export var useGridCellEditing = function useGridCellEditing(apiRef, props) {
  var _React$useState = React.useState({}),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    cellModesModel = _React$useState2[0],
    setCellModesModel = _React$useState2[1];
  var cellModesModelRef = React.useRef(cellModesModel);
  var prevCellModesModel = React.useRef({});
  var processRowUpdate = props.processRowUpdate,
    onProcessRowUpdateError = props.onProcessRowUpdateError,
    cellModesModelProp = props.cellModesModel,
    onCellModesModelChange = props.onCellModesModelChange;
  var runIfEditModeIsCell = function runIfEditModeIsCell(callback) {
    return function () {
      if (props.editMode === GridEditModes.Cell) {
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
  var throwIfNotInMode = React.useCallback(function (id, field, mode) {
    if (apiRef.current.getCellMode(id, field) !== mode) {
      throw new Error("MUI: The cell with id=".concat(id, " and field=").concat(field, " is not in ").concat(mode, " mode."));
    }
  }, [apiRef]);
  var handleCellDoubleClick = React.useCallback(function (params, event) {
    if (!params.isEditable) {
      return;
    }
    if (params.cellMode === GridCellModes.Edit) {
      return;
    }
    var newParams = _extends({}, params, {
      reason: GridCellEditStartReasons.cellDoubleClick
    });
    apiRef.current.publishEvent('cellEditStart', newParams, event);
  }, [apiRef]);
  var handleCellFocusOut = React.useCallback(function (params, event) {
    if (params.cellMode === GridCellModes.View) {
      return;
    }
    if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.View) {
      return;
    }
    var newParams = _extends({}, params, {
      reason: GridCellEditStopReasons.cellFocusOut
    });
    apiRef.current.publishEvent('cellEditStop', newParams, event);
  }, [apiRef]);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    if (params.cellMode === GridCellModes.Edit) {
      // Wait until IME is settled for Asian languages like Japanese and Chinese
      // TODO: `event.which` is deprecated but this is a temporary workaround
      if (event.which === 229) {
        return;
      }
      var reason;
      if (event.key === 'Escape') {
        reason = GridCellEditStopReasons.escapeKeyDown;
      } else if (event.key === 'Enter') {
        reason = GridCellEditStopReasons.enterKeyDown;
      } else if (event.key === 'Tab') {
        reason = event.shiftKey ? GridCellEditStopReasons.shiftTabKeyDown : GridCellEditStopReasons.tabKeyDown;
        event.preventDefault(); // Prevent going to the next element in the tab sequence
      }

      if (reason) {
        var newParams = _extends({}, params, {
          reason: reason
        });
        apiRef.current.publishEvent('cellEditStop', newParams, event);
      }
    } else if (params.isEditable) {
      var _reason;
      if (event.key === ' ') {
        return; // Space scrolls to the last row
      }

      if (isPrintableKey(event)) {
        _reason = GridCellEditStartReasons.printableKeyDown;
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        _reason = GridCellEditStartReasons.printableKeyDown;
      } else if (event.key === 'Enter') {
        _reason = GridCellEditStartReasons.enterKeyDown;
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        // Delete on Windows, Backspace on macOS
        _reason = GridCellEditStartReasons.deleteKeyDown;
      }
      if (_reason) {
        var _newParams = _extends({}, params, {
          reason: _reason,
          key: event.key
        });
        apiRef.current.publishEvent('cellEditStart', _newParams, event);
      }
    }
  }, [apiRef]);
  var handleCellEditStart = React.useCallback(function (params) {
    var id = params.id,
      field = params.field,
      reason = params.reason,
      key = params.key;
    var startCellEditModeParams = {
      id: id,
      field: field
    };
    if (reason === GridCellEditStartReasons.printableKeyDown) {
      if (React.version.startsWith('17')) {
        // In React 17, cleaning the input is enough.
        // The sequence of events makes the key pressed by the end-users update the textbox directly.
        startCellEditModeParams.deleteValue = true;
      } else {
        startCellEditModeParams.initialValue = key;
      }
    } else if (reason === GridCellEditStartReasons.deleteKeyDown) {
      startCellEditModeParams.deleteValue = true;
    }
    apiRef.current.startCellEditMode(startCellEditModeParams);
  }, [apiRef]);
  var handleCellEditStop = React.useCallback(function (params) {
    var id = params.id,
      field = params.field,
      reason = params.reason;
    apiRef.current.runPendingEditCellValueMutation(id, field);
    var cellToFocusAfter;
    if (reason === GridCellEditStopReasons.enterKeyDown) {
      cellToFocusAfter = 'below';
    } else if (reason === GridCellEditStopReasons.tabKeyDown) {
      cellToFocusAfter = 'right';
    } else if (reason === GridCellEditStopReasons.shiftTabKeyDown) {
      cellToFocusAfter = 'left';
    }
    var ignoreModifications = reason === 'escapeKeyDown';
    apiRef.current.stopCellEditMode({
      id: id,
      field: field,
      ignoreModifications: ignoreModifications,
      cellToFocusAfter: cellToFocusAfter
    });
  }, [apiRef]);
  useGridApiEventHandler(apiRef, 'cellDoubleClick', runIfEditModeIsCell(handleCellDoubleClick));
  useGridApiEventHandler(apiRef, 'cellFocusOut', runIfEditModeIsCell(handleCellFocusOut));
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfEditModeIsCell(handleCellKeyDown));
  useGridApiEventHandler(apiRef, 'cellEditStart', runIfEditModeIsCell(handleCellEditStart));
  useGridApiEventHandler(apiRef, 'cellEditStop', runIfEditModeIsCell(handleCellEditStop));
  useGridApiOptionHandler(apiRef, 'cellEditStart', props.onCellEditStart);
  useGridApiOptionHandler(apiRef, 'cellEditStop', props.onCellEditStop);
  var getCellMode = React.useCallback(function (id, field) {
    var editingState = gridEditRowsStateSelector(apiRef.current.state);
    var isEditing = editingState[id] && editingState[id][field];
    return isEditing ? GridCellModes.Edit : GridCellModes.View;
  }, [apiRef]);
  var updateCellModesModel = useEventCallback(function (newModel) {
    var isNewModelDifferentFromProp = newModel !== props.cellModesModel;
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
  var updateFieldInCellModesModel = React.useCallback(function (id, field, newProps) {
    // We use the ref because it always contain the up-to-date value, different from the state
    // that needs a rerender to reflect the new value
    var newModel = _extends({}, cellModesModelRef.current);
    if (newProps !== null) {
      newModel[id] = _extends({}, newModel[id], _defineProperty({}, field, _extends({}, newProps)));
    } else {
      var _newModel$id = newModel[id],
        fieldToRemove = _newModel$id[field],
        otherFields = _objectWithoutProperties(_newModel$id, [field].map(_toPropertyKey)); // Ensure that we have a new object, not a reference
      newModel[id] = otherFields;
      if (Object.keys(newModel[id]).length === 0) {
        delete newModel[id];
      }
    }
    updateCellModesModel(newModel);
  }, [updateCellModesModel]);
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
  var startCellEditMode = React.useCallback(function (params) {
    var id = params.id,
      field = params.field,
      other = _objectWithoutProperties(params, _excluded);
    throwIfNotEditable(id, field);
    throwIfNotInMode(id, field, GridCellModes.View);
    updateFieldInCellModesModel(id, field, _extends({
      mode: GridCellModes.Edit
    }, other));
  }, [throwIfNotEditable, throwIfNotInMode, updateFieldInCellModesModel]);
  var updateStateToStartCellEditMode = useEventCallback(function (params) {
    var id = params.id,
      field = params.field,
      deleteValue = params.deleteValue,
      initialValue = params.initialValue;
    var newValue = apiRef.current.getCellValue(id, field);
    if (deleteValue || initialValue) {
      newValue = deleteValue ? '' : initialValue;
    }
    var newProps = {
      value: newValue,
      error: false,
      isProcessingProps: false
    };
    updateOrDeleteFieldState(id, field, newProps);
    apiRef.current.setCellFocus(id, field);
  });
  var stopCellEditMode = React.useCallback(function (params) {
    var id = params.id,
      field = params.field,
      other = _objectWithoutProperties(params, _excluded2);
    throwIfNotInMode(id, field, GridCellModes.Edit);
    updateFieldInCellModesModel(id, field, _extends({
      mode: GridCellModes.View
    }, other));
  }, [throwIfNotInMode, updateFieldInCellModesModel]);
  var updateStateToStopCellEditMode = useEventCallback( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(params) {
      var id, field, ignoreModifications, _params$cellToFocusAf, cellToFocusAfter, finishCellEditMode, editingState, _editingState$id$fiel, error, isProcessingProps, rowUpdate, handleError, row;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = params.id, field = params.field, ignoreModifications = params.ignoreModifications, _params$cellToFocusAf = params.cellToFocusAfter, cellToFocusAfter = _params$cellToFocusAf === void 0 ? 'none' : _params$cellToFocusAf;
              throwIfNotInMode(id, field, GridCellModes.Edit);
              apiRef.current.runPendingEditCellValueMutation(id, field);
              finishCellEditMode = function finishCellEditMode() {
                updateOrDeleteFieldState(id, field, null);
                updateFieldInCellModesModel(id, field, null);
                if (cellToFocusAfter !== 'none') {
                  apiRef.current.moveFocusToRelativeCell(id, field, cellToFocusAfter);
                }
              };
              if (!ignoreModifications) {
                _context.next = 7;
                break;
              }
              finishCellEditMode();
              return _context.abrupt("return");
            case 7:
              editingState = gridEditRowsStateSelector(apiRef.current.state);
              _editingState$id$fiel = editingState[id][field], error = _editingState$id$fiel.error, isProcessingProps = _editingState$id$fiel.isProcessingProps;
              if (!(error || isProcessingProps)) {
                _context.next = 13;
                break;
              }
              // Attempt to change cell mode to "view" was not successful
              // Update previous mode to allow another attempt
              prevCellModesModel.current[id][field].mode = GridCellModes.Edit;
              // Revert the mode in the cellModesModel prop back to "edit"
              updateFieldInCellModesModel(id, field, {
                mode: GridCellModes.Edit
              });
              return _context.abrupt("return");
            case 13:
              rowUpdate = apiRef.current.getRowWithUpdatedValuesFromCellEditing(id, field);
              if (processRowUpdate) {
                handleError = function handleError(errorThrown) {
                  prevCellModesModel.current[id][field].mode = GridCellModes.Edit;
                  // Revert the mode in the cellModesModel prop back to "edit"
                  updateFieldInCellModesModel(id, field, {
                    mode: GridCellModes.Edit
                  });
                  if (onProcessRowUpdateError) {
                    onProcessRowUpdateError(errorThrown);
                  } else {
                    missingOnProcessRowUpdateErrorWarning();
                  }
                };
                try {
                  row = apiRef.current.getRow(id);
                  Promise.resolve(processRowUpdate(rowUpdate, row)).then(function (finalRowUpdate) {
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
            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  var setCellEditingEditCellValue = React.useCallback( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(params) {
      var _editingState$id, _editingState$id$fiel2;
      var id, field, value, debounceMs, skipValueParser, column, row, parsedValue, editingState, newProps, hasChanged;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = params.id, field = params.field, value = params.value, debounceMs = params.debounceMs, skipValueParser = params.unstable_skipValueParser;
              throwIfNotEditable(id, field);
              throwIfNotInMode(id, field, GridCellModes.Edit);
              column = apiRef.current.getColumn(field);
              row = apiRef.current.getRow(id);
              parsedValue = value;
              if (column.valueParser && !skipValueParser) {
                parsedValue = column.valueParser(value, apiRef.current.getCellParams(id, field));
              }
              editingState = gridEditRowsStateSelector(apiRef.current.state);
              newProps = _extends({}, editingState[id][field], {
                value: parsedValue,
                changeReason: debounceMs ? 'debouncedSetEditCellValue' : 'setEditCellValue'
              });
              if (!column.preProcessEditCellProps) {
                _context2.next = 16;
                break;
              }
              hasChanged = value !== editingState[id][field].value;
              newProps = _extends({}, newProps, {
                isProcessingProps: true
              });
              updateOrDeleteFieldState(id, field, newProps);
              _context2.next = 15;
              return Promise.resolve(column.preProcessEditCellProps({
                id: id,
                row: row,
                props: newProps,
                hasChanged: hasChanged
              }));
            case 15:
              newProps = _context2.sent;
            case 16:
              if (!(apiRef.current.getCellMode(id, field) === GridCellModes.View)) {
                _context2.next = 18;
                break;
              }
              return _context2.abrupt("return", false);
            case 18:
              editingState = gridEditRowsStateSelector(apiRef.current.state);
              newProps = _extends({}, newProps, {
                isProcessingProps: false
              });
              // We don't update the value with the one coming from the props pre-processing
              // because when the promise resolves it may be already outdated. The only
              // exception to this rule is when there's no pre-processing.
              newProps.value = column.preProcessEditCellProps ? editingState[id][field].value : parsedValue;
              updateOrDeleteFieldState(id, field, newProps);
              editingState = gridEditRowsStateSelector(apiRef.current.state);
              return _context2.abrupt("return", !((_editingState$id = editingState[id]) != null && (_editingState$id$fiel2 = _editingState$id[field]) != null && _editingState$id$fiel2.error));
            case 24:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }(), [apiRef, throwIfNotEditable, throwIfNotInMode, updateOrDeleteFieldState]);
  var getRowWithUpdatedValuesFromCellEditing = React.useCallback(function (id, field) {
    var column = apiRef.current.getColumn(field);
    var editingState = gridEditRowsStateSelector(apiRef.current.state);
    var row = apiRef.current.getRow(id);
    if (!editingState[id] || !editingState[id][field]) {
      return apiRef.current.getRow(id);
    }
    var value = editingState[id][field].value;
    return column.valueSetter ? column.valueSetter({
      value: value,
      row: row
    }) : _extends({}, row, _defineProperty({}, field, value));
  }, [apiRef]);
  var editingApi = {
    getCellMode: getCellMode,
    startCellEditMode: startCellEditMode,
    stopCellEditMode: stopCellEditMode
  };
  var editingPrivateApi = {
    setCellEditingEditCellValue: setCellEditingEditCellValue,
    getRowWithUpdatedValuesFromCellEditing: getRowWithUpdatedValuesFromCellEditing
  };
  useGridApiMethod(apiRef, editingApi, 'public');
  useGridApiMethod(apiRef, editingPrivateApi, 'private');
  React.useEffect(function () {
    if (cellModesModelProp) {
      updateCellModesModel(cellModesModelProp);
    }
  }, [cellModesModelProp, updateCellModesModel]);
  React.useEffect(function () {
    var idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);

    // Update the ref here because updateStateToStopCellEditMode may change it later
    var copyOfPrevCellModes = prevCellModesModel.current;
    prevCellModesModel.current = deepClone(cellModesModel); // Do a deep-clone because the attributes might be changed later

    Object.entries(cellModesModel).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        id = _ref4[0],
        fields = _ref4[1];
      Object.entries(fields).forEach(function (_ref5) {
        var _copyOfPrevCellModes$, _copyOfPrevCellModes$2, _idToIdLookup$id;
        var _ref6 = _slicedToArray(_ref5, 2),
          field = _ref6[0],
          params = _ref6[1];
        var prevMode = ((_copyOfPrevCellModes$ = copyOfPrevCellModes[id]) == null ? void 0 : (_copyOfPrevCellModes$2 = _copyOfPrevCellModes$[field]) == null ? void 0 : _copyOfPrevCellModes$2.mode) || GridCellModes.View;
        var originalId = (_idToIdLookup$id = idToIdLookup[id]) != null ? _idToIdLookup$id : id;
        if (params.mode === GridCellModes.Edit && prevMode === GridCellModes.View) {
          updateStateToStartCellEditMode(_extends({
            id: originalId,
            field: field
          }, params));
        } else if (params.mode === GridCellModes.View && prevMode === GridCellModes.Edit) {
          updateStateToStopCellEditMode(_extends({
            id: originalId,
            field: field
          }, params));
        }
      });
    });
  }, [apiRef, cellModesModel, updateStateToStartCellEditMode, updateStateToStopCellEditMode]);
};