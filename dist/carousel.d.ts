import { Mask } from './features/mask';
import { FilterItemFn, ICarousel, IFeature, Index, Pages, ScrollBehavior, ScrollHook } from './types';
/**
 * Export the mask because it's used by default inside the carousel.
 */
export { Mask };
/**
 * The available options for the carousel.
 */
export type Options = {
    index?: Index | number;
    features?: IFeature[];
    filterItem?: FilterItemFn;
    onScroll?: ScrollHook;
};
/**
 * The required configuration of the carousel.
 * @internal
 */
export type Configuration = Omit<Required<Options>, 'index'>;
/**
 * The carousel instance.
 */
export declare class Carousel implements ICarousel {
    /**
     * This will be used for testing purposes to reset the instance count which is
     * used to create unique id's.
     * @internal
     */
    static resetInstanceCount(): void;
    /**
     * Current scroll behavior. Possible values are:
     * * `'auto'`
     * * `'smooth'`
     */
    behavior: ScrollBehavior;
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
     * Returns the dom element reference of the mask element that wraps the
     * carousel element.
     * @public
     * @return the mask dom element
     */
    get mask(): Element | null;
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
     * example, useful when changing the number of items inside the carousel. This
     * also forwards an update call to all attached features.
     * @public
     */
    update(): void;
    protected _onScroll(event: Event): void;
    protected _onResize(): void;
}
