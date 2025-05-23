import * as React from 'react';
interface GridBodyProps {
    children?: React.ReactNode;
    ColumnHeadersProps?: Record<string, any>;
    VirtualScrollerComponent: React.JSXElementConstructor<React.HTMLAttributes<HTMLDivElement> & {
        ref: React.Ref<HTMLDivElement>;
        disableVirtualization: boolean;
    }>;
}
declare function GridBody(props: GridBodyProps): JSX.Element;
declare namespace GridBody {
    var propTypes: any;
}
export { GridBody };
