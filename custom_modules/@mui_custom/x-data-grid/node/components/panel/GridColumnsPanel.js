"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnsPanel = GridColumnsPanel;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Switch = require("@mui/material/Switch");
var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));
var _styles = require("@mui/material/styles");
var _gridColumnsSelector = require("../../hooks/features/columns/gridColumnsSelector");
var _useGridSelector = require("../../hooks/utils/useGridSelector");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _GridPanelContent = require("./GridPanelContent");
var _GridPanelFooter = require("./GridPanelFooter");
var _GridPanelHeader = require("./GridPanelHeader");
var _GridPanelWrapper = require("./GridPanelWrapper");
var _envConstants = require("../../constants/envConstants");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _gridClasses = require("../../constants/gridClasses");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["sort", "searchPredicate", "autoFocusSearchField", "disableHideAllButton", "disableShowAllButton"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['columnsPanel'],
    columnsPanelRow: ['columnsPanelRow']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
const GridColumnsPanelRoot = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanel',
  overridesResolver: (props, styles) => styles.columnsPanel
})({
  padding: '8px 0px 8px 8px'
});
const GridColumnsPanelRowRoot = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsPanelRow',
  overridesResolver: (props, styles) => styles.columnsPanelRow
})(({
  theme
}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1px 8px 1px 7px',
  [`& .${_Switch.switchClasses.root}`]: {
    marginRight: theme.spacing(0.5)
  }
}));
const GridIconButtonRoot = (0, _styles.styled)(_IconButton.default)({
  justifyContent: 'flex-end'
});
const collator = new Intl.Collator();
const defaultSearchPredicate = (column, searchValue) => {
  return (column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1;
};
function GridColumnsPanel(props) {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const searchInputRef = React.useRef(null);
  const columns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnDefinitionsSelector);
  const columnVisibilityModel = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnVisibilityModelSelector);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const [searchValue, setSearchValue] = React.useState('');
  const classes = useUtilityClasses(rootProps);
  const {
      sort,
      searchPredicate = defaultSearchPredicate,
      autoFocusSearchField = true,
      disableHideAllButton = false,
      disableShowAllButton = false
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
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
    const currentModel = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
    const newModel = (0, _extends2.default)({}, currentModel);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridPanelWrapper.GridPanelWrapper, (0, _extends2.default)({}, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_GridPanelHeader.GridPanelHeader, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseTextField, (0, _extends2.default)({
        label: apiRef.current.getLocaleText('columnsPanelTextFieldLabel'),
        placeholder: apiRef.current.getLocaleText('columnsPanelTextFieldPlaceholder'),
        inputRef: searchInputRef,
        value: searchValue,
        onChange: handleSearchValueChange,
        variant: "standard",
        fullWidth: true
      }, rootProps.slotProps?.baseTextField))
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridPanelContent.GridPanelContent, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(GridColumnsPanelRoot, {
        className: classes.root,
        ownerState: rootProps,
        children: currentColumns.map(column => /*#__PURE__*/(0, _jsxRuntime.jsxs)(GridColumnsPanelRowRoot, {
          className: classes.columnsPanelRow,
          ownerState: rootProps,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
            control: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseSwitch, (0, _extends2.default)({
              disabled: column.hideable === false,
              checked: columnVisibilityModel[column.field] !== false,
              onClick: toggleColumn,
              name: column.field,
              size: "small",
              inputRef: isFirstHideableColumn(column) ? firstSwitchRef : undefined
            }, rootProps.slotProps?.baseSwitch)),
            label: column.headerName || column.field
          }), !rootProps.disableColumnReorder && _envConstants.GRID_EXPERIMENTAL_ENABLED && /*#__PURE__*/(0, _jsxRuntime.jsx)(GridIconButtonRoot, {
            draggable: true,
            "aria-label": apiRef.current.getLocaleText('columnsPanelDragIconLabel'),
            title: apiRef.current.getLocaleText('columnsPanelDragIconLabel'),
            size: "small",
            disabled: true,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnReorderIcon, {})
          })]
        }, column.field))
      })
    }), disableShowAllButton && disableHideAllButton ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_GridPanelFooter.GridPanelFooter, {
      children: [!disableHideAllButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseButton, (0, _extends2.default)({
        onClick: () => toggleAllColumns(false)
      }, rootProps.slotProps?.baseButton, {
        disabled: disableHideAllButton,
        children: apiRef.current.getLocaleText('columnsPanelHideAllButton')
      })) : /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {}), !disableShowAllButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseButton, (0, _extends2.default)({
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
  autoFocusSearchField: _propTypes.default.bool,
  disableHideAllButton: _propTypes.default.bool,
  disableShowAllButton: _propTypes.default.bool,
  searchPredicate: _propTypes.default.func,
  slotProps: _propTypes.default.object,
  sort: _propTypes.default.oneOf(['asc', 'desc'])
} : void 0;