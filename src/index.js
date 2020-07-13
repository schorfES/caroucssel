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


function __templatePagination({className, controls, items, label, title}) {
	return `<ul class="${className}">
		${items.map((item, index) => {
			const data = {index, item, items};
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
	CLASS_VISIBLE_SCROLLBAR = 'has-visible-scrollbar',
	CLASS_INVISIBLE_SCROLLBAR = 'has-invisible-scrollbar',

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
		paginationTitle: ({index}) => `Go to ${index + 1}. item`,
		paginationTemplate: __templatePagination,

		// Scrollbars, set to true when use default scrolling behaviour
		hasScrollbars: false,

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

	destroy() {
		const {el} = this;
		const {classList} = el;

		// Remove created id if it was created by carousel:
		ID_MATCH.test(el.id) && el.removeAttribute('id');

		// Remove scrollbar classes:
		classList.remove(CLASS_VISIBLE_SCROLLBAR);
		classList.remove(CLASS_INVISIBLE_SCROLLBAR);

		// Remove buttons:
		this._removeButtons();

		// Remove pagination:
		this._removePagination();

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
		const {hasScrollbars} = this._options;

		if (hasScrollbars) {
			return;
		}

		const {height} = scrollbar.dimensions;
		const hasInvisbleScrollbar = (height === 0);

		if (hasInvisbleScrollbar === this._hasInvisbleScrollbar) {
			return;
		}

		const classList = this.el.classList;
		classList.add(hasInvisbleScrollbar ? CLASS_INVISIBLE_SCROLLBAR : CLASS_VISIBLE_SCROLLBAR);
		classList.remove(hasInvisbleScrollbar ? CLASS_VISIBLE_SCROLLBAR : CLASS_INVISIBLE_SCROLLBAR);
		this._hasInvisbleScrollbar = hasInvisbleScrollbar;
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

		previous.onclick = () => this.index = [this.index[0] - 1];
		el.parentNode.appendChild(previous);
		this._previous = previous;

		next.onclick = () => this.index = [this.index[0] + 1];
		el.parentNode.appendChild(next);
		this._next = next;

		this._updateButtons();
	}

	_updateButtons(index = this.index) {
		const {_options} = this;
		if (!_options.hasButtons) {
			return;
		}

		const {items, _previous, _next} = this;
		_previous.disabled = index[0] === 0;
		_next.disabled = index[index.length - 1] === items.length - 1;
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
		const {el, id, items, _options} = this;
		if (!_options.hasPagination) {
			return;
		}

		const {paginationTemplate, paginationClassName, paginationLabel, paginationTitle} = _options;
		const pagination = __render(paginationTemplate, {
			items,
			controls: id,
			className: paginationClassName,
			label: paginationLabel,
			title: paginationTitle,
		});

		// @TODO: Add template for buttons:
		const buttons = [...pagination.querySelectorAll('button')]
			.map((button, index) => {
				button.onclick = () => this.index = [index];
				return button;
			});
		el.parentNode.appendChild(pagination);
		this._pagination = pagination;
		this._paginationButtons = buttons;

		this._updatePagination();
	}

	_updatePagination(index = this.index) {
		const {_options} = this;
		if (!_options.hasPagination) {
			return;
		}

		const {_paginationButtons} = this;
		_paginationButtons.forEach((button, at) => button.disabled = index.includes(at));
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
		this._updatePagination(index);
		this._updateScrollbars();
	}

}

/**
 * This can be used for testing purposes to reset the instance count which is
 * used to create unique id's.
 */
Carousel.resetInstanceCount = () => instanceCount = 0;
