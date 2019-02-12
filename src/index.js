import {Scrollbar} from './utils/index';


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
		paginationTemplate: __templatePagination
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
	carouselCount = 0,
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
		carouselCount++;
		el.id = el.id || ID_NAME(carouselCount);
		this._id = el.id;

		// "deep" extend options and defaults:
		this._options = {...DEFAULTS, ...options};
		this._options.buttonPrevious = {...DEFAULTS_BUTTON_PREVIOUS, ...options.buttonPrevious};
		this._options.buttonNext = {...DEFAULTS_BUTTON_NEXT, ...options.buttonNext};

		// Render
		this._update();
		this._addButtons();
		this._addPagination();
	}

	get el() {
		return this._el;
	}

	get id() {
		return this._id;
	}

	get index() {
		const {el} = this;
		const {children, clientWidth} = el;
		const {length} = children;
		const outerLeft = el.getClientRects()[0].left;
		const offset = clientWidth / 2;

		let
			index = 0,
			left
		;

		for (;index < length; index++) {
			left = children[index].getClientRects()[0].left - outerLeft + offset;
			if (left >= 0 && left < clientWidth) {
				return index;
			}
		}

		return index - 1;
	}

	set index(value) {
		const {el} = this;
		const {children, scrollLeft} = el;
		const from = {scrollLeft};

		if (-1 >= value) {
			value = 0;
		}

		if (value >= el.childElementCount) {
			value = el.childElementCount - 1;
		}

		const to = {left: children[value].offsetLeft};
		if (from.left === to.left) {
			return;
		}

		el.scrollTo({...to, behavior: 'smooth'});
	}

	get items() {
		return [...this.el.children];
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
	}

	_update() {
		const {height} = scrollbar.dimensions;
		const hasInvisbleScrollbar = (height === 0);

		if (hasInvisbleScrollbar === this._hasInvisbleScrollbar) {
			return;
		}

		const classList = this.el.classList;
		classList.add(hasInvisbleScrollbar ? CLASS_VISIBLE_SCROLLBAR : CLASS_INVISIBLE_SCROLLBAR);
		classList.remove(hasInvisbleScrollbar ? CLASS_INVISIBLE_SCROLLBAR : CLASS_VISIBLE_SCROLLBAR);
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

		previous.onclick = () => this.index--;
		el.parentNode.appendChild(previous);
		this._previous = previous;

		next.onclick = () => this.index++;
		el.parentNode.appendChild(next);
		this._next = next;
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

		const buttons = [...pagination.querySelectorAll('button')]
			.map((button, index) => {
				button.onclick = () => this.index = index;
				return button;
			});
		el.parentNode.appendChild(pagination);
		this._pagination = pagination;
		this._paginationButtons = buttons;
	}

	_removePagination() {
		const {_pagination, _paginationButtons} = this;
		(_paginationButtons || []).forEach((button) => {
			button.onclick = null;
			button.parentNode.removeChild(button);
		});
		_pagination && _pagination.parentNode.removeChild(_pagination);
	}

}
