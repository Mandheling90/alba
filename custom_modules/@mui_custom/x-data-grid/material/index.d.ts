/// <reference types="react" />
import MUICheckbox from '@mui/material/Checkbox';
import MUITextField from '@mui/material/TextField';
import MUISwitch from '@mui/material/Switch';
import MUITooltip from '@mui/material/Tooltip';
import MUISelectOption from './components/MUISelectOption';
declare const materialSlots: {
    BaseCheckbox: typeof MUICheckbox;
    BaseTextField: typeof MUITextField;
    BaseFormControl: import("@mui/material/OverridableComponent").OverridableComponent<import("@mui/material/FormControl").FormControlTypeMap<{}, "div">>;
    BaseSelect: (<T>(props: import("@mui/material/Select").SelectProps<T>) => JSX.Element) & {
        muiName: string;
    };
    BaseSwitch: typeof MUISwitch;
    BaseButton: import("@mui/material").ExtendButtonBase<import("@mui/material/Button").ButtonTypeMap<{}, "button">>;
    BaseIconButton: import("@mui/material").ExtendButtonBase<import("@mui/material/IconButton").IconButtonTypeMap<{}, "button">>;
    BaseTooltip: typeof MUITooltip;
    BasePopper: import("react").ForwardRefExoticComponent<Omit<import("@mui/base").PopperUnstyledProps<"div", {}>, "direction"> & {
        components?: {
            Root?: import("react").ElementType<any> | undefined;
        } | undefined;
        componentsProps?: {
            root?: import("@mui/base").SlotComponentProps<"div", import("@mui/base").PopperUnstyledRootSlotPropsOverrides, import("@mui/base").PopperUnstyledOwnerState> | undefined;
        } | undefined;
        sx?: import("@mui/system").SxProps<import("@mui/material").Theme> | undefined;
    } & import("react").RefAttributes<HTMLDivElement>>;
    BaseInputLabel: import("@mui/material/OverridableComponent").OverridableComponent<import("@mui/material/InputLabel").InputLabelTypeMap<{}, "label">>;
    BaseSelectOption: typeof MUISelectOption;
    BooleanCellTrueIcon: import("react").JSXElementConstructor<any>;
    BooleanCellFalseIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuIcon: import("react").JSXElementConstructor<any>;
    OpenFilterButtonIcon: import("react").JSXElementConstructor<any>;
    ColumnFilteredIcon: import("react").JSXElementConstructor<any>;
    ColumnSelectorIcon: import("react").JSXElementConstructor<any>;
    ColumnUnsortedIcon: import("react").JSXElementConstructor<any> | null;
    ColumnSortedAscendingIcon: import("react").JSXElementConstructor<any> | null;
    ColumnSortedDescendingIcon: import("react").JSXElementConstructor<any> | null;
    ColumnResizeIcon: import("react").JSXElementConstructor<any>;
    DensityCompactIcon: import("react").JSXElementConstructor<any>;
    DensityStandardIcon: import("react").JSXElementConstructor<any>;
    DensityComfortableIcon: import("react").JSXElementConstructor<any>;
    ExportIcon: import("react").JSXElementConstructor<any>;
    MoreActionsIcon: import("react").JSXElementConstructor<any>;
    TreeDataExpandIcon: import("react").JSXElementConstructor<any>;
    TreeDataCollapseIcon: import("react").JSXElementConstructor<any>;
    GroupingCriteriaExpandIcon: import("react").JSXElementConstructor<any>;
    GroupingCriteriaCollapseIcon: import("react").JSXElementConstructor<any>;
    DetailPanelExpandIcon: import("react").JSXElementConstructor<any>;
    DetailPanelCollapseIcon: import("react").JSXElementConstructor<any>;
    FilterPanelAddIcon: import("react").JSXElementConstructor<any>;
    FilterPanelDeleteIcon: import("react").JSXElementConstructor<any>;
    FilterPanelRemoveAllIcon: import("react").JSXElementConstructor<any>;
    RowReorderIcon: import("react").JSXElementConstructor<any>;
    QuickFilterIcon: import("react").JSXElementConstructor<any>;
    QuickFilterClearIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuHideIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuSortAscendingIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuSortDescendingIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuFilterIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuManageColumnsIcon: import("react").JSXElementConstructor<any>;
    ColumnMenuClearIcon: import("react").JSXElementConstructor<any>;
    LoadIcon: import("react").JSXElementConstructor<any>;
    ColumnReorderIcon: import("react").JSXElementConstructor<any>;
};
export default materialSlots;
