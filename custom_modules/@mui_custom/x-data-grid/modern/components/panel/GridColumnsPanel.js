import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["sort", "searchPredicate", "autoFocusSearchField", "disableHideAllButton", "disableShowAllButton"];
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
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['columnsPanel'],
    columnsPanelRow: ['columnsPanelRow']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridColumnsPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanel',
  overridesResolver: (props, styles) => styles.columnsPanel
})({
  padding: '8px 0px 8px 8px'
});
const GridColumnsPanelRowRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanelRow',
  overridesResolver: (props, styles) => styles.columnsPanelRow
})(({
  theme
}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1px 8px 1px 7px',
  [`& .${switchClasses.root}`]: {
    marginRight: theme.spacing(0.5)
  }
}));
const GridIconButtonRoot = styled(IconButton)({
  justifyContent: 'flex-end'
});
const collator = new Intl.Collator();
const defaultSearchPredicate = (column, searchValue) => {
  return (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1;
};
function GridColumnsPanel(props) {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef(null);
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const classes = useUtilityClasses(rootProps);
  const {
      sort,
      searchPredicate = defaultSearchPredicate,
      autoFocusSearchField = true,
      disableHideAllButton = false,
      disableShowAllButton = false
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const sortedColumns = React.useMemo(() => {
    switch (sort) {
      case 'asc':
        return [...columns].sort((a, b) => collator.compare(a.headerName || a.field, b.headerName || b.field));
      case 'desc':
        return [...columns].sort((a, b) => -collator.compare(a.headerName || a.field, b.headerName || b.field));
      default:
        return columns;
    }
  }, [columns, sort]);
  const toggleColumn = event => {
    const {
      name: field
    } = event.target;
    apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
  };
  const toggleAllColumns = React.useCallback(isVisible => {
    const currentModel = gridColumnVisibilityModelSelector(apiRef);
    const newModel = _extends({}, currentModel);
    columns.forEach(col => {
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
  const handleSearchValueChange = React.useCallback(event => {
    setSearchValue(event.target.value);
  }, []);
  const currentColumns = React.useMemo(() => {
    if (!searchValue) {
      return sortedColumns;
    }
    const searchValueToCheck = searchValue.toLowerCase();
    return sortedColumns.filter(column => searchPredicate(column, searchValueToCheck));
  }, [sortedColumns, searchValue, searchPredicate]);
  const firstSwitchRef = React.useRef(null);
  React.useEffect(() => {
    if (autoFocusSearchField) {
      searchInputRef.current.focus();
    } else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
      firstSwitchRef.current.focus();
    }
  }, [autoFocusSearchField]);
  let firstHideableColumnFound = false;
  const isFirstHideableColumn = column => {
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
      }, rootProps.slotProps?.baseTextField))
    }), /*#__PURE__*/_jsx(GridPanelContent, {
      children: /*#__PURE__*/_jsx(GridColumnsPanelRoot, {
        className: classes.root,
        ownerState: rootProps,
        children: currentColumns.map(column => /*#__PURE__*/_jsxs(GridColumnsPanelRowRoot, {
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
            }, rootProps.slotProps?.baseSwitch)),
            label: column.headerName || column.field
          }), !rootProps.disableColumnReorder && GRID_EXPERIMENTAL_ENABLED && /*#__PURE__*/_jsx(GridIconButtonRoot, {
            draggable: true,
            "aria-label": apiRef.current.getLocaleText('columnsPanelDragIconLabel'),
            title: apiRef.current.getLocaleText('columnsPanelDragIconLabel'),
            size: "small",
            disabled: true,
            children: /*#__PURE__*/_jsx(rootProps.slots.columnReorderIcon, {})
          })]
        }, column.field))
      })
    }), disableShowAllButton && disableHideAllButton ? null : /*#__PURE__*/_jsxs(GridPanelFooter, {
      children: [!disableHideAllButton ? /*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
        onClick: () => toggleAllColumns(false)
      }, rootProps.slotProps?.baseButton, {
        disabled: disableHideAllButton,
        children: apiRef.current.getLocaleText('columnsPanelHideAllButton')
      })) : /*#__PURE__*/_jsx("span", {}), !disableShowAllButton ? /*#__PURE__*/_jsx(rootProps.slots.baseButton, _extends({
        onClick: () => toggleAllColumns(true)
      }, rootProps.slotProps?.baseButton, {
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