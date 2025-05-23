import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
export function GridFooterPlaceholder() {
  var _rootProps$slotProps;
  var rootProps = useGridRootProps();
  if (rootProps.hideFooter) {
    return null;
  }
  return /*#__PURE__*/_jsx(rootProps.slots.footer, _extends({}, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.footer));
}