import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import { DEFAULT_GRID_COL_TYPE_KEY } from '../../../colDef';
import { gridColumnsStateSelector, gridColumnVisibilityModelSelector } from './gridColumnsSelector';
import { clamp } from '../../../utils/utils';
import { gridDensityFactorSelector } from '../density/densitySelector';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../columnGrouping/gridColumnGroupsSelector';
export var COLUMNS_DIMENSION_PROPERTIES = ['maxWidth', 'minWidth', 'width', 'flex'];
/**
 * Computes width for flex columns.
 * Based on CSS Flexbox specification:
 * https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
 */
export function computeFlexColumnsWidth(_ref) {
  var initialFreeSpace = _ref.initialFreeSpace,
    totalFlexUnits = _ref.totalFlexUnits,
    flexColumns = _ref.flexColumns;
  var flexColumnsLookup = {
    all: {},
    frozenFields: [],
    freeze: function freeze(field) {
      var value = flexColumnsLookup.all[field];
      if (value && value.frozen !== true) {
        flexColumnsLookup.all[field].frozen = true;
        flexColumnsLookup.frozenFields.push(field);
      }
    }
  };

  // Step 5 of https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
  function loopOverFlexItems() {
    // 5a: If all the flex items on the line are frozen, free space has been distributed.
    if (flexColumnsLookup.frozenFields.length === flexColumns.length) {
      return;
    }
    var violationsLookup = {
      min: {},
      max: {}
    };
    var remainingFreeSpace = initialFreeSpace;
    var flexUnits = totalFlexUnits;
    var totalViolation = 0;

    // 5b: Calculate the remaining free space
    flexColumnsLookup.frozenFields.forEach(function (field) {
      remainingFreeSpace -= flexColumnsLookup.all[field].computedWidth;
      flexUnits -= flexColumnsLookup.all[field].flex;
    });
    for (var i = 0; i < flexColumns.length; i += 1) {
      var column = flexColumns[i];
      if (flexColumnsLookup.all[column.field] && flexColumnsLookup.all[column.field].frozen === true) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // 5c: Distribute remaining free space proportional to the flex factors
      var widthPerFlexUnit = remainingFreeSpace / flexUnits;
      var computedWidth = widthPerFlexUnit * column.flex;

      // 5d: Fix min/max violations
      if (computedWidth < column.minWidth) {
        totalViolation += column.minWidth - computedWidth;
        computedWidth = column.minWidth;
        violationsLookup.min[column.field] = true;
      } else if (computedWidth > column.maxWidth) {
        totalViolation += column.maxWidth - computedWidth;
        computedWidth = column.maxWidth;
        violationsLookup.max[column.field] = true;
      }
      flexColumnsLookup.all[column.field] = {
        frozen: false,
        computedWidth: computedWidth,
        flex: column.flex
      };
    }

    // 5e: Freeze over-flexed items
    if (totalViolation < 0) {
      // Freeze all the items with max violations
      Object.keys(violationsLookup.max).forEach(function (field) {
        flexColumnsLookup.freeze(field);
      });
    } else if (totalViolation > 0) {
      // Freeze all the items with min violations
      Object.keys(violationsLookup.min).forEach(function (field) {
        flexColumnsLookup.freeze(field);
      });
    } else {
      // Freeze all items
      flexColumns.forEach(function (_ref2) {
        var field = _ref2.field;
        flexColumnsLookup.freeze(field);
      });
    }

    // 5f: Return to the start of this loop
    loopOverFlexItems();
  }
  loopOverFlexItems();
  return flexColumnsLookup.all;
}

/**
 * Compute the `computedWidth` (ie: the width the column should have during rendering) based on the `width` / `flex` / `minWidth` / `maxWidth` properties of `GridColDef`.
 * The columns already have been merged with there `type` default values for `minWidth`, `maxWidth` and `width`, thus the `!` for those properties below.
 * TODO: Unit test this function in depth and only keep basic cases for the whole grid testing.
 * TODO: Improve the `GridColDef` typing to reflect the fact that `minWidth` / `maxWidth` and `width` can't be null after the merge with the `type` default values.
 */
export var hydrateColumnsWidth = function hydrateColumnsWidth(rawState, viewportInnerWidth) {
  var columnsLookup = {};
  var totalFlexUnits = 0;
  var widthAllocatedBeforeFlex = 0;
  var flexColumns = [];

  // For the non-flex columns, compute their width
  // For the flex columns, compute there minimum width and how much width must be allocated during the flex allocation
  rawState.orderedFields.forEach(function (columnField) {
    var newColumn = _extends({}, rawState.lookup[columnField]);
    if (rawState.columnVisibilityModel[columnField] === false) {
      newColumn.computedWidth = 0;
    } else {
      var computedWidth;
      if (newColumn.flex && newColumn.flex > 0) {
        totalFlexUnits += newColumn.flex;
        computedWidth = 0;
        flexColumns.push(newColumn);
      } else {
        computedWidth = clamp(newColumn.width, newColumn.minWidth, newColumn.maxWidth);
      }
      widthAllocatedBeforeFlex += computedWidth;
      newColumn.computedWidth = computedWidth;
    }
    columnsLookup[columnField] = newColumn;
  });
  var initialFreeSpace = Math.max(viewportInnerWidth - widthAllocatedBeforeFlex, 0);

  // Allocate the remaining space to the flex columns
  if (totalFlexUnits > 0 && viewportInnerWidth > 0) {
    var computedColumnWidths = computeFlexColumnsWidth({
      initialFreeSpace: initialFreeSpace,
      totalFlexUnits: totalFlexUnits,
      flexColumns: flexColumns
    });
    Object.keys(computedColumnWidths).forEach(function (field) {
      columnsLookup[field].computedWidth = computedColumnWidths[field].computedWidth;
    });
  }
  return _extends({}, rawState, {
    lookup: columnsLookup
  });
};

/**
 * Apply the order and the dimensions of the initial state.
 * The columns not registered in `orderedFields` will be placed after the imported columns.
 */
export var applyInitialState = function applyInitialState(columnsState, initialState) {
  if (!initialState) {
    return columnsState;
  }
  var _initialState$ordered = initialState.orderedFields,
    orderedFields = _initialState$ordered === void 0 ? [] : _initialState$ordered,
    _initialState$dimensi = initialState.dimensions,
    dimensions = _initialState$dimensi === void 0 ? {} : _initialState$dimensi;
  var columnsWithUpdatedDimensions = Object.keys(dimensions);
  if (columnsWithUpdatedDimensions.length === 0 && orderedFields.length === 0) {
    return columnsState;
  }
  var orderedFieldsLookup = {};
  var cleanOrderedFields = [];
  for (var i = 0; i < orderedFields.length; i += 1) {
    var _field = orderedFields[i];

    // Ignores the fields in the initialState that matches no field on the current column state
    if (columnsState.lookup[_field]) {
      orderedFieldsLookup[_field] = true;
      cleanOrderedFields.push(_field);
    }
  }
  var newOrderedFields = cleanOrderedFields.length === 0 ? columnsState.orderedFields : [].concat(cleanOrderedFields, _toConsumableArray(columnsState.orderedFields.filter(function (field) {
    return !orderedFieldsLookup[field];
  })));
  var newColumnLookup = _extends({}, columnsState.lookup);
  var _loop = function _loop(_i) {
    var field = columnsWithUpdatedDimensions[_i];
    var newColDef = _extends({}, newColumnLookup[field], {
      hasBeenResized: true
    });
    Object.entries(dimensions[field]).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];
      newColDef[key] = value === -1 ? Infinity : value;
    });
    newColumnLookup[field] = newColDef;
  };
  for (var _i = 0; _i < columnsWithUpdatedDimensions.length; _i += 1) {
    _loop(_i);
  }
  var newColumnsState = _extends({}, columnsState, {
    orderedFields: newOrderedFields,
    lookup: newColumnLookup
  });
  return newColumnsState;
};
export var createColumnsState = function createColumnsState(_ref5) {
  var _apiRef$current$getRo, _apiRef$current$getRo2, _apiRef$current, _apiRef$current$getRo3;
  var apiRef = _ref5.apiRef,
    columnsToUpsert = _ref5.columnsToUpsert,
    initialState = _ref5.initialState,
    columnTypes = _ref5.columnTypes,
    _ref5$columnVisibilit = _ref5.columnVisibilityModel,
    columnVisibilityModel = _ref5$columnVisibilit === void 0 ? gridColumnVisibilityModelSelector(apiRef) : _ref5$columnVisibilit,
    _ref5$keepOnlyColumns = _ref5.keepOnlyColumnsToUpsert,
    keepOnlyColumnsToUpsert = _ref5$keepOnlyColumns === void 0 ? false : _ref5$keepOnlyColumns;
  var isInsideStateInitializer = !apiRef.current.state.columns;
  var columnsState;
  if (isInsideStateInitializer) {
    columnsState = {
      orderedFields: [],
      lookup: {},
      columnVisibilityModel: columnVisibilityModel
    };
  } else {
    var currentState = gridColumnsStateSelector(apiRef.current.state);
    columnsState = {
      orderedFields: keepOnlyColumnsToUpsert ? [] : _toConsumableArray(currentState.orderedFields),
      lookup: _extends({}, currentState.lookup),
      // Will be cleaned later if keepOnlyColumnsToUpsert=true
      columnVisibilityModel: columnVisibilityModel
    };
  }
  var columnsToKeep = {};
  if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
    columnsToKeep = Object.keys(columnsState.lookup).reduce(function (acc, key) {
      return _extends({}, acc, _defineProperty({}, key, false));
    }, {});
  }
  var columnsToUpsertLookup = {};
  columnsToUpsert.forEach(function (newColumn) {
    var field = newColumn.field;
    columnsToUpsertLookup[field] = true;
    columnsToKeep[field] = true;
    var existingState = columnsState.lookup[field];
    if (existingState == null) {
      var colDef = columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
      if (newColumn.type && columnTypes[newColumn.type]) {
        colDef = columnTypes[newColumn.type];
      }
      existingState = _extends({}, colDef, {
        field: field,
        hasBeenResized: false
      });
      columnsState.orderedFields.push(field);
    } else if (keepOnlyColumnsToUpsert) {
      columnsState.orderedFields.push(field);
    }
    var hasBeenResized = existingState.hasBeenResized;
    COLUMNS_DIMENSION_PROPERTIES.forEach(function (key) {
      if (newColumn[key] !== undefined) {
        hasBeenResized = true;
        if (newColumn[key] === -1) {
          newColumn[key] = Infinity;
        }
      }
    });
    columnsState.lookup[field] = _extends({}, existingState, newColumn, {
      hasBeenResized: hasBeenResized
    });
  });
  if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
    Object.keys(columnsState.lookup).forEach(function (field) {
      if (!columnsToKeep[field]) {
        delete columnsState.lookup[field];
      }
    });
  }
  var columnsStateWithPreProcessing = apiRef.current.unstable_applyPipeProcessors('hydrateColumns', columnsState);
  var columnsStateWithPortableColumns = applyInitialState(columnsStateWithPreProcessing, initialState);
  return hydrateColumnsWidth(columnsStateWithPortableColumns, (_apiRef$current$getRo = (_apiRef$current$getRo2 = (_apiRef$current = apiRef.current).getRootDimensions) == null ? void 0 : (_apiRef$current$getRo3 = _apiRef$current$getRo2.call(_apiRef$current)) == null ? void 0 : _apiRef$current$getRo3.viewportInnerSize.width) != null ? _apiRef$current$getRo : 0);
};
export var mergeColumnsState = function mergeColumnsState(columnsState) {
  return function (state) {
    return _extends({}, state, {
      columns: columnsState
    });
  };
};
export function getFirstNonSpannedColumnToRender(_ref6) {
  var firstColumnToRender = _ref6.firstColumnToRender,
    apiRef = _ref6.apiRef,
    firstRowToRender = _ref6.firstRowToRender,
    lastRowToRender = _ref6.lastRowToRender,
    visibleRows = _ref6.visibleRows;
  var firstNonSpannedColumnToRender = firstColumnToRender;
  for (var i = firstRowToRender; i < lastRowToRender; i += 1) {
    var row = visibleRows[i];
    if (row) {
      var rowId = visibleRows[i].id;
      var cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, firstColumnToRender);
      if (cellColSpanInfo && cellColSpanInfo.spannedByColSpan) {
        firstNonSpannedColumnToRender = cellColSpanInfo.leftVisibleCellIndex;
      }
    }
  }
  return firstNonSpannedColumnToRender;
}
export function getFirstColumnIndexToRender(_ref7) {
  var firstColumnIndex = _ref7.firstColumnIndex,
    minColumnIndex = _ref7.minColumnIndex,
    columnBuffer = _ref7.columnBuffer,
    firstRowToRender = _ref7.firstRowToRender,
    lastRowToRender = _ref7.lastRowToRender,
    apiRef = _ref7.apiRef,
    visibleRows = _ref7.visibleRows;
  var initialFirstColumnToRender = Math.max(firstColumnIndex - columnBuffer, minColumnIndex);
  var firstColumnToRender = getFirstNonSpannedColumnToRender({
    firstColumnToRender: initialFirstColumnToRender,
    apiRef: apiRef,
    firstRowToRender: firstRowToRender,
    lastRowToRender: lastRowToRender,
    visibleRows: visibleRows
  });
  return firstColumnToRender;
}
export function getTotalHeaderHeight(apiRef, headerHeight) {
  var densityFactor = gridDensityFactorSelector(apiRef);
  var maxDepth = gridColumnGroupsHeaderMaxDepthSelector(apiRef);
  return Math.floor(headerHeight * densityFactor) * ((maxDepth != null ? maxDepth : 0) + 1);
}