export declare type Index = [number, ...number[]];
export declare type Pages = [Index, ...Index[]];
export declare type ButtonParams = {
    controls: string;
    className: string;
    label: string;
    title: string;
};
export declare type ButtonTemplate = (params: ButtonParams) => string;
export declare type ButtonOptions = {
    className?: string;
    label?: string;
    title?: string;
};
export declare type PaginationTextParams = {
    index: number;
    page: number[];
    pages: number[][];
};
export declare type PaginationText = (params: PaginationTextParams) => string;
export declare type PaginationParams = {
    controls: string;
    className: string;
    label: PaginationText;
    title: PaginationText;
    pages: number[][];
};
export declare type PaginationTemplate = (params: PaginationParams) => string;
export declare type PaginationLabelTemplate = PaginationText;
export declare type PaginationTitleTemplate = PaginationText;
export declare type ScrollHook = <T>(event: {
    index: number[];
    type: 'scroll';
    target: T;
    originalEvent: Event;
}) => void;
export declare type FilterItemFn = ((item: HTMLElement) => boolean) | ((item: HTMLElement, index: number) => boolean) | ((item: HTMLElement, index: number, array: HTMLElement[]) => boolean);
export declare type Options = {
    index?: Index | number;
    hasButtons: boolean;
    buttonClassName: string;
    buttonTemplate: ButtonTemplate;
    buttonPrevious: ButtonOptions;
    buttonNext: ButtonOptions;
    hasPagination: boolean;
    paginationClassName: string;
    paginationTemplate: PaginationTemplate;
    paginationLabel: PaginationLabelTemplate;
    paginationTitle: PaginationTitleTemplate;
    hasScrollbars: boolean;
    scrollbarsMaskClassName: string;
    filterItem: FilterItemFn;
    onScroll: ScrollHook;
};
//# sourceMappingURL=index.d.ts.map