import _extends from "@babel/runtime/helpers/esm/extends";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["logicOperators", "columnsSort", "filterFormProps", "getColumnForNewFilter", "children", "disableAddFilterButton", "disableRemoveAllButton"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { GridLogicOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridPanelContent } from '../GridPanelContent';
import { GridPanelFooter } from '../GridPanelFooter';
import { GridPanelWrapper } from '../GridPanelWrapper';
import { GridFilterForm } from './GridFilterForm';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { gridFilterableColumnDefinitionsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var getGridFilter = function getGridFilter(col) {
  return {
    field: col.field,
    operator: col.filterOperators[0].value,
    id: Math.round(Math.random() * 1e5)
  };
};
var GridFilterPanel = /*#__PURE__*/React.forwardRef(function GridFilterPanel(props, ref) {
  var _rootProps$slotProps, _rootProps$slotProps2;
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  var filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
  var lastFilterRef = React.useRef(null);
  var _props$logicOperators = props.logicOperators,
    logicOperators = _props$logicOperators === void 0 ? [GridLogicOperator.And, GridLogicOperator.Or] : _props$logicOperators,
    columnsSort = props.columnsSort,
    filterFormProps = props.filterFormProps,
    getColumnForNewFilter = props.getColumnForNewFilter,
    children = props.children,
    _props$disableAddFilt = props.disableAddFilterButton,
    disableAddFilterButton = _props$disableAddFilt === void 0 ? false : _props$disableAddFilt,
    _props$disableRemoveA = props.disableRemoveAllButton,
    disableRemoveAllButton = _props$disableRemoveA === void 0 ? false : _props$disableRemoveA,
    other = _objectWithoutProperties(props, _excluded);
  var applyFilter = React.useCallback(function (item) {
    apiRef.current.upsertFilterItem(item);
  }, [apiRef]);
  var applyFilterLogicOperator = React.useCallback(function (operator) {
    apiRef.current.setFilterLogicOperator(operator);
  }, [apiRef]);
  var getDefaultFilter = React.useCallback(function () {
    var nextColumnWithOperator;
    if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
      // To allow override the column for default (first) filter
      var nextFieldName = getColumnForNewFilter({
        currentFilters: (filterModel == null ? void 0 : filterModel.items) || [],
        columns: filterableColumns
      });
      if (nextFieldName === null) {
        return null;
      }
      nextColumnWithOperator = filterableColumns.find(function (_ref) {
        var field = _ref.field;
        return field === nextFieldName;
      });
    } else {
      nextColumnWithOperator = filterableColumns.find(function (colDef) {
        var _colDef$filterOperato;
        return (_colDef$filterOperato = colDef.filterOperators) == null ? void 0 : _colDef$filterOperato.length;
      });
    }
    if (!nextColumnWithOperator) {
      return null;
    }
    return getGridFilter(nextColumnWithOperator);
  }, [filterModel == null ? void 0 : filterModel.items, filterableColumns, getColumnForNewFilter]);
  var getNewFilter = React.useCallback(function () {
    if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
      return getDefaultFilter();
    }
    var currentFilters = filterModel.items.length ? filterModel.items : [getDefaultFilter()].filter(Boolean);

    // If no items are there in filterModel, we have to pass defaultFilter
    var nextColumnFieldName = getColumnForNewFilter({
      currentFilters: currentFilters,
      columns: filterableColumns
    });
    if (nextColumnFieldName === null) {
      return null;
    }
    var nextColumnWithOperator = filterableColumns.find(function (_ref2) {
      var field = _ref2.field;
      return field === nextColumnFieldName;
    });
    if (!nextColumnWithOperator) {
      return null;
    }
    return getGridFilter(nextColumnWithOperator);
  }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);
  var items = React.useMemo(function () {
    if (filterModel.items.length) {
      return filterModel.items;
    }
    var defaultFilter = getDefaultFilter();
    return defaultFilter ? [defaultFilter] : [];
  }, [filterModel.items, getDefaultFilter]);
  var hasMultipleFilters = items.length > 1;
  var addNewFilter = function addNewFilter() {
    var newFilter = getNewFilter();
    if (!newFilter) {
      return;
    }
    apiRef.current.upsertFilterItems([].concat(_toConsumableArray(items), [newFilter]));
  };
  var deleteFilter = React.useCallback(function (item) {
    var shouldCloseFilterPanel = items.length === 1;
    apiRef.current.deleteFilterItem(item);
    if (shouldCloseFilterPanel) {
      apiRef.current.hideFilterPanel();
    }
  }, [apiRef, items.length]);
  var handleRemoveAll = function handleRemoveAll() {
    if (items.length === 1 && items[0].value === undefined) {
      apiRef.current.deleteFilterItem(items[0]);
      apiRef.current.hideFilterPanel();
    }
    apiRef.current.setFilterModel(_extends({}, filterModel, {
      items: []
    }));
  };
  React.useEffect(function () {
    if (logicOperators.length > 0 && filterModel.logicOperator && !logicOperators.includes(filterModel.logicOperator)) {
      applyFilterLogicOperator(logicOperators[0]);
    }
  }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);
  React.useEffect(function () {
    if (items.length > 0) {
      lastFilterRef.current.focus();
    }
  }, [items.length]);
  return /*#__PURE__*/_jsxs(GridPanelWrapper, _extends({
    ref: ref
  }, other, {
    children: [/*#__PURE__*/_jsx(GridPanelContent, {
      children: items.map(function (item, index) {
        return /*#__PURE__*/_jsx(GridFilterForm, _extends({
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
        }, filterFormProps), item.id == null ? index : item.id);
      })
    }), !rootProps.disableMultipleColumnsFiltering && !disableAddFilterButton && !disableRemoveAllButton ? /*#__PURE__*/_jsxs(GridPanelFooter, {
      children: [!disableAddFilterButton ? /*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
        onClick: addNewFilter,
        startIcon: /*#__PURE__*/_jsx(rootProps.slots.filterPanelAddIcon, {})
      }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseButton, {
        children: apiRef.current.getLocaleText('filterPanelAddFilter')
      })) : /*#__PURE__*/_jsx("span", {}), !disableRemoveAllButton ? /*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
        onClick: handleRemoveAll,
        startIcon: /*#__PURE__*/_jsx(rootProps.slots.filterPanelRemoveAllIcon, {})
      }, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseButton, {
        children: apiRef.current.getLocaleText('filterPanelRemoveAll')
      })) : null]
    }) : null]
  }));
});
process.env.NODE_ENV !== "production" ? GridFilterPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore - do not document.
   */
  children: PropTypes.node,
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  disableAddFilterButton: PropTypes.bool,
  disableRemoveAllButton: PropTypes.bool,
  /**
   * Props passed to each filter form.
   */
  filterFormProps: PropTypes.shape({
    columnInputProps: PropTypes.any,
    columnsSort: PropTypes.oneOf(['asc', 'desc']),
    deleteIconProps: PropTypes.any,
    filterColumns: PropTypes.func,
    logicOperatorInputProps: PropTypes.any,
    operatorInputProps: PropTypes.any,
    valueInputProps: PropTypes.any
  }),
  /**
   * Function that returns the next filter item to be picked as default filter.
   * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
   * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
   */
  getColumnForNewFilter: PropTypes.func,
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { GridFilterPanel };