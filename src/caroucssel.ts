import { ButtonOptions, ButtonParams, Configuration, Index, Options, Pages, PaginationParams } from './types';
import { clearCache, clearFullCache, fromCache, writeCache } from './utils/cache';
import { debounce } from './utils/debounce';
import { render } from './utils/render';
import { Scrollbar } from './utils/scrollbar';


// Export all types
// (is required to expose all types in dist/caroucssel.d.ts)
export * from './types';


const ID_NAME = (count: number) => `caroucssel-${count}`;
const ID_MATCH = /^caroucssel-[0-9]*$/;

const CACHE_KEY_INDEX = 'index';
const CACHE_KEY_ITEMS = 'items';
const CACHE_KEY_PAGES = 'pages';
const CACHE_KEY_PAGE_INDEX = 'page-index';
const CACHE_KEY_SCROLLBAR = 'scrollbar';

const VISIBILITY_OFFSET = 0.25;

const INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i;

const EVENT_SCROLL = 'scroll';
const EVENT_RESIZE = 'resize';

const DEFAULTS_BUTTON_PREVIOUS: Required<ButtonOptions> = {
	className: 'is-previous',
	label: 'Previous',
	title: 'Go to previous',
};

const DEFAULTS_BUTTON_NEXT: Required<ButtonOptions> = {
	className: 'is-next',
	label: 'Next',
	title: 'Go to next',
};

const DEFAULTS: Configuration = {
	// Buttons:
	hasButtons: false,
	buttonClassName: 'button',
	buttonTemplate: ({ className, controls, label, title }: ButtonParams) => `
		<button type="button" class="${className}" aria-label="${label}" title="${title}" aria-controls="${controls}">
			<span>${label}</span>
		</button>
	`,
	buttonPrevious: DEFAULTS_BUTTON_PREVIOUS,
	buttonNext: DEFAULTS_BUTTON_NEXT,

	// Pagination:
	hasPagination: false,
	paginationClassName: 'pagination',
	paginationLabel: ({ index }) => `${index + 1}`,
	paginationTitle: ({ index }) => `Go to ${index + 1}. page`,
	paginationTemplate: ({ className, controls, pages, label, title }: PaginationParams) => `
		<ul class="${className}">
			${pages.map((page, index) => {
				const data = { index, page, pages };
				const labelStr = label(data);
				const titleStr = title(data);
				return `<li>
					<button type="button" aria-controls="${controls}" aria-label="${titleStr}" title="${titleStr}">
						<span>${labelStr}</span>
					</button>
				</li>`;
			}).join('')}
		</ul>
	`,

	// Scrollbars, set to true when use default scrolling behaviour
	hasScrollbars: false,
	scrollbarsMaskClassName: 'caroucssel-mask',

	// filter
	filterItem: () => true,

	// Hooks:
	onScroll: () => undefined,
};

/*
 * Internal counter for created instances. Will be used to create unique IDs.
 */
let __instanceCount = 0;

/*
 * Singleton of scrollbar util. Is shared across all instances of carousel to
 * reduce redundant calculations.
 */
let __scrollbar: Scrollbar;

/**
 * The carousel javascript instance.
 */
export class Carousel {

	public static resetInstanceCount(): void {
		// This can be used for testing purposes to reset the instance count which is
		// used to create unique id's.
		if (process.env.NODE_ENV === 'test') {
			__instanceCount = 0;
		}
	}

	protected _el: Element;

	protected _id: string;

	protected _conf: Configuration;

	protected _mask: HTMLDivElement | null = null;

	protected _isSmooth = false;

	protected _previous: HTMLButtonElement | null = null;

	protected _next: HTMLButtonElement | null = null;

	protected _pagination: HTMLElement | null = null;

	protected _paginationButtons: HTMLButtonElement[] | null = null;

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

		this._el = el;

		// Create a singleton instance of scrollbar for all carousel instances:
		__scrollbar = __scrollbar || new Scrollbar();

		// Count all created instances to create unique id, if given dom element
		// has no id-attribute:
		__instanceCount++;
		el.id = el.id || ID_NAME(__instanceCount);
		this._id = el.id;

		// Mask will be rendered after scrollbar detection.
		this._mask = null;

		// extend options and defaults:
		const opts = { ...DEFAULTS, ...options };
		this._conf = opts;

		// Render:
		this._addButtons();
		this._addPagination();
		this._updateScrollbars();

		// Set initial index and set smooth scrolling:
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
		this._isSmooth = true;

		// Events:
		//
		// We disable @typescript-eslint/unbound-method here because we already bound
		// the functions while creating a debounced version. This would also cause
		// reference errors when tying to access these function references when used
		// with removeEventListeners() (see: destroy())
		//
		/* eslint-disable @typescript-eslint/unbound-method */
		this._onScroll = debounce(this._onScroll.bind(this), 25);
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
	get el(): Element {
		return this._el;
	}

	/**
	 * Returns the id-attribute value of the carousel.
	 * @public
	 * @return the id of the controlled dom element
	 */
	get id(): string {
		return this._id;
	}

	/**
	 * Returns the current index of the carousel. The returned index is a list (array)
	 * of indexes that are currently visible (depending on each item width).
	 * @public
	 * @return a list of visible indexes
	 */
	get index(): Index {
		return fromCache(this, CACHE_KEY_INDEX, () => {
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
	set index(values: Index) {
		const { el, items } = this;
		const { length } = items;

		if (!Array.isArray(values) || !values.length) {
			return;
		}

		if (length === 0) {
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

		const behavior = this._isSmooth ? 'smooth' : 'auto';
		el.scrollTo({ ...to, behavior });
	}

	/**
	 * Returns an array of all child dom elements of the carousel.
	 * @public
	 * @return a list of elements (child elements of the root element)
	 */
	get items(): HTMLElement[] {
		return fromCache(this, CACHE_KEY_ITEMS, () => {
			const { el, _conf: { filterItem } } = this;
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
	get pages(): Pages {
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
	get pageIndex(): number {
		return fromCache(this, CACHE_KEY_PAGE_INDEX, () => {
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
	destroy(): void {
		const { el } = this;

		// Remove created id if it was created by carousel:
		ID_MATCH.test(el.id) && el.removeAttribute('id');

		// Remove buttons:
		this._removeButtons();

		// Remove pagination:
		this._removePagination();

		// Remove scrollbars:
		this._removeScrollbars();

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
	 * example, useful when changing the number of items inside the carousel.
	 * @public
	 */
	update(): void {
		clearFullCache(this);

		this._updateButtons();
		this._updatePagination();
		this._updateScrollbars();
	}

	protected _updateScrollbars(): void {
		const { el , _conf: _options } = this;
		const { hasScrollbars, scrollbarsMaskClassName } = _options;
		if (hasScrollbars) {
			return;
		}

		let { height } = __scrollbar.dimensions;

		if (el.scrollWidth <= el.clientWidth) {
			// If the contents are not scrollable because their width are less
			// than the container, there will be no visible scrollbar. In this
			// case, the scrollbar height is 0:
			height = 0;
		}

		this._mask = this._mask || (() => {
			const mask = document.createElement('div');
			mask.className = scrollbarsMaskClassName;
			mask.style.overflow = 'hidden';
			mask.style.height = '100%';
			el.parentNode?.insertBefore(mask, this.el);
			mask.appendChild(el);
			return mask;
		})();

		const cachedHeight = fromCache<number | undefined>(this, CACHE_KEY_SCROLLBAR, () => undefined);
		if (height === cachedHeight) {
			return;
		}

		writeCache(this, CACHE_KEY_SCROLLBAR, height);

		const element = el as HTMLElement | SVGElement;
		element.style.height = `calc(100% + ${height}px)`;
		element.style.marginBottom = `${height * -1}px`;
	}

	protected _removeScrollbars(): void {
		const { _mask, el } = this;
		if (!_mask) {
			return;
		}

		_mask.parentNode?.insertBefore(el, _mask);
		_mask.parentNode?.removeChild(_mask);
		el.removeAttribute('style');

		this._mask = null;
	}

	protected _addButtons(): void {
		const { el, id, _conf: _options } = this;
		if (!_options.hasButtons) {
			return;
		}

		const { buttonTemplate, buttonClassName, buttonPrevious, buttonNext } = _options;
		const controls = id;
		// Create button elements:
		const [previous, next] = [
			{ ...DEFAULTS_BUTTON_PREVIOUS, ...buttonPrevious, controls, className: [buttonClassName, buttonPrevious.className].join(' ') },
			{ ...DEFAULTS_BUTTON_NEXT, ...buttonNext, controls, className: [buttonClassName, buttonNext.className].join(' ') },
		].map((params) => render<HTMLButtonElement, ButtonParams>(buttonTemplate, params))


		if (previous) {
			const onPrevious = () => {
				const { pages, pageIndex } = this;
				const index = pages[pageIndex - 1] || pages[0];
				this.index = index;
			};

			previous.onclick = onPrevious;
			el.parentNode?.appendChild(previous);
		}
		this._previous = previous;

		if (next) {
			const onNext = () => {
				const { pages, pageIndex } = this;
				const index = pages[pageIndex + 1] || pages[pages.length - 1];
				this.index = index;
			};

			next.onclick = onNext;
			el.parentNode?.appendChild(next);
		}
		this._next = next;

		this._updateButtons();
	}

	protected _updateButtons(): void {
		const { _conf: _options } = this;
		if (!_options.hasButtons) {
			return;
		}

		const { pages, pageIndex, _previous, _next } = this;

		if (_previous) {
			const firstPage = pages[pageIndex - 1];
			const isFirstPage = firstPage === undefined;
			_previous.disabled = isFirstPage;
		}

		if (_next) {
			const lastPage = pages[pageIndex + 1];
			const isLastPage = lastPage === undefined;
			_next.disabled = isLastPage;
		}
	}

	protected _removeButtons(): void {
		const { _previous, _next } = this;
		[_previous, _next].forEach((button) => {
			if (!button) {
				return;
			}
			button.onclick = null;
			button.parentNode?.removeChild(button);
		});
	}

	protected _addPagination(): void {
		const { _conf: _options } = this;
		if (!_options.hasPagination) {
			return;
		}

		const { _mask, el, id, pages } = this;
		if (pages.length < 2) {
			return;
		}

		const { paginationTemplate, paginationClassName, paginationLabel, paginationTitle } = _options;
		const pagination = render(paginationTemplate, {
			pages,
			controls: id,
			className: paginationClassName,
			label: paginationLabel,
			title: paginationTitle,
		});

		if (!pagination) {
			return;
		}

		// @TODO: Add template for buttons:
		const buttons = Array.from(pagination.querySelectorAll<HTMLButtonElement>('button'))
			.map((button, index) => {
				button.onclick = () => this.index = pages[index];
				return button;
			});

		const target = (_mask || el).parentNode;
		target?.appendChild(pagination);
		this._pagination = pagination;
		this._paginationButtons = buttons;

		this._updatePagination();
	}

	protected _updatePagination(): void {
		const { _conf: _options } = this;
		if (!_options.hasPagination) {
			return;
		}

		const { pageIndex, _paginationButtons } = this;
		if (!_paginationButtons) {
			return;
		}

		_paginationButtons.forEach((button, at) => button.disabled = (at === pageIndex));
	}

	protected _removePagination(): void {
		const { _pagination, _paginationButtons } = this;
		(_paginationButtons || []).forEach((button) => {
			button.onclick = null;
			button.parentNode?.removeChild(button);
		});
		this._paginationButtons = null;

		_pagination && _pagination.parentNode?.removeChild(_pagination);
		this._pagination = null;
	}

	protected _onScroll(event: Event): void {
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		this._updateButtons();
		this._updatePagination();

		const { index, _conf: { onScroll } } = this;
		onScroll && onScroll<Carousel>({ index, type: EVENT_SCROLL, target: this, originalEvent: event });
	}

	protected _onResize(): void {
		clearCache(this, CACHE_KEY_PAGES);
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		this._updateButtons();
		this._removePagination();
		this._addPagination();
		this._updateScrollbars();
	}

}
