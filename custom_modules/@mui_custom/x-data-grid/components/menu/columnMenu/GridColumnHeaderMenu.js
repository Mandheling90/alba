import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { HTMLElementType } from '@mui/utils';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridMenu } from '../GridMenu';
import { jsx as _jsx } from "react/jsx-runtime";
function GridColumnHeaderMenu({
  columnMenuId,
  columnMenuButtonId,
  ContentComponent,
  contentComponentProps,
  field,
  open,
  target,
  onExited
}) {
  const apiRef = useGridApiContext();
  const colDef = apiRef.current.getColumn(field);
  const hideMenu = React.useCallback(event => {
    // Prevent triggering the sorting
    event.stopPropagation();
    apiRef.current.hideColumnMenu();
  }, [apiRef]);
  if (!target) {
    return null;
  }
  return /*#__PURE__*/_jsx(GridMenu, {
    placement: `bottom-${colDef.align === 'right' ? 'start' : 'end'}`,
    open: open,
    target: target,
    onClickAway: hideMenu,
    onExited: onExited,
    children: /*#__PURE__*/_jsx(ContentComponent, _extends({
      colDef: colDef,
      hideMenu: hideMenu,
      open: open,
      id: columnMenuId,
      labelledby: columnMenuButtonId
    }, contentComponentProps))
  });
}
process.env.NODE_ENV !== "production" ? GridColumnHeaderMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnMenuButtonId: PropTypes.string,
  columnMenuId: PropTypes.string,
  ContentComponent: PropTypes.elementType.isRequired,
  contentComponentProps: PropTypes.any,
  field: PropTypes.string.isRequired,
  onExited: PropTypes.func,
  open: PropTypes.bool.isRequired,
  target: HTMLElementType
} : void 0;
export { GridColumnHeaderMenu };