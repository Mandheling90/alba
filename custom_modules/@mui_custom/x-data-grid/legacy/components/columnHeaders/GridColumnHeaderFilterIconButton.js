import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import Badge from '@mui/material/Badge';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridIconButtonContainer } from './GridIconButtonContainer';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    icon: ['filterIcon']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnHeaderFilterIconButton(props) {
  var _rootProps$slotProps, _rootProps$slotProps2;
  var counter = props.counter,
    field = props.field,
    onClick = props.onClick;
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var ownerState = _extends({}, props, {
    classes: rootProps.classes
  });
  var classes = useUtilityClasses(ownerState);
  var toggleFilter = React.useCallback(function (event) {
    event.preventDefault();
    event.stopPropagation();
    var _gridPreferencePanelS = gridPreferencePanelStateSelector(apiRef.current.state),
      open = _gridPreferencePanelS.open,
      openedPanelValue = _gridPreferencePanelS.openedPanelValue;
    if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
      apiRef.current.hideFilterPanel();
    } else {
      apiRef.current.showFilterPanel();
    }
    if (onClick) {
      onClick(apiRef.current.getColumnHeaderParams(field), event);
    }
  }, [apiRef, field, onClick]);
  if (!counter) {
    return null;
  }
  var iconButton = /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
    onClick: toggleFilter,
    color: "default",
    "aria-label": apiRef.current.getLocaleText('columnHeaderFiltersLabel'),
    size: "small",
    tabIndex: -1
  }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseIconButton, {
    children: /*#__PURE__*/_jsx(rootProps.slots.columnFilteredIcon, {
      className: classes.icon,
      fontSize: "small"
    })
  }));
  return /*#__PURE__*/_jsx(rootProps.slots.baseTooltip, _extends({
    title: apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(counter),
    enterDelay: 1000
  }, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseTooltip, {
    children: /*#__PURE__*/_jsxs(GridIconButtonContainer, {
      children: [counter > 1 && /*#__PURE__*/_jsx(Badge, {
        badgeContent: counter,
        color: "default",
        children: iconButton
      }), counter === 1 && iconButton]
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridColumnHeaderFilterIconButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  onClick: PropTypes.func
} : void 0;
export { GridColumnHeaderFilterIconButton };