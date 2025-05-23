import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["logicOperators", "columnsSort", "filterFormProps", "getColumnForNewFilter", "children", "disableAddFilterButton", "disableRemoveAllButton"];
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
const getGridFilter = col => ({
  field: col.field,
  operator: col.filterOperators[0].value,
  id: Math.round(Math.random() * 1e5)
});
const GridFilterPanel = /*#__PURE__*/React.forwardRef(function GridFilterPanel(props, ref) {
  var _rootProps$slotProps, _rootProps$slotProps2;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
  const lastFilterRef = React.useRef(null);
  const {
      logicOperators = [GridLogicOperator.And, GridLogicOperator.Or],
      columnsSort,
      filterFormProps,
      getColumnForNewFilter,
      disableAddFilterButton = false,
      disableRemoveAllButton = false
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
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
        currentFilters: (filterModel == null ? void 0 : filterModel.items) || [],
        columns: filterableColumns
      });
      if (nextFieldName === null) {
        return null;
      }
      nextColumnWithOperator = filterableColumns.find(({
        field
      }) => field === nextFieldName);
    } else {
      nextColumnWithOperator = filterableColumns.find(colDef => {
        var _colDef$filterOperato;
        return (_colDef$filterOperato = colDef.filterOperators) == null ? void 0 : _colDef$filterOperato.length;
      });
    }
    if (!nextColumnWithOperator) {
      return null;
    }
    return getGridFilter(nextColumnWithOperator);
  }, [filterModel == null ? void 0 : filterModel.items, filterableColumns, getColumnForNewFilter]);
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
    apiRef.current.setFilterModel(_extends({}, filterModel, {
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
  return /*#__PURE__*/_jsxs(GridPanelWrapper, _extends({
    ref: ref
  }, other, {
    children: [/*#__PURE__*/_jsx(GridPanelContent, {
      children: items.map((item, index) => /*#__PURE__*/_jsx(GridFilterForm, _extends({
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