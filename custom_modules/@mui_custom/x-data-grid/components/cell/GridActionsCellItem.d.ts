import * as React from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { MenuItemProps } from '@mui/material/MenuItem';
export type GridActionsCellItemProps = {
    label: string;
    icon?: React.ReactElement;
} & (({
    showInMenu?: false;
    icon: React.ReactElement;
} & IconButtonProps) | ({
    showInMenu: true;
} & MenuItemProps));
declare const GridActionsCellItem: React.ForwardRefExoticComponent<(Omit<{
    label: string;
    icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
} & {
    showInMenu?: false | undefined;
    icon: React.ReactElement;
} & {
    children?: React.ReactNode;
    classes?: Partial<import("@mui/material/IconButton").IconButtonClasses> | undefined;
    color?: "inherit" | "default" | "warning" | "error" | "success" | "info" | "primary" | "secondary" | undefined;
    disabled?: boolean | undefined;
    disableFocusRipple?: boolean | undefined;
    edge?: false | "end" | "start" | undefined;
    size?: "medium" | "large" | "small" | undefined;
    sx?: import("@mui/system").SxProps<import("@mui/material").Theme> | undefined;
} & Omit<{
    action?: React.Ref<import("@mui/material").ButtonBaseActions> | undefined;
    centerRipple?: boolean | undefined;
    children?: React.ReactNode;
    classes?: Partial<import("@mui/material").ButtonBaseClasses> | undefined;
    disabled?: boolean | undefined;
    disableRipple?: boolean | undefined;
    disableTouchRipple?: boolean | undefined;
    focusRipple?: boolean | undefined;
    focusVisibleClassName?: string | undefined;
    LinkComponent?: React.ElementType<any> | undefined;
    onFocusVisible?: React.FocusEventHandler<any> | undefined;
    sx?: import("@mui/system").SxProps<import("@mui/material").Theme> | undefined;
    tabIndex?: number | undefined;
    TouchRippleProps?: Partial<import("@mui/material/ButtonBase/TouchRipple").TouchRippleProps> | undefined;
    touchRippleRef?: React.Ref<import("@mui/material/ButtonBase/TouchRipple").TouchRippleActions> | undefined;
}, "classes"> & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & {
    ref?: ((instance: HTMLButtonElement | null) => void) | React.RefObject<HTMLButtonElement> | null | undefined;
}, "color" | "size" | "disabled" | "action" | "tabIndex" | "children" | "sx" | keyof import("@mui/material/OverridableComponent").CommonProps | "centerRipple" | "disableRipple" | "disableTouchRipple" | "focusRipple" | "focusVisibleClassName" | "LinkComponent" | "onFocusVisible" | "TouchRippleProps" | "touchRippleRef" | "disableFocusRipple" | "edge">, "ref"> | Omit<{
    label: string;
    icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
} & {
    showInMenu: true;
} & {
    autoFocus?: boolean | undefined;
    classes?: Partial<import("@mui/material/MenuItem").MenuItemClasses> | undefined;
    dense?: boolean | undefined;
    disabled?: boolean | undefined;
    disableGutters?: boolean | undefined;
    divider?: boolean | undefined;
    selected?: boolean | undefined;
    sx?: import("@mui/system").SxProps<import("@mui/material").Theme> | undefined;
} & Omit<{
    action?: React.Ref<import("@mui/material").ButtonBaseActions> | undefined;
    centerRipple?: boolean | undefined;
    children?: React.ReactNode;
    classes?: Partial<import("@mui/material").ButtonBaseClasses> | undefined;
    disabled?: boolean | undefined;
    disableRipple?: boolean | undefined;
    disableTouchRipple?: boolean | undefined;
    focusRipple?: boolean | undefined;
    focusVisibleClassName?: string | undefined;
    LinkComponent?: React.ElementType<any> | undefined;
    onFocusVisible?: React.FocusEventHandler<any> | undefined;
    sx?: import("@mui/system").SxProps<import("@mui/material").Theme> | undefined;
    tabIndex?: number | undefined;
    TouchRippleProps?: Partial<import("@mui/material/ButtonBase/TouchRipple").TouchRippleProps> | undefined;
    touchRippleRef?: React.Ref<import("@mui/material/ButtonBase/TouchRipple").TouchRippleActions> | undefined;
}, "classes"> & import("@mui/material/OverridableComponent").CommonProps & Omit<Omit<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & {
    ref?: ((instance: HTMLLIElement | null) => void) | React.RefObject<HTMLLIElement> | null | undefined;
}, "dense" | "disabled" | "action" | "autoFocus" | "tabIndex" | "selected" | "children" | "sx" | "disableGutters" | "divider" | keyof import("@mui/material/OverridableComponent").CommonProps | "centerRipple" | "disableRipple" | "disableTouchRipple" | "focusRipple" | "focusVisibleClassName" | "LinkComponent" | "onFocusVisible" | "TouchRippleProps" | "touchRippleRef">, "ref">) & React.RefAttributes<HTMLButtonElement>>;
export { GridActionsCellItem };
