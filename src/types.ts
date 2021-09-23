/**
 * The representation of all visual items in a carousel. The is at least one
 * item that is always visible. In cases (e.g. display: none) where visibility
 * is uncalculatable this is `[0]`.
 *
 * Each index represents the index of the child elements ({@link Carousel.items | see items})
 * inside the dom. The index of these elements inside the dom may not be
 * equivalent to the visual indexes (e.g. css flexbox-ordering or css grids).
 */
export type Index = [number, ...number[]];


/**
 * The representation of item indexes grouped into pages. These pages are the
 * available entry points for control features like buttons and pagination.
 *
 * The indexes inside each grouped page is based on the visual order of the
 * child elements ({@link Carousel.items | see items}).
 *
 * For example:
 * ```
 *   <div class="carousel">
 *     <div class="item" style="width: 100%; order: 3">Item 1</div>
 *     <div class="item" style="width: 50%; order: 2">Item 2</div>
 *     <div class="item" style="width: 50%; order: 1">Item 3</div>
 *   </div>
 * ```
 *
 * The pages representation would look like: `[[2], [1, 0]]` (see ordering and width)
 */
export type Pages = [Index, ...Index[]];


/**
 * The minimal represenation of the carousel control properties.
 * @internal
 */
interface ICore {
	get id(): string;
	get el(): Element;
	get mask(): Element | null;
	get index(): Index;
	set index(value: Index);
	get items(): HTMLElement[];
	get pages(): Pages;
	get pageIndex(): number;
}


/**
 * The carousel interface.
 */
export interface ICarousel extends ICore {
	behavior: ScrollBehavior;
	destroy(): void;
	update(): void;
}


/**
 * The feature proxy interface.
 */
export interface IProxy extends ICore {
	update(sender: IFeature): void;
}


/**
 * The feature interface.
 */
export interface IFeature {

	/**
	 * Each feature needs to return a constant name that identifies the plugin.
	 * Build in features are using the prefix `buildin:`.
	 */
	get name(): string;

	/**
	 * Initializes this feature. This function will be called by the carousel
	 * instance and should not be called manually.
	 * @param proxy the proxy instance between carousel and feature
	 */
	init(proxy: IProxy): void;

	/**
	 * Destroys this feature. This function will be called by the carousel instance
	 * and should not be called manually.
	 */
	destroy(): void;

	/**
	 * This triggers the feature to update its inner state. This function will be
	 * called by the carousel instance and should not be called manually. The
	 * carousel passes a data object that includes the update reason. This can be
	 * used to selectively/partially update sections of the feature.
	 * @param data dataset that triggered the update
	 * @param data.reason is the update reason (why this was triggered)
	 */
	update(data :UpdateEvent): void;
}


/**
 * The event that is passed into each feature.
 */
export type UpdateEvent = {

	/**
	 * The reason why this update was triggered.
	 */
	type: UpdateType;

};


/**
 * Possible types of an update.
 */
export enum UpdateType {
	SCROLL = 'scroll',
	RESIZE = 'resize',
	FORCED = 'forced',
	FEATURE = 'feature',
}


/**
 * The browsers scroll behavior.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo | scrollTo on MDN}
 */
export enum ScrollBehavior {
	AUTO = 'auto',
	SMOOTH = 'smooth',
}


/**
 * A function that can be used as callback on scroll events.
 */
export type ScrollHook = <T>(event: {
	index: Index;
	type: 'scroll';
	target: T;
	originalEvent: Event;
}) => void;


/**
 * A filter function to filter specific child elements ({@link Carousel.items | see items})
 * of the carousel.
 */
export type FilterItemFn =
	((item: HTMLElement) => boolean) |
	((item: HTMLElement, index: number) => boolean) |
	((item: HTMLElement, index: number, array: HTMLElement[]) => boolean);
