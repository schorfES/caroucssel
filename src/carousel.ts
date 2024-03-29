import { Mask } from './features/mask';
import { Proxy } from './proxy';
import { FilterItemFn, ICarousel, IFeature, Index, Pages, ScrollBehavior, ScrollHook, UpdateType } from './types';
import { clearCache, clearFullCache, fromCache, writeCache } from './utils/cache';
import { debounce } from './utils/debounce';


const ID_NAME = (count: number) => `caroucssel-${count}`;
const ID_MATCH = /^caroucssel-[0-9]*$/;

const EVENT_SCROLL = 'scroll';
const EVENT_RESIZE = 'resize';

const CACHE_KEY_ELEMENT = 'element';
const CACHE_KEY_ID = 'id';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_INDEX = 'index';
const CACHE_KEY_ITEMS = 'items';
const CACHE_KEY_PAGES = 'pages';
const CACHE_KEY_PAGE_INDEX = 'page-index';
const CACHE_KEY_MASK = 'mask';
const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_FEATURES = 'feautres';

const VISIBILITY_OFFSET = 0.25;
const INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i;


/**
 * Export the mask because it's used by default inside the carousel.
 */
export { Mask };


/**
 * The available options for the carousel.
 */
export type Options = {
	index?: Index | number;
	features?: IFeature[],
	filterItem?: FilterItemFn;
	onScroll?: ScrollHook;
};


/**
 * The required configuration of the carousel.
 * @internal
 */
export type Configuration = Omit<Required<Options>, 'index'>;


/*
 * Internal counter for created instances. Will be used to create unique IDs.
 */
let __instanceCount = 0;


const DEFAULTS: Configuration = {
	features: [],
	filterItem: () => true,
	onScroll: () => undefined,
};


/**
 * The carousel instance.
 */
export class Carousel implements ICarousel {

	/**
	 * This will be used for testing purposes to reset the instance count which is
	 * used to create unique id's.
	 * @internal
	 */
	public static resetInstanceCount(): void {
		/* This should not be part of the coverage report: test util */
		/* istanbul ignore next */
		if (process.env.NODE_ENV === 'test') {
			__instanceCount = 0;
		}
	}

	/**
	 * Current scroll behavior. Possible values are:
	 * * `'auto'`
	 * * `'smooth'`
	 */
	public behavior: ScrollBehavior = ScrollBehavior.AUTO;

	/**
	 * Creates an instance.
	 * @param el is the dom element to control. This should be a container element
	 * 	that holds child elements that will scroll horizontally.
	 * @param options are the options to configure this instance.
	 */
	constructor(el: Element, options: Options = {}) {
		if (!el || !(el instanceof Element)) {
			throw new Error(`Carousel needs a dom element but "${(typeof el)}" was passed.`);
		}

		writeCache(this, CACHE_KEY_ELEMENT, el);

		// Count all created instances to create unique id, if given dom element
		// has no id-attribute:
		__instanceCount++;
		el.id = el.id || ID_NAME(__instanceCount);
		writeCache(this, CACHE_KEY_ID, el.id);

		// Extend options and defaults into configuration:
		const configuration = { ...DEFAULTS, ...options };
		writeCache(this, CACHE_KEY_CONFIGURATION, configuration);

		// Detect if there is a "Mask" feature passed as option. Then use this one,
		// otherwise add a mandatory instance by default. Also ensure that only one
		// feature of type "Mask" is in the features list.
		let mask: IFeature | null = null;
		let features = [...configuration.features];
		const index = configuration.features.findIndex((feature): boolean => feature instanceof Mask);
		if (index > -1) {
			// Extract first found instance of "Mask":
			[mask] = features.splice(index, 1);
		}
		mask ??= new Mask();
		features = features.filter((feature): boolean => !(feature instanceof Mask));
		features = [mask, ...features];
		writeCache(this, CACHE_KEY_MASK, mask);

		// Features: Initialize all features with a single proxy instance inbetween.
		const proxy = new Proxy(this, features);
		writeCache(this, CACHE_KEY_PROXY, proxy);
		writeCache(this, CACHE_KEY_FEATURES, features);
		features.forEach((feature) => feature.init(proxy));

		// Set initial index and finally set smooth scrolling to enabled:
		switch (true) {
			// When index is a list:
			case Array.isArray(options.index):
				this.index = options.index as Index;
				break;

			// When index is a number, transfrom to list:
			case !isNaN(options.index as number):
				this.index = [options.index as number];
				break;
		}
		this.behavior = ScrollBehavior.SMOOTH;

		// Debounced events:
		//
		// Where do these magic numbers come from? The numbers are the results of
		// testing the behavior in several browsers and are considered at "best fit"
		// without visible side effects to the UI. The value for the "scroll" event
		// correlates with the timing of scroll-behaviour: smooth.
		//
		// We disable @typescript-eslint/unbound-method here because we already bound
		// the functions while creating a debounced version. This would also cause
		// reference errors when tying to access these function references when used
		// with removeEventListeners() (see: destroy())
		//
		/* eslint-disable @typescript-eslint/unbound-method */
		this._onScroll = debounce(this._onScroll.bind(this), 45);
		this._onResize = debounce(this._onResize.bind(this), 25);
		el.addEventListener(EVENT_SCROLL, this._onScroll);
		window.addEventListener(EVENT_RESIZE, this._onResize);
		/* eslint-enable @typescript-eslint/unbound-method */
	}

	/**
	 * Returns the dom element reference of the carousel which was passed into the
	 * constructor.
	 * @public
	 * @return the controlled dom element
	 */
	public get el(): Element {
		return fromCache<Element>(this, CACHE_KEY_ELEMENT) as Element;
	}

	/**
	 * Returns the dom element reference of the mask element that wraps the
	 * carousel element.
	 * @public
	 * @return the mask dom element
	 */
	public get mask(): Element | null {
		const mask = fromCache<Mask>(this, CACHE_KEY_MASK) as Mask;
		return mask.el ?? null;
	}

	/**
	 * Returns the id-attribute value of the carousel.
	 * @public
	 * @return the id of the controlled dom element
	 */
	public get id(): string {
		return fromCache<string>(this, CACHE_KEY_ID) as string;
	}

	/**
	 * Returns the current index of the carousel. The returned index is a list (array)
	 * of indexes that are currently visible (depending on each item width).
	 * @public
	 * @return a list of visible indexes
	 */
	public get index(): Index {
		return fromCache(this, CACHE_KEY_INDEX, (): Index => {
			const { el, items } = this;
			const { length } = items;
			const { clientWidth } = el;
			const outerLeft = el.getBoundingClientRect().left;

			const index: number[] = [];
			let at = 0;

			for (;at < length; at++) {
				const item = items[at];
				const rect = item.getBoundingClientRect();
				const { width } = rect;
				let { left } = rect;
				left = left - outerLeft;

				if (left + width * VISIBILITY_OFFSET >= 0 &&
					left + width * (1 - VISIBILITY_OFFSET) <= clientWidth) {
					index.push(at);
				}
			}

			if (index.length === 0) {
				// If no index found, we return a [0] as default. This possibly happens
				// when the carousel is not attached to the DOM or is visually hidden (display: none).
				return [0];
			}

			return index as Index;
		});
	}

	/**
	 * Sets the current index of the carousel. To set an index you need to pass an
	 * array with at least one element. When passing more than one, the rest will
	 * be ignored.
	 * @public
	 * @param values are the upcoming indexes
	 */
	public set index(values: Index) {
		const { behavior, el, items } = this;
		const { length } = items;

		if (!Array.isArray(values) || !values.length) {
			return;
		}

		let value = values[0] || 0;
		value = Math.max(Math.min(value, length - 1), 0);

		const { scrollLeft } = el;
		const from = { left: scrollLeft };
		const to = { left: items[value].offsetLeft };

		// If the target item is the first visible element in the list, ignore
		// the possible offset to the left and scroll to the beginning of the list:
		if (value === this.pages[0][0]) {
			to.left = 0;
		}

		if (from.left === to.left) {
			return;
		}

		clearCache(this, CACHE_KEY_INDEX);

		el.scrollTo({ ...to, behavior });
	}

	/**
	 * Returns an array of all child dom elements of the carousel.
	 * @public
	 * @return a list of elements (child elements of the root element)
	 */
	public get items(): HTMLElement[] {
		return fromCache(this, CACHE_KEY_ITEMS, (): HTMLElement[] => {
			const { filterItem } = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
			const { el } = this;
			const children = Array.from(el.children) as HTMLElement[];

			return children
				.filter((item) => !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden)
				.filter(filterItem);
		});
	}

	/**
	 * Returns an array of all pages. Each page is a group of indexes that matches
	 * a page.
	 * @public
	 * @return the list of pages and indexes inside each page
	 */
	public get pages(): Pages {
		return fromCache(this, CACHE_KEY_PAGES, (): Pages => {
			const { el, items } = this;
			const { clientWidth: viewport } = el;

			if (viewport === 0) {
				// if the width of the carousel element is zero, we can not calculate
				// the pages properly and the carousel seems to be not visible. If
				// this is the case, we assume that each item is placed on a
				// separate page.
				return items.map((item, index) => [index] as Index) as Pages;
			}

			type Dataset = {
				item: HTMLElement;
				left: number;
				width: number;
				index: number;
			};

			let pages: Dataset[][] = [[]];

			items
				.map((item, index): Dataset => {
					// Create a re-usable dataset for each item:
					const { offsetLeft: left, clientWidth: width } = item;
					return { left, width, item, index };
				})
				.sort((a, b) => {
					// Create ordered list of items based on their visual ordering.
					// This may differ from the DOM ordering unsing css properties
					// like `order` in  flexbox or grid:
					return a.left - b.left;
				})
				.forEach((item) => {
					// Calculate pages / page indexes for each item:
					//
					// The idea behind the calculation of the pages is to separate
					// the items by fitting them into the viewport of the carousel.
					// To behave correctly, we cannot divide the total length of the
					// carousel by the viewport to get the page indexes (naive approach).
					// However, since there may be items that are partially visible
					// on a page, but mathematically create a new page. The calculation
					// must start from this item again. This means that always the
					// first item on a page sets the basis for the calculation of
					// the following item and its belonging to the current or next
					// page:
					const { left, width } = item;

					const prevPage = pages[pages.length - 1];
					const firstItem = prevPage[0];
					let start = firstItem?.left || 0;

					// This is required for the first page. The first page always
					// needs to start from the left=0. Any offset from the
					// left of the first visual item needs to be ignored, otherwise
					// the calculation of visual pages is incorrect:
					if (prevPage === pages[0]) {
						start = 0;
					}

					// At least 75% of the items needs to be in the page. Calculate
					// the amount of new pages to add. If value is 0, the current
					// item fits into the previous page:
					let add = Math.floor(((left - start) + width * (1 - VISIBILITY_OFFSET)) / viewport);

					while(add > 0) {
						pages.push([]);
						add--;
					}

					const page = pages[pages.length - 1];
					page.push(item);
				});

			// Remove empty pages: this might happen if items are wider than the
			// carousel viewport:
			pages = pages.filter((page) => page.length !== 0);

			// Restructure pages to only contain the index of each item:
			return pages.map((page) => page.map(({ index }) => index) as Index) as Pages;
		});
	}

	/**
	 * Returns the index of the current page.
	 * @public
	 * @return the index of the current page
	 */
	public get pageIndex(): number {
		return fromCache(this, CACHE_KEY_PAGE_INDEX, (): number => {
			const { el, items, index, pages } = this;
			const outerLeft = el.getBoundingClientRect().left;
			const { clientWidth } = el;

			let visibles: number[] = index.reduce<number []>((acc, at) => {
				if (!items[at]) {
					return acc;
				}

				let { left, right } = items[at].getBoundingClientRect();
				// "getBoundingClientRect()" can return float numbers which
				// lead to an unwanted behavior when in the calculation with
				// "clientWidth" (not using floats). We use round here to
				// normalize those values...
				left = Math.round(left - outerLeft);
				right = Math.round(right - outerLeft);

				// Remove items that partially hidden to the left or right:
				if (left < 0 || clientWidth < right) {
					return acc;
				}

				return acc.concat([at]);
			}, []);

			// There might be no possible candidates. This is the case when items
			// are wider than the element viewport. In this case we take the first
			// item which is currently visible in general (might be the only one):
			if (visibles.length === 0) {
				visibles = [index[0]];
			}

			// Search for the visible item that is most aligned to the right. The
			// found item marks the current page...
			const at = visibles.sort((a, b) => {
				const rightA = items[a].getBoundingClientRect().right;
				const rightB = items[b].getBoundingClientRect().right;
				return rightB - rightA;
			})[0];

			// Find the page index where the current item index is located...
			return pages.findIndex((page) => page.includes(at));
		});
	}

	/**
	 * This completely deconstructs the carousel and returns the dom to its
	 * initial state.
	 * @public
	 */
	public destroy(): void {
		const { el } = this;

		// Remove created id if it was created by carousel:
		ID_MATCH.test(el.id) && el.removeAttribute('id');

		// Destroy attached features:
		const features = fromCache<IFeature[]>(this, CACHE_KEY_FEATURES) as IFeature[];
		features.forEach((feature) => feature.destroy());

		// Remove events:
		//
		// We need to work the the function reference. Using .bind() would create a
		// new referenced instance of the callback function. We already created a
		// bound version of these function within the constructor.
		//
		/* eslint-disable @typescript-eslint/unbound-method */
		el.removeEventListener(EVENT_SCROLL, this._onScroll);
		window.removeEventListener(EVENT_RESIZE, this._onResize);
		/* eslint-enable @typescript-eslint/unbound-method */

		// Clear cache:
		clearFullCache(this);
	}

	/**
	 * Enforces an update of all enabled components of the carousel. This is, for
	 * example, useful when changing the number of items inside the carousel. This
	 * also forwards an update call to all attached features.
	 * @public
	 */
	public update(): void {
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_ITEMS);
		clearCache(this, CACHE_KEY_PAGES);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		const features = fromCache<IFeature[]>(this, CACHE_KEY_FEATURES) as IFeature[];
		features.forEach((feature) => feature.update({ type: UpdateType.FORCED }));
	}

	protected _onScroll(event: Event): void {
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		const features = fromCache<IFeature[]>(this, CACHE_KEY_FEATURES) as IFeature[];
		features.forEach((feature) => feature.update({ type: UpdateType.SCROLL }));

		const { index } = this;
		const configuration = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		configuration.onScroll<Carousel>({ index, type: EVENT_SCROLL, target: this, originalEvent: event });
	}

	protected _onResize(): void {
		clearCache(this, CACHE_KEY_PAGES);
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		const features = fromCache<IFeature[]>(this, CACHE_KEY_FEATURES) as IFeature[];
		features.forEach((feature) => feature.update({ type: UpdateType.RESIZE }));
	}

}
