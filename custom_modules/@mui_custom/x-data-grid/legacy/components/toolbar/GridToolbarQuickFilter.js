import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _excluded = ["quickFilterParser", "quickFilterFormatter", "debounceMs"];
import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { unstable_debounce as debounce } from '@mui/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridQuickFilterValuesSelector } from '../../hooks/features/filter';
import { isDeepEqual } from '../../utils/utils';
import { jsx as _jsx } from "react/jsx-runtime";
var GridToolbarQuickFilterRoot = styled(TextField, {
  name: 'MuiDataGrid',
  slot: 'ToolbarQuickFilter',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.toolbarQuickFilter;
  }
})(function (_ref) {
  var _ref2;
  var theme = _ref.theme;
  return _ref2 = {
    width: 'auto',
    paddingBottom: theme.spacing(0.5),
    '& input': {
      marginLeft: theme.spacing(0.5)
    },
    '& .MuiInput-underline:before': {
      borderBottom: "1px solid ".concat((theme.vars || theme).palette.divider)
    }
  }, _defineProperty(_ref2, "& input[type=search]::-ms-clear,\n& input[type=search]::-ms-reveal", {
    /* clears the 'X' icon from IE */
    display: 'none',
    width: 0,
    height: 0
  }), _defineProperty(_ref2, "& input[type=\"search\"]::-webkit-search-decoration,\n  & input[type=\"search\"]::-webkit-search-cancel-button,\n  & input[type=\"search\"]::-webkit-search-results-button,\n  & input[type=\"search\"]::-webkit-search-results-decoration", {
    /* clears the 'X' icon from Chrome */
    display: 'none'
  }), _ref2;
});
var defaultSearchValueParser = function defaultSearchValueParser(searchText) {
  return searchText.split(' ').filter(function (word) {
    return word !== '';
  });
};
var defaultSearchValueFormatter = function defaultSearchValueFormatter(values) {
  return values.join(' ');
};
function GridToolbarQuickFilter(props) {
  var _rootProps$slotProps, _rootProps$slotProps2;
  var _props$quickFilterPar = props.quickFilterParser,
    quickFilterParser = _props$quickFilterPar === void 0 ? defaultSearchValueParser : _props$quickFilterPar,
    _props$quickFilterFor = props.quickFilterFormatter,
    quickFilterFormatter = _props$quickFilterFor === void 0 ? defaultSearchValueFormatter : _props$quickFilterFor,
    _props$debounceMs = props.debounceMs,
    debounceMs = _props$debounceMs === void 0 ? 500 : _props$debounceMs,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var quickFilterValues = useGridSelector(apiRef, gridQuickFilterValuesSelector);
  var _React$useState = React.useState(function () {
      return quickFilterFormatter(quickFilterValues != null ? quickFilterValues : []);
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    searchValue = _React$useState2[0],
    setSearchValue = _React$useState2[1];
  var _React$useState3 = React.useState(quickFilterValues),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    prevQuickFilterValues = _React$useState4[0],
    setPrevQuickFilterValues = _React$useState4[1];
  React.useEffect(function () {
    if (!isDeepEqual(prevQuickFilterValues, quickFilterValues)) {
      // The model of quick filter value has been updated
      setPrevQuickFilterValues(quickFilterValues);

      // Update the input value if needed to match the new model
      setSearchValue(function (prevSearchValue) {
        return isDeepEqual(quickFilterParser(prevSearchValue), quickFilterValues) ? prevSearchValue : quickFilterFormatter(quickFilterValues != null ? quickFilterValues : []);
      });
    }
  }, [prevQuickFilterValues, quickFilterValues, quickFilterFormatter, quickFilterParser]);
  var updateSearchValue = React.useCallback(function (newSearchValue) {
    apiRef.current.setQuickFilterValues(quickFilterParser(newSearchValue));
  }, [apiRef, quickFilterParser]);
  var debouncedUpdateSearchValue = React.useMemo(function () {
    return debounce(updateSearchValue, debounceMs);
  }, [updateSearchValue, debounceMs]);
  var handleSearchValueChange = React.useCallback(function (event) {
    var newSearchValue = event.target.value;
    setSearchValue(newSearchValue);
    debouncedUpdateSearchValue(newSearchValue);
  }, [debouncedUpdateSearchValue]);
  var handleSearchReset = React.useCallback(function () {
    setSearchValue('');
    updateSearchValue('');
  }, [updateSearchValue]);
  return /*#__PURE__*/_jsx(GridToolbarQuickFilterRoot, _extends({
    as: rootProps.slots.baseTextField,
    ownerState: rootProps,
    variant: "standard",
    value: searchValue,
    onChange: handleSearchValueChange,
    placeholder: apiRef.current.getLocaleText('toolbarQuickFilterPlaceholder'),
    "aria-label": apiRef.current.getLocaleText('toolbarQuickFilterLabel'),
    type: "search",
    InputProps: {
      startAdornment: /*#__PURE__*/_jsx(rootProps.slots.quickFilterIcon, {
        fontSize: "small"
      }),
      endAdornment: /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
        "aria-label": apiRef.current.getLocaleText('toolbarQuickFilterDeleteIconLabel'),
        size: "small",
        sx: {
          visibility: searchValue ? 'visible' : 'hidden'
        },
        onClick: handleSearchReset
      }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseIconButton, {
        children: /*#__PURE__*/_jsx(rootProps.slots.quickFilterClearIcon, {
          fontSize: "small"
        })
      }))
    }
  }, other, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseTextField));
}
process.env.NODE_ENV !== "production" ? GridToolbarQuickFilter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs: PropTypes.number,
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   */
  quickFilterFormatter: PropTypes.func,
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser: PropTypes.func
} : void 0;
export { GridToolbarQuickFilter };