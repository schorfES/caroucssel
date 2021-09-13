import { Index, Options, Pages } from './types';
export * from './types';
export declare class Carousel {
    static resetInstanceCount(): void;
    protected _el: Element;
    protected _id: string;
    protected _options: Options;
    protected _mask: HTMLDivElement | null;
    protected _isSmooth: boolean;
    protected _scrollbarHeight: number | undefined;
    protected _previous: HTMLButtonElement | null;
    protected _next: HTMLButtonElement | null;
    protected _pagination: HTMLElement | null;
    protected _paginationButtons: HTMLButtonElement[] | null;
    constructor(el: Element, options?: Partial<Options>);
    get el(): Element;
    get id(): string;
    get index(): Index;
    set index(values: Index);
    get items(): HTMLElement[];
    get pages(): Pages;
    get pageIndex(): number;
    destroy(): void;
    update(): void;
    protected _updateScrollbars(): void;
    protected _removeScrollbars(): void;
    protected _addButtons(): void;
    protected _updateButtons(): void;
    protected _removeButtons(): void;
    protected _addPagination(): void;
    protected _updatePagination(): void;
    protected _removePagination(): void;
    protected _onScroll(event: Event): void;
    protected _onResize(): void;
}
//# sourceMappingURL=caroucssel.d.ts.map