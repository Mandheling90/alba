import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['main']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridMainContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Main',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.main;
  }
})(function () {
  return {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };
});
export function GridMainContainer(props) {
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  return /*#__PURE__*/_jsx(GridMainContainerRoot, {
    className: classes.root,
    ownerState: rootProps,
    children: props.children
  });
}