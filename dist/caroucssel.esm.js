const NAMESPACE = '__cache__';

const fromCache = (instance, key, calculate) => {
	instance[NAMESPACE] = instance[NAMESPACE] || {};
	if (key in instance[NAMESPACE]) {
		return instance[NAMESPACE][key];
	}

	const value = calculate();
	instance[NAMESPACE][key] = value;
	return value;
};

const clearCache = (instance, key) => {
	const cache = instance[NAMESPACE];
	if (!cache) {
		return;
	}

	delete(cache[key]);
};

const clearFullCache = (instance) => delete(instance[NAMESPACE]);

class Scrollbar {

	constructor() {
		window.addEventListener('resize', () => {
			clearCache(this, 'dimensions');
		});
	}

	// Inspired by https://gist.github.com/kflorence/3086552
	get dimensions() {
		return fromCache(this, 'dimensions', () => {
			const
				inner = document.createElement('div'),
				outer = document.createElement('div')
			;
			let
				// width, w1, w2,
				height, h1, h2
			;

			document.body.appendChild(outer);
			outer.style.position = 'absolute';
			outer.style.top = '0px';
			outer.style.left = '0px';
			outer.style.visibility = 'hidden';
			outer.appendChild(inner);

			// Disabled, not needed for current feature set.
			//
			// Calculate width:
			// inner.style.width = '100%';
			// inner.style.height = '200px';
			// outer.style.width = '200px';
			// outer.style.height = '150px';
			// outer.style.overflow = 'hidden';
			// w1 = inner.offsetWidth;
			// outer.style.overflow = 'scroll';
			// w2 = inner.offsetWidth;
			// w2 = (w1 === w2) ? outer.clientWidth : w2;
			// width = w1 - w2;

			// Calculate height:
			inner.style.width = '200px';
			inner.style.height = '100%';
			outer.style.width = '150px';
			outer.style.height = '200px';
			outer.style.overflow = 'hidden';
			h1 = inner.offsetHeight;
			outer.style.overflow = 'scroll';
			h2 = inner.offsetHeight;
			h2 = (h1 === h2) ? outer.clientHeight : h2;
			height = h1 - h2;

			document.body.removeChild(outer);

			return {height};
		});
	}

}

// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
function debounce(func, delay) {
	let timeout;
	return function(...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), delay);
	};
}

function __render(template, data) {
	const el = document.createElement('div');
	el.innerHTML = template(data);

	const ref = el.firstChild;
	if (!(ref instanceof HTMLElement)) {
		return null;
	}

	return ref;
}


function __templateButton({className, controls, label, title}) {
	return `<button type="button" class="${className}" aria-label="${label}" title="${title}" aria-controls="${controls}">
		<span>${label}</span>
	</button>`;
}


function __templatePagination({className, controls, pages, label, title}) {
	return `<ul class="${className}">
		${pages.map((page, index) => {
			const data = {index, page, pages};
			const labelStr = label(data);
			const titleStr = title(data);
			return `<li>
				<button type="button" aria-controls="${controls}" aria-label="${titleStr}" title="${titleStr}">
					<span>${labelStr}</span>
				</button>
			</li>`;
		}).join('')}
	</ul>`;
}


const
	ID_NAME = (count) => `caroucssel-${count}`,
	ID_MATCH = /^caroucssel-[0-9]*$/,

	CACHE_KEY_INDEX = 'index',
	CACHE_KEY_ITEMS = 'items',
	CACHE_KEY_PAGES = 'pages',
	CACHE_KEY_PAGE_INDEX = 'page-index',

	VISIBILITY_OFFSET = 0.25,

	INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i,

	EVENT_SCROLL = 'scroll',
	EVENT_RESIZE = 'resize',

	DEFAULTS = {
		index: undefined,

		// Buttons:
		hasButtons: false,
		buttonClassName: 'button',
		buttonTemplate: __templateButton,
		buttonPrevious: null,
		buttonNext: null,

		// Pagination:
		hasPagination: false,
		paginationClassName: 'pagination',
		paginationLabel: ({index}) => `${index + 1}`,
		paginationTitle: ({index}) => `Go to ${index + 1}. page`,
		paginationTemplate: __templatePagination,

		// Scrollbars, set to true when use default scrolling behaviour
		hasScrollbars: false,
		scrollbarsMaskClassName: 'caroucssel-mask',

		// filter
		filterItem: () => true,

		// Hooks:
		onScroll: null
	},
	DEFAULTS_BUTTON_PREVIOUS = {
		className: 'is-previous',
		label: 'Previous',
		title: 'Go to previous'
	},
	DEFAULTS_BUTTON_NEXT = {
		className: 'is-next',
		label: 'Next',
		title: 'Go to next'
	}
;


let
	instanceCount = 0,
	scrollbar = null
;


class Carousel {

	constructor(el, options = {}) {
		if (!el || !(el instanceof HTMLElement)) {
			throw new Error(`Carousel needs a dom element but "${(typeof el)}" was passed.`);
		}

		this._el = el;

		// Create a singleton instance of scrollbar for all carousel instances:
		scrollbar = scrollbar || new Scrollbar();

		// Count all created instances to create unique id, if given dom element
		// has no id-attribute:
		instanceCount++;
		el.id = el.id || ID_NAME(instanceCount);
		this._id = el.id;

		// "deep" extend options and defaults:
		const opts = { ...DEFAULTS, ...options };
		opts.buttonPrevious = {...DEFAULTS_BUTTON_PREVIOUS, ...options.buttonPrevious};
		opts.buttonNext = {...DEFAULTS_BUTTON_NEXT, ...options.buttonNext};
		this._options = opts;

		// Render:
		this._addButtons();
		this._addPagination();
		this._updateScrollbars();

		// Set initial index and set smooth scrolling:
		this._isSmooth = false;
		this.index = options.index;
		this._isSmooth = true;

		// Events:
		this._onScroll = debounce(this._onScroll.bind(this), 25);
		this._onResize = debounce(this._onResize.bind(this), 25);
		el.addEventListener(EVENT_SCROLL, this._onScroll);
		window.addEventListener(EVENT_RESIZE, this._onResize);
	}

	get el() {
		return this._el;
	}

	get id() {
		return this._id;
	}

	get index() {
		return fromCache(this, CACHE_KEY_INDEX, () => {
			const {el, items} = this;
			const {length} = items;
			const {clientWidth} = el;
			const outerLeft = el.getBoundingClientRect().left;

			let values = [];
			let index = 0;

			for (;index < length; index++) {
				const item = items[index];
				let {left, width} = item.getBoundingClientRect();
				left = left - outerLeft;

				if (left + width * VISIBILITY_OFFSET >= 0 &&
					left + width * (1 - VISIBILITY_OFFSET) <= clientWidth) {
					values.push(index);
				}
			}

			if (values.length === 0) {
				return [0];
			}

			return values;
		});
	}

	set index(values) {
		const {el, items} = this;
		const {length} = items;

		if (!Array.isArray(values) || !values.length) {
			return;
		}

		if (length === 0) {
			return;
		}

		let value = values[0] || 0;
		value = Math.max(Math.min(value, length - 1), 0);

		const {scrollLeft} = el;
		const from = {left: scrollLeft};
		const to = {left: items[value].offsetLeft};

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
		el.scrollTo({...to, behavior});
	}

	get items() {
		return fromCache(this, CACHE_KEY_ITEMS, () => {
			const { el, _options: { filterItem } } = this;

			return Array.from(el.children)
				.filter((item) => !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden)
				.filter(filterItem);
		});
	}

	get pages() {
		return fromCache(this, CACHE_KEY_PAGES, () => {
			const {el, items} = this;
			const {clientWidth: viewport} = el;

			if (viewport === 0) {
				// if the width of the carousel element is zero, we can not calculate
				// the pages properly and the carousel seems to be not visible. If
				// this is the case, we assume that each item is placed on a
				// separate page.
				return items.map((item, index) => [index]);
			}

			let pages = [[]];
			items
				.map((item, index) => {
					// Create a re-usable dataset for each item:
					const {offsetLeft: left, clientWidth: width} = item;
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
					const firstItem = prevPage[0] ? prevPage[0] : { left: 0 };
					let start = firstItem.left;

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
			return pages.map((page) => page.map(({ index }) => index));
		});
	}

	get pageIndex() {
		return fromCache(this, CACHE_KEY_PAGE_INDEX, () => {
			const {el, items, index, pages} = this;
			const outerLeft = el.getBoundingClientRect().left;
			const {clientWidth} = el;

			let visibles = index.reduce((acc, at) => {
				if (!items[at]) {
					return acc;
				}

				let {left, right} = items[at].getBoundingClientRect();
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

	destroy() {
		const {el} = this;

		// Remove created id if it was created by carousel:
		ID_MATCH.test(el.id) && el.removeAttribute('id');

		// Remove buttons:
		this._removeButtons();

		// Remove pagination:
		this._removePagination();

		// Remove scrollbars:
		this._removeScrollbars();

		// Remove events:
		el.removeEventListener(EVENT_SCROLL, this._onScroll);
		window.removeEventListener(EVENT_RESIZE, this._onResize);

		// Clear cache:
		clearFullCache(this);
	}

	update() {
		clearFullCache(this);

		this._updateButtons();
		this._updatePagination();
		this._updateScrollbars();
	}

	_updateScrollbars() {
		const { el, _options } = this;
		const {hasScrollbars, scrollbarsMaskClassName} = _options;
		if (hasScrollbars) {
			return;
		}

		let {height} = scrollbar.dimensions;

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
			this.el.parentNode.insertBefore(mask, this.el);
			mask.appendChild(this.el);
			return mask;
		})();

		if (height === this._scrollbarHeight) {
			return;
		}

		this.el.style.height = `calc(100% + ${height}px)`;
		this.el.style.marginBottom = `${height * -1}px`;
		this._scrollbarHeight = height;
	}

	_removeScrollbars() {
		const {_mask, el} = this;
		if (!this._mask) {
			return;
		}

		_mask.parentNode.insertBefore(el, _mask);
		_mask.parentNode.removeChild(_mask);
		el.removeAttribute('style');
	}

	_addButtons() {
		const {el, id, _options} = this;
		if (!_options.hasButtons) {
			return;
		}

		const {buttonTemplate, buttonClassName, buttonPrevious, buttonNext} = _options;

		// Create previous buttons:
		const [previous, next] = [buttonPrevious, buttonNext].map((data) =>
			__render(buttonTemplate, {
				...data,
				controls: id,
				className: `${buttonClassName} ${data.className}`
			}));

		if (previous) {
			const onPrevious = () => {
				const {pages, pageIndex} = this;
				const page = pages[pageIndex - 1] || pages[0];
				this.index = page;
			};

			previous.onclick = onPrevious;
			el.parentNode.appendChild(previous);
		}
		this._previous = previous;

		if (next) {
			const onNext = () => {
				const { pages, pageIndex } = this;
				const page = pages[pageIndex + 1] || pages[pages.length - 1];
				this.index = page;
			};

			next.onclick = onNext;
			el.parentNode.appendChild(next);
		}
		this._next = next;

		this._updateButtons();
	}

	_updateButtons() {
		const {_options} = this;
		if (!_options.hasButtons) {
			return;
		}

		const {pages, pageIndex, _previous, _next} = this;

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

	_removeButtons() {
		const {_previous, _next} = this;
		[_previous, _next].forEach((button) => {
			if (!button) {
				return;
			}
			button.onclick = null;
			button.parentNode.removeChild(button);
		});
	}

	_addPagination() {
		const {_options} = this;
		if (!_options.hasPagination) {
			return;
		}

		const {_mask, el, id, pages} = this;
		if (pages.length < 2) {
			return;
		}

		const {paginationTemplate, paginationClassName, paginationLabel, paginationTitle} = _options;
		const pagination = __render(paginationTemplate, {
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
		const buttons = Array.from(pagination.querySelectorAll('button'))
			.map((button, index) => {
				button.onclick = () => this.index = pages[index];
				return button;
			});

		const target = (_mask || el).parentNode;
		target.appendChild(pagination);
		this._pagination = pagination;
		this._paginationButtons = buttons;

		this._updatePagination();
	}

	_updatePagination() {
		const {_options} = this;
		if (!_options.hasPagination) {
			return;
		}

		const { pageIndex, _paginationButtons } = this;
		if (!_paginationButtons) {
			return;
		}

		_paginationButtons.forEach((button, at) => button.disabled = (at === pageIndex));
	}

	_removePagination() {
		const {_pagination, _paginationButtons} = this;
		(_paginationButtons || []).forEach((button) => {
			button.onclick = null;
			button.parentNode.removeChild(button);
		});
		this._paginationButtons = null;

		_pagination && _pagination.parentNode.removeChild(_pagination);
		this._pagination = null;
	}

	_onScroll(event) {
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		this._updateButtons();
		this._updatePagination();

		const {index, _options: { onScroll }} = this;
		onScroll && onScroll({index, type: EVENT_SCROLL, target: this, originalEvent: event});
	}

	_onResize() {
		clearCache(this, CACHE_KEY_PAGES);
		clearCache(this, CACHE_KEY_INDEX);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		this._updateButtons();
		this._removePagination();
		this._addPagination();
		this._updateScrollbars();
	}

}

export { Carousel };
