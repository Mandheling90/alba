import _extends from "@babel/runtime/helpers/esm/extends";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _excluded = ["sort", "searchPredicate", "autoFocusSearchField", "disableHideAllButton", "disableShowAllButton"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import { switchClasses } from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import { gridColumnDefinitionsSelector, gridColumnVisibilityModelSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridPanelContent } from './GridPanelContent';
import { GridPanelFooter } from './GridPanelFooter';
import { GridPanelHeader } from './GridPanelHeader';
import { GridPanelWrapper } from './GridPanelWrapper';
import { GRID_EXPERIMENTAL_ENABLED } from '../../constants/envConstants';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['columnsPanel'],
    columnsPanelRow: ['columnsPanelRow']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridColumnsPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanel',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.columnsPanel;
  }
})({
  padding: '8px 0px 8px 8px'
});
var GridColumnsPanelRowRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanelRow',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.columnsPanelRow;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return _defineProperty({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1px 8px 1px 7px'
  }, "& .".concat(switchClasses.root), {
    marginRight: theme.spacing(0.5)
  });
});
var GridIconButtonRoot = styled(IconButton)({
  justifyContent: 'flex-end'
});
var collator = new Intl.Collator();
var defaultSearchPredicate = function defaultSearchPredicate(column, searchValue) {
  return (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1;
};
function GridColumnsPanel(props) {
  var _rootProps$slotProps, _rootProps$slotProps3, _rootProps$slotProps4;
  var apiRef = useGridApiContext();
  var searchInputRef = React.useRef(null);
  var columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  var columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  var rootProps = useGridRootProps();
  var _React$useState = React.useState(''),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    searchValue = _React$useState2[0],
    setSearchValue = _React$useState2[1];
  var classes = useUtilityClasses(rootProps);
  var sort = props.sort,
    _props$searchPredicat = props.searchPredicate,
    searchPredicate = _props$searchPredicat === void 0 ? defaultSearchPredicate : _props$searchPredicat,
    _props$autoFocusSearc = props.autoFocusSearchField,
    autoFocusSearchField = _props$autoFocusSearc === void 0 ? true : _props$autoFocusSearc,
    _props$disableHideAll = props.disableHideAllButton,
    disableHideAllButton = _props$disableHideAll === void 0 ? false : _props$disableHideAll,
    _props$disableShowAll = props.disableShowAllButton,
    disableShowAllButton = _props$disableShowAll === void 0 ? false : _props$disableShowAll,
    other = _objectWithoutProperties(props, _excluded);
  var sortedColumns = React.useMemo(function () {
    switch (sort) {
      case 'asc':
        return _toConsumableArray(columns).sort(function (a, b) {
          return collator.compare(a.headerName || a.field, b.headerName || b.field);
        });
      case 'desc':
        return _toConsumableArray(columns).sort(function (a, b) {
          return -collator.compare(a.headerName || a.field, b.headerName || b.field);
        });
      default:
        return columns;
    }
  }, [columns, sort]);
  var toggleColumn = function toggleColumn(event) {
    var _ref3 = event.target,
      field = _ref3.name;
    apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
  };
  var toggleAllColumns = React.useCallback(function (isVisible) {
    var currentModel = gridColumnVisibilityModelSelector(apiRef);
    var newModel = _extends({}, currentModel);
    columns.forEach(function (col) {
      if (col.hideable) {
        if (isVisible) {
          // delete the key from the model instead of setting it to `true`
          delete newModel[col.field];
        } else {
          newModel[col.field] = false;
        }
      }
    });
    return apiRef.current.setColumnVisibilityModel(newModel);
  }, [apiRef, columns]);
  var handleSearchValueChange = React.useCallback(function (event) {
    setSearchValue(event.target.value);
  }, []);
  var currentColumns = React.useMemo(function () {
    if (!searchValue) {
      return sortedColumns;
    }
    var searchValueToCheck = searchValue.toLowerCase();
    return sortedColumns.filter(function (column) {
      return searchPredicate(column, searchValueToCheck);
    });
  }, [sortedColumns, searchValue, searchPredicate]);
  var firstSwitchRef = React.useRef(null);
  React.useEffect(function () {
    if (autoFocusSearchField) {
      searchInputRef.current.focus();
    } else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
      firstSwitchRef.current.focus();
    }
  }, [autoFocusSearchField]);
  var firstHideableColumnFound = false;
  var isFirstHideableColumn = function isFirstHideableColumn(column) {
    if (firstHideableColumnFound === false && column.hideable !== false) {
      firstHideableColumnFound = true;
      return true;
    }
    return false;
  };
  return /*#__PURE__*/_jsxs(GridPanelWrapper, _extends({}, other, {
    children: [/*#__PURE__*/_jsx(GridPanelHeader, {
      children: /*#__PURE__*/_jsx(rootProps.slots.baseTextField, _extends({
        label: apiRef.current.getLocaleText('columnsPanelTextFieldLabel'),
        placeholder: apiRef.current.getLocaleText('columnsPanelTextFieldPlaceholder'),
        inputRef: searchInputRef,
        value: searchValue,
        onChange: handleSearchValueChange,
        variant: "standard",
        fullWidth: true
      }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseTextField))
    }), /*#__PURE__*/_jsx(GridPanelContent, {
      children: /*#__PURE__*/_jsx(GridColumnsPanelRoot, {
        className: classes.root,
        ownerState: rootProps,
        children: currentColumns.map(function (column) {
          var _rootProps$slotProps2;
          return /*#__PURE__*/_jsxs(GridColumnsPanelRowRoot, {
            className: classes.columnsPanelRow,
            ownerState: rootProps,
            children: [/*#__PURE__*/_jsx(FormControlLabel, {
              control: /*#__PURE__*/_jsx(rootProps.slots.baseSwitch, _extends({
                disabled: column.hideable === false,
                checked: columnVisibilityModel[column.field] !== false,
                onClick: toggleColumn,
                name: column.field,
                size: "small",
                inputRef: isFirstHideableColumn(column) ? firstSwitchRef : undefined
              }, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseSwitch)),
              label: column.headerName || column.field
            }), !rootProps.disableColumnReorder && GRID_EXPERIMENTAL_ENABLED && /*#__PURE__*/_jsx(GridIconButtonRoot, {
              draggable: true,
              "aria-label": apiRef.current.getLocaleText('columnsPanelDragIconLabel'),
              title: apiRef.current.getLocaleText('columnsPanelDragIconLabel'),
              size: "small",
              disabled: true,
              children: /*#__PURE__*/_jsx(rootProps.slots.columnReorderIcon, {})
            })]
          }, column.field);
        })
      })
    }), disableShowAllButton && disableHideAllButton ? null : /*#__PURE__*/_jsxs(GridPanelFooter, {
      children: [!disableHideAllButton ? /*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
        onClick: function onClick() {
          return toggleAllColumns(false);
        }
      }, (_rootProps$slotProps3 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps3.baseButton, {
        disabled: disableHideAllButton,
        children: apiRef.current.getLocaleText('columnsPanelHideAllButton')
      })) : /*#__PURE__*/_jsx("span", {}), !disableShowAllButton ? /*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
        onClick: function onClick() {
          return toggleAllColumns(true);
        }
      }, (_rootProps$slotProps4 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps4.baseButton, {
        disabled: disableShowAllButton,
        children: apiRef.current.getLocaleText('columnsPanelShowAllButton')
      })) : null]
    })]
  }));
}
process.env.NODE_ENV !== "production" ? GridColumnsPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocusSearchField: PropTypes.bool,
  disableHideAllButton: PropTypes.bool,
  disableShowAllButton: PropTypes.bool,
  searchPredicate: PropTypes.func,
  slotProps: PropTypes.object,
  sort: PropTypes.oneOf(['asc', 'desc'])
} : void 0;
export { GridColumnsPanel };