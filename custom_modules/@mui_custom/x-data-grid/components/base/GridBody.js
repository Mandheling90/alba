import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridMainContainer } from '../containers/GridMainContainer';
import { GridAutoSizer } from '../GridAutoSizer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridColumnPositionsSelector, gridColumnVisibilityModelSelector, gridVisibleColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { gridFilterActiveItemsLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import { gridTabIndexColumnHeaderSelector, gridTabIndexCellSelector, gridFocusColumnHeaderSelector, unstable_gridTabIndexColumnGroupHeaderSelector, unstable_gridFocusColumnGroupHeaderSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { gridDensityFactorSelector } from '../../hooks/features/density/densitySelector';
import { gridColumnGroupsHeaderMaxDepthSelector, gridColumnGroupsHeaderStructureSelector } from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { gridColumnMenuSelector } from '../../hooks/features/columnMenu/columnMenuSelector';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function GridBody(props) {
  const {
    children,
    VirtualScrollerComponent,
    ColumnHeadersProps
  } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const columnHeaderTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnGroupHeaderTabIndexState = useGridSelector(apiRef, unstable_gridTabIndexColumnGroupHeaderSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const columnGroupHeaderFocus = useGridSelector(apiRef, unstable_gridFocusColumnGroupHeaderSelector);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const columnVisibility = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const columnGroupsHeaderStructure = useGridSelector(apiRef, gridColumnGroupsHeaderStructureSelector);
  const hasOtherElementInTabSequence = !(columnGroupHeaderTabIndexState === null && columnHeaderTabIndexState === null && cellTabIndexState === null);
  const [isVirtualizationDisabled, setIsVirtualizationDisabled] = React.useState(rootProps.disableVirtualization);
  const disableVirtualization = React.useCallback(() => {
    setIsVirtualizationDisabled(true);
  }, []);
  const enableVirtualization = React.useCallback(() => {
    setIsVirtualizationDisabled(false);
  }, []);
  React.useEffect(() => {
    setIsVirtualizationDisabled(rootProps.disableVirtualization);
  }, [rootProps.disableVirtualization]);

  // The `useGridApiMethod` hook can't be used here, because it only installs the
  // method if it doesn't exist yet. Once installed, it's never updated again.
  // This break the methods above, since their closure comes from the first time
  // they were installed. Which means that calling `setIsVirtualizationDisabled`
  // will trigger a re-render, but it won't update the state. That can be solved
  // by migrating the virtualization status to the global state.
  apiRef.current.unstable_disableVirtualization = disableVirtualization;
  apiRef.current.unstable_enableVirtualization = enableVirtualization;
  const columnHeadersRef = React.useRef(null);
  const columnsContainerRef = React.useRef(null);
  const virtualScrollerRef = React.useRef(null);
  apiRef.current.register('private', {
    columnHeadersContainerElementRef: columnsContainerRef,
    columnHeadersElementRef: columnHeadersRef,
    virtualScrollerRef
  });
  const handleResize = React.useCallback(size => {
    apiRef.current.publishEvent('resize', size);
  }, [apiRef]);
  return /*#__PURE__*/_jsxs(GridMainContainer, {
    children: [/*#__PURE__*/_jsx(rootProps.slots.columnHeaders, _extends({
      ref: columnsContainerRef,
      innerRef: columnHeadersRef,
      visibleColumns: visibleColumns,
      filterColumnLookup: filterColumnLookup,
      sortColumnLookup: sortColumnLookup,
      columnPositions: columnPositions,
      columnHeaderTabIndexState: columnHeaderTabIndexState,
      columnGroupHeaderTabIndexState: columnGroupHeaderTabIndexState,
      columnHeaderFocus: columnHeaderFocus,
      columnGroupHeaderFocus: columnGroupHeaderFocus,
      densityFactor: densityFactor,
      headerGroupingMaxDepth: headerGroupingMaxDepth,
      columnMenuState: columnMenuState,
      columnVisibility: columnVisibility,
      columnGroupsHeaderStructure: columnGroupsHeaderStructure,
      hasOtherElementInTabSequence: hasOtherElementInTabSequence
    }, ColumnHeadersProps)), /*#__PURE__*/_jsx(GridAutoSizer, {
      nonce: rootProps.nonce,
      disableHeight: rootProps.autoHeight,
      onResize: handleResize,
      children: /*#__PURE__*/_jsx(VirtualScrollerComponent, {
        ref: virtualScrollerRef,
        disableVirtualization: isVirtualizationDisabled
      })
    }), children]
  });
}
process.env.NODE_ENV !== "production" ? GridBody.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  ColumnHeadersProps: PropTypes.object,
  VirtualScrollerComponent: PropTypes.elementType.isRequired
} : void 0;
export { GridBody };