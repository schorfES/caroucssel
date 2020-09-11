import {Scrollbar} from './utils/Scrollbar';
import {debounce} from './utils/debounce';


function __render(template, data) {
	const el = document.createElement('div');
	el.innerHTML = template(data);
	return el.firstChild;
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

	INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i,

	EVENT_SCROLL = 'scroll',
	EVENT_RESIZE = 'resize',

	DEFAULTS = {
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


export class Carousel {

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
		this._options = {...DEFAULTS, ...options};
		this._options.buttonPrevious = {...DEFAULTS_BUTTON_PREVIOUS, ...options.buttonPrevious};
		this._options.buttonNext = {...DEFAULTS_BUTTON_NEXT, ...options.buttonNext};

		// Receive all items:
		this._updateItems();

		// Render:
		this._addButtons();
		this._addPagination();
		this._updateScrollbars();

		// Set index:
		this._isSmooth = false;
		this.index = this._options.index || [0];
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

			// @TODO: This may not work properly when the item is larger than
			// the clientWidth
			if (left + width / 2 >= 0 && left < clientWidth - width / 2) {
				values.push(index)
			}
			// else if (values.length > 0) {
			// 	If we already pushed an item trough this loop, we can break this
			// 	loop, because all other items will be out of visibility.
			//
			// 	NOTE: Do not implement this, because if a flexbox ordering is
			// 	attached to one of the items, this rule won't apply!
			//
			// 	break;
			// }
		}

		if (values.length === 0) {
			return [0];
		}

		return values;
	}

	set index(values) {
		const {el, items} = this;
		const {length} = items;

		if (length === 0) {
			return;
		}

		let value = values[0] || 0;
		value = Math.max(Math.min(value, length - 1), 0);

		const {scrollLeft} = el;
		const from = {left: scrollLeft};
		const to = {left: items[value].offsetLeft};
		if (from.left === to.left) {
			return;
		}

		const behavior = this._isSmooth ? 'smooth' : 'auto';
		el.scrollTo({...to, behavior});
	}

	get items() {
		return this._items;
	}

	get pages() {
		const {el, items} = this;

		const {clientWidth} = el;
		if (clientWidth === 0) {
			// if the width of the carousel element is zero, we can not calculate
			// the pages properly and the carousel seems to be not visible. If
			// this is the case, we assume that each item is placed on a
			// separate page.
			return items.map((item, index) => [index]);
		}

		const pages = [[]];
		items.forEach((item, index) => {
			const {offsetLeft, clientWidth: width} = item;
			// at least 90% of the items needs to be in the page:
			const page = Math.floor((offsetLeft +  width * 0.9) / clientWidth);

			// If items are wider than the container viewport or use a margin
			// that causes the calculation to skip pages. We might need to create
			// empty pages here. These empty pages need to be removed later on...
			while (!pages[page]) {
				pages.push([]);
			}

			pages[page].push(index);
		});

		// ...remove empty pages:
		return pages.filter((page) => page.length !== 0);
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
	}

	update() {
		const {index} = this;
		this._updateItems();
		this._updateButtons(index);
		this._updatePagination(index);
		this._updateScrollbars();
	}

	_updateItems() {
		const { el, _options } = this;
		this._items = Array
			.from(el.children)
			.filter((item) => !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden)
			.filter(_options.filterItem);
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

		if (height === this._scrollbarHeight) {
			return;
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

		previous.onclick = () => {
			const { index, pages } = this;
			const item = index[index.length - 1];
			const at = pages.findIndex((page) => page.includes(item));
			const page = pages[at - 1];
			this.index = page;
		};
		el.parentNode.appendChild(previous);
		this._previous = previous;

		next.onclick = () => {
			const { index, pages } = this;
			const item = index[0];
			const at = pages.findIndex((page) => page.includes(item));
			const page = pages[at + 1];

			// Pass the next page if available...
			if (page) {
				this.index = page;
				return;
			}

			// ...otherwise pass the last item of the current page
			const current = pages[at];
			this.index = [current[current.length - 1]];
		};
		el.parentNode.appendChild(next);
		this._next = next;

		this._updateButtons();
	}

	_updateButtons(index = this.index) {
		const {_options} = this;
		if (!_options.hasButtons) {
			return;
		}

		const {pages, _previous, _next} = this;

		const firstPage = pages[0];
		const isFirstPage = index[0] === firstPage[0];
		_previous.disabled = isFirstPage;

		const lastPage = pages[pages.length - 1];
		const isLastPage = index[index.length - 1] === lastPage[lastPage.length - 1];
		_next.disabled = isLastPage;
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
		const {paginationTemplate, paginationClassName, paginationLabel, paginationTitle} = _options;
		if (pages.length > 1) {
			const pagination = __render(hasPagination, {
				pages,
				controls: id,
				className: paginationClassName,
				label: paginationLabel,
				title: paginationTitle,
			});
		} else {
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

	_updatePagination(index = this.index) {
		const {_options} = this;
		if (!_options.hasPagination) {
			return;
		}

		const {pages, _paginationButtons} = this;
		const lastIndex = index[index.length - 1];
		const selected = pages.findIndex((page) => page.includes(lastIndex));
		_paginationButtons.forEach((button, at) => button.disabled = (at === selected));
	}

	_removePagination() {
		const {_pagination, _paginationButtons} = this;
		(_paginationButtons || []).forEach((button) => {
			button.onclick = null;
			button.parentNode.removeChild(button);
		});
		_pagination && _pagination.parentNode.removeChild(_pagination);
	}

	_onScroll(event) {
		const {index, _options} = this;
		this._updateButtons(index);
		this._updatePagination(index);

		const {onScroll} = _options;
		onScroll && onScroll({index, type: EVENT_SCROLL, target: this, originalEvent: event});
	}

	_onResize() {
		const {index} = this;
		this._updateButtons(index);
		this._removePagination();
		this._addPagination();
		this._updateScrollbars();
	}

}

if (process.env.NODE_ENV === 'test') {
	// This can be used for testing purposes to reset the instance count which is
	// used to create unique id's.
	Carousel.resetInstanceCount = () => instanceCount = 0;
}
