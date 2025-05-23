"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridFilterPanel = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _gridFilterItem = require("../../../models/gridFilterItem");
var _useGridApiContext = require("../../../hooks/utils/useGridApiContext");
var _GridPanelContent = require("../GridPanelContent");
var _GridPanelFooter = require("../GridPanelFooter");
var _GridPanelWrapper = require("../GridPanelWrapper");
var _GridFilterForm = require("./GridFilterForm");
var _useGridRootProps = require("../../../hooks/utils/useGridRootProps");
var _useGridSelector = require("../../../hooks/utils/useGridSelector");
var _gridFilterSelector = require("../../../hooks/features/filter/gridFilterSelector");
var _gridColumnsSelector = require("../../../hooks/features/columns/gridColumnsSelector");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["logicOperators", "columnsSort", "filterFormProps", "getColumnForNewFilter", "children", "disableAddFilterButton", "disableRemoveAllButton"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const getGridFilter = col => ({
  field: col.field,
  operator: col.filterOperators[0].value,
  id: Math.round(Math.random() * 1e5)
});
const GridFilterPanel = /*#__PURE__*/React.forwardRef(function GridFilterPanel(props, ref) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const filterModel = (0, _useGridSelector.useGridSelector)(apiRef, _gridFilterSelector.gridFilterModelSelector);
  const filterableColumns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridFilterableColumnDefinitionsSelector);
  const lastFilterRef = React.useRef(null);
  const {
      logicOperators = [_gridFilterItem.GridLogicOperator.And, _gridFilterItem.GridLogicOperator.Or],
      columnsSort,
      filterFormProps,
      getColumnForNewFilter,
      disableAddFilterButton = false,
      disableRemoveAllButton = false
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const applyFilter = React.useCallback(item => {
    apiRef.current.upsertFilterItem(item);
  }, [apiRef]);
  const applyFilterLogicOperator = React.useCallback(operator => {
    apiRef.current.setFilterLogicOperator(operator);
  }, [apiRef]);
  const getDefaultFilter = React.useCallback(() => {
    let nextColumnWithOperator;
    if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
      // To allow override the column for default (first) filter
      const nextFieldName = getColumnForNewFilter({
        currentFilters: filterModel?.items || [],
        columns: filterableColumns
      });
      if (nextFieldName === null) {
        return null;
      }
      nextColumnWithOperator = filterableColumns.find(({
        field
      }) => field === nextFieldName);
    } else {
      nextColumnWithOperator = filterableColumns.find(colDef => colDef.filterOperators?.length);
    }
    if (!nextColumnWithOperator) {
      return null;
    }
    return getGridFilter(nextColumnWithOperator);
  }, [filterModel?.items, filterableColumns, getColumnForNewFilter]);
  const getNewFilter = React.useCallback(() => {
    if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
      return getDefaultFilter();
    }
    const currentFilters = filterModel.items.length ? filterModel.items : [getDefaultFilter()].filter(Boolean);

    // If no items are there in filterModel, we have to pass defaultFilter
    const nextColumnFieldName = getColumnForNewFilter({
      currentFilters: currentFilters,
      columns: filterableColumns
    });
    if (nextColumnFieldName === null) {
      return null;
    }
    const nextColumnWithOperator = filterableColumns.find(({
      field
    }) => field === nextColumnFieldName);
    if (!nextColumnWithOperator) {
      return null;
    }
    return getGridFilter(nextColumnWithOperator);
  }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);
  const items = React.useMemo(() => {
    if (filterModel.items.length) {
      return filterModel.items;
    }
    const defaultFilter = getDefaultFilter();
    return defaultFilter ? [defaultFilter] : [];
  }, [filterModel.items, getDefaultFilter]);
  const hasMultipleFilters = items.length > 1;
  const addNewFilter = () => {
    const newFilter = getNewFilter();
    if (!newFilter) {
      return;
    }
    apiRef.current.upsertFilterItems([...items, newFilter]);
  };
  const deleteFilter = React.useCallback(item => {
    const shouldCloseFilterPanel = items.length === 1;
    apiRef.current.deleteFilterItem(item);
    if (shouldCloseFilterPanel) {
      apiRef.current.hideFilterPanel();
    }
  }, [apiRef, items.length]);
  const handleRemoveAll = () => {
    if (items.length === 1 && items[0].value === undefined) {
      apiRef.current.deleteFilterItem(items[0]);
      apiRef.current.hideFilterPanel();
    }
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items: []
    }));
  };
  React.useEffect(() => {
    if (logicOperators.length > 0 && filterModel.logicOperator && !logicOperators.includes(filterModel.logicOperator)) {
      applyFilterLogicOperator(logicOperators[0]);
    }
  }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);
  React.useEffect(() => {
    if (items.length > 0) {
      lastFilterRef.current.focus();
    }
  }, [items.length]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridPanelWrapper.GridPanelWrapper, (0, _extends2.default)({
    ref: ref
  }, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_GridPanelContent.GridPanelContent, {
      children: items.map((item, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridFilterForm.GridFilterForm, (0, _extends2.default)({
        item: item,
        applyFilterChanges: applyFilter,
        deleteFilter: deleteFilter,
        hasMultipleFilters: hasMultipleFilters,
        showMultiFilterOperators: index > 0,
        multiFilterOperator: filterModel.logicOperator,
        disableMultiFilterOperator: index !== 1,
        applyMultiFilterOperatorChanges: applyFilterLogicOperator,
        focusElementRef: index === items.length - 1 ? lastFilterRef : null,
        logicOperators: logicOperators,
        columnsSort: columnsSort
      }, filterFormProps), item.id == null ? index : item.id))
    }), !rootProps.disableMultipleColumnsFiltering && !disableAddFilterButton && !disableRemoveAllButton ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridPanelFooter.GridPanelFooter, {
      children: [!disableAddFilterButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseButton, (0, _extends2.default)({
        onClick: addNewFilter,
        startIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.filterPanelAddIcon, {})
      }, rootProps.slotProps?.baseButton, {
        children: apiRef.current.getLocaleText('filterPanelAddFilter')
      })) : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {}), !disableRemoveAllButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseButton, (0, _extends2.default)({
        onClick: handleRemoveAll,
        startIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.filterPanelRemoveAllIcon, {})
      }, rootProps.slotProps?.baseButton, {
        children: apiRef.current.getLocaleText('filterPanelRemoveAll')
      })) : null]
    }) : null]
  }));
});
exports.GridFilterPanel = GridFilterPanel;
process.env.NODE_ENV !== "production" ? GridFilterPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore - do not document.
   */
  children: _propTypes.default.node,
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: _propTypes.default.oneOf(['asc', 'desc']),
  disableAddFilterButton: _propTypes.default.bool,
  disableRemoveAllButton: _propTypes.default.bool,
  /**
   * Props passed to each filter form.
   */
  filterFormProps: _propTypes.default.shape({
    columnInputProps: _propTypes.default.any,
    columnsSort: _propTypes.default.oneOf(['asc', 'desc']),
    deleteIconProps: _propTypes.default.any,
    filterColumns: _propTypes.default.func,
    logicOperatorInputProps: _propTypes.default.any,
    operatorInputProps: _propTypes.default.any,
    valueInputProps: _propTypes.default.any
  }),
  /**
   * Function that returns the next filter item to be picked as default filter.
   * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
   * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
   */
  getColumnForNewFilter: _propTypes.default.func,
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators: _propTypes.default.arrayOf(_propTypes.default.oneOf(['and', 'or']).isRequired),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;