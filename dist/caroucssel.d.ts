import { Configuration, Index, Options, Pages } from './types';
export * from './types';
/**
 * The carousel javascript instance.
 */
export declare class Carousel {
    /**
     * This can be used for testing purposes to reset the instance count which is
     * used to create unique id's.
     * @internal
     */
    static resetInstanceCount(): void;
    protected _el: Element;
    protected _id: string;
    protected _conf: Configuration;
    protected _mask: HTMLDivElement | null;
    protected _isSmooth: boolean;
    protected _previous: HTMLButtonElement | null;
    protected _next: HTMLButtonElement | null;
    protected _pagination: HTMLElement | null;
    protected _paginationButtons: HTMLButtonElement[] | null;
    /**
     * Creates an instance.
     * @param el is the dom element to control. This should be a container element
     * 	that holds child elements that will scroll horizontally.
     * @param options are the options to configure this instance.
     */
    constructor(el: Element, options?: Options);
    /**
     * Returns the dom element reference of the carousel which was passed into the
     * constructor.
     * @public
     * @return the controlled dom element
     */
    get el(): Element;
    /**
     * Returns the id-attribute value of the carousel.
     * @public
     * @return the id of the controlled dom element
     */
    get id(): string;
    /**
     * Returns the current index of the carousel. The returned index is a list (array)
     * of indexes that are currently visible (depending on each item width).
     * @public
     * @return a list of visible indexes
     */
    get index(): Index;
    /**
     * Sets the current index of the carousel. To set an index you need to pass an
     * array with at least one element. When passing more than one, the rest will
     * be ignored.
     * @public
     * @param values are the upcoming indexes
     */
    set index(values: Index);
    /**
     * Returns an array of all child dom elements of the carousel.
     * @public
     * @return a list of elements (child elements of the root element)
     */
    get items(): HTMLElement[];
    /**
     * Returns an array of all pages. Each page is a group of indexes that matches
     * a page.
     * @public
     * @return the list of pages and indexes inside each page
     */
    get pages(): Pages;
    /**
     * Returns the index of the current page.
     * @public
     * @return the index of the current page
     */
    get pageIndex(): number;
    /**
     * This completely deconstructs the carousel and returns the dom to its
     * initial state.
     * @public
     */
    destroy(): void;
    /**
     * Enforces an update of all enabled components of the carousel. This is, for
     * example, useful when changing the number of items inside the carousel.
     * @public
     */
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
