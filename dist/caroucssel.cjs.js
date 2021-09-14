'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const __CACHE = new WeakMap();
function fromCache(ref, key, factory) {
    const storage = __CACHE.get(ref) || {};
    if (key in storage) {
        return storage[key];
    }
    const value = factory();
    storage[key] = value;
    __CACHE.set(ref, storage);
    return value;
}
function writeCache(ref, key, value) {
    const storage = __CACHE.get(ref) || {};
    storage[key] = value;
    __CACHE.set(ref, storage);
}
function clearCache(ref, key) {
    const storage = __CACHE.get(ref);
    if (!storage) {
        return;
    }
    storage[key] = undefined;
    delete (storage[key]);
}
function clearFullCache(ref) {
    __CACHE.delete(ref);
}

function debounce(func, delay) {
    let timeout = null;
    const debounced = (...args) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), delay);
    };
    return debounced;
}

function render(template, data) {
    const el = document.createElement('div');
    el.innerHTML = template(data);
    const ref = el.firstElementChild;
    if (!ref) {
        return null;
    }
    return ref;
}

class Scrollbar {
    constructor() {
        window.addEventListener('resize', () => {
            clearCache(this, 'dimensions');
        });
    }
    get dimensions() {
        return fromCache(this, 'dimensions', () => {
            const inner = document.createElement('div');
            const outer = document.createElement('div');
            document.body.appendChild(outer);
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.appendChild(inner);
            inner.style.width = '200px';
            inner.style.height = '100%';
            outer.style.width = '150px';
            outer.style.height = '200px';
            outer.style.overflow = 'hidden';
            const h1 = inner.offsetHeight;
            outer.style.overflow = 'scroll';
            let h2 = inner.offsetHeight;
            h2 = (h1 === h2) ? outer.clientHeight : h2;
            const height = h1 - h2;
            document.body.removeChild(outer);
            return {
                height,
            };
        });
    }
}

const ID_NAME = (count) => `caroucssel-${count}`;
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
const DEFAULTS_BUTTON_PREVIOUS = {
    className: 'is-previous',
    label: 'Previous',
    title: 'Go to previous',
};
const DEFAULTS_BUTTON_NEXT = {
    className: 'is-next',
    label: 'Next',
    title: 'Go to next',
};
const DEFAULTS = {
    hasButtons: false,
    buttonClassName: 'button',
    buttonTemplate: ({ className, controls, label, title }) => `
		<button type="button" class="${className}" aria-label="${label}" title="${title}" aria-controls="${controls}">
			<span>${label}</span>
		</button>
	`,
    buttonPrevious: DEFAULTS_BUTTON_PREVIOUS,
    buttonNext: DEFAULTS_BUTTON_NEXT,
    hasPagination: false,
    paginationClassName: 'pagination',
    paginationLabel: ({ index }) => `${index + 1}`,
    paginationTitle: ({ index }) => `Go to ${index + 1}. page`,
    paginationTemplate: ({ className, controls, pages, label, title }) => `
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
    hasScrollbars: false,
    scrollbarsMaskClassName: 'caroucssel-mask',
    filterItem: () => true,
    onScroll: () => undefined,
};
let __instanceCount = 0;
let __scrollbar;
class Carousel {
    constructor(el, options = {}) {
        this._mask = null;
        this._isSmooth = false;
        this._previous = null;
        this._next = null;
        this._pagination = null;
        this._paginationButtons = null;
        if (!el || !(el instanceof Element)) {
            throw new Error(`Carousel needs a dom element but "${(typeof el)}" was passed.`);
        }
        this._el = el;
        __scrollbar = __scrollbar || new Scrollbar();
        __instanceCount++;
        el.id = el.id || ID_NAME(__instanceCount);
        this._id = el.id;
        this._mask = null;
        const opts = Object.assign(Object.assign({}, DEFAULTS), options);
        this._conf = opts;
        this._addButtons();
        this._addPagination();
        this._updateScrollbars();
        switch (true) {
            case Array.isArray(options.index):
                this.index = options.index;
                break;
            case !isNaN(options.index):
                this.index = [options.index];
                break;
        }
        this._isSmooth = true;
        this._onScroll = debounce(this._onScroll.bind(this), 25);
        this._onResize = debounce(this._onResize.bind(this), 25);
        el.addEventListener(EVENT_SCROLL, this._onScroll);
        window.addEventListener(EVENT_RESIZE, this._onResize);
    }
    static resetInstanceCount() {
    }
    get el() {
        return this._el;
    }
    get id() {
        return this._id;
    }
    get index() {
        return fromCache(this, CACHE_KEY_INDEX, () => {
            const { el, items } = this;
            const { length } = items;
            const { clientWidth } = el;
            const outerLeft = el.getBoundingClientRect().left;
            const index = [];
            let at = 0;
            for (; at < length; at++) {
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
                return [0];
            }
            return index;
        });
    }
    set index(values) {
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
        if (value === this.pages[0][0]) {
            to.left = 0;
        }
        if (from.left === to.left) {
            return;
        }
        clearCache(this, CACHE_KEY_INDEX);
        const behavior = this._isSmooth ? 'smooth' : 'auto';
        el.scrollTo(Object.assign(Object.assign({}, to), { behavior }));
    }
    get items() {
        return fromCache(this, CACHE_KEY_ITEMS, () => {
            const { el, _conf: { filterItem } } = this;
            const children = Array.from(el.children);
            return children
                .filter((item) => !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden)
                .filter(filterItem);
        });
    }
    get pages() {
        return fromCache(this, CACHE_KEY_PAGES, () => {
            const { el, items } = this;
            const { clientWidth: viewport } = el;
            if (viewport === 0) {
                return items.map((item, index) => [index]);
            }
            let pages = [[]];
            items
                .map((item, index) => {
                const { offsetLeft: left, clientWidth: width } = item;
                return { left, width, item, index };
            })
                .sort((a, b) => {
                return a.left - b.left;
            })
                .forEach((item) => {
                const { left, width } = item;
                const prevPage = pages[pages.length - 1];
                const firstItem = prevPage[0];
                let start = (firstItem === null || firstItem === void 0 ? void 0 : firstItem.left) || 0;
                if (prevPage === pages[0]) {
                    start = 0;
                }
                let add = Math.floor(((left - start) + width * (1 - VISIBILITY_OFFSET)) / viewport);
                while (add > 0) {
                    pages.push([]);
                    add--;
                }
                const page = pages[pages.length - 1];
                page.push(item);
            });
            pages = pages.filter((page) => page.length !== 0);
            return pages.map((page) => page.map(({ index }) => index));
        });
    }
    get pageIndex() {
        return fromCache(this, CACHE_KEY_PAGE_INDEX, () => {
            const { el, items, index, pages } = this;
            const outerLeft = el.getBoundingClientRect().left;
            const { clientWidth } = el;
            let visibles = index.reduce((acc, at) => {
                if (!items[at]) {
                    return acc;
                }
                let { left, right } = items[at].getBoundingClientRect();
                left = Math.round(left - outerLeft);
                right = Math.round(right - outerLeft);
                if (left < 0 || clientWidth < right) {
                    return acc;
                }
                return acc.concat([at]);
            }, []);
            if (visibles.length === 0) {
                visibles = [index[0]];
            }
            const at = visibles.sort((a, b) => {
                const rightA = items[a].getBoundingClientRect().right;
                const rightB = items[b].getBoundingClientRect().right;
                return rightB - rightA;
            })[0];
            return pages.findIndex((page) => page.includes(at));
        });
    }
    destroy() {
        const { el } = this;
        ID_MATCH.test(el.id) && el.removeAttribute('id');
        this._removeButtons();
        this._removePagination();
        this._removeScrollbars();
        el.removeEventListener(EVENT_SCROLL, this._onScroll);
        window.removeEventListener(EVENT_RESIZE, this._onResize);
        clearFullCache(this);
    }
    update() {
        clearFullCache(this);
        this._updateButtons();
        this._updatePagination();
        this._updateScrollbars();
    }
    _updateScrollbars() {
        const { el, _conf: _options } = this;
        const { hasScrollbars, scrollbarsMaskClassName } = _options;
        if (hasScrollbars) {
            return;
        }
        let { height } = __scrollbar.dimensions;
        if (el.scrollWidth <= el.clientWidth) {
            height = 0;
        }
        this._mask = this._mask || (() => {
            var _a;
            const mask = document.createElement('div');
            mask.className = scrollbarsMaskClassName;
            mask.style.overflow = 'hidden';
            mask.style.height = '100%';
            (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(mask, this.el);
            mask.appendChild(el);
            return mask;
        })();
        const cachedHeight = fromCache(this, CACHE_KEY_SCROLLBAR, () => undefined);
        if (height === cachedHeight) {
            return;
        }
        writeCache(this, CACHE_KEY_SCROLLBAR, height);
        const element = el;
        element.style.height = `calc(100% + ${height}px)`;
        element.style.marginBottom = `${height * -1}px`;
    }
    _removeScrollbars() {
        var _a, _b;
        const { _mask, el } = this;
        if (!_mask) {
            return;
        }
        (_a = _mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, _mask);
        (_b = _mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(_mask);
        el.removeAttribute('style');
        this._mask = null;
    }
    _addButtons() {
        var _a, _b;
        const { el, id, _conf: _options } = this;
        if (!_options.hasButtons) {
            return;
        }
        const { buttonTemplate, buttonClassName, buttonPrevious, buttonNext } = _options;
        const controls = id;
        const [previous, next] = [
            Object.assign(Object.assign(Object.assign({}, DEFAULTS_BUTTON_PREVIOUS), buttonPrevious), { controls, className: [buttonClassName, buttonPrevious.className].join(' ') }),
            Object.assign(Object.assign(Object.assign({}, DEFAULTS_BUTTON_NEXT), buttonNext), { controls, className: [buttonClassName, buttonNext.className].join(' ') }),
        ].map((params) => render(buttonTemplate, params));
        if (previous) {
            const onPrevious = () => {
                const { pages, pageIndex } = this;
                const index = pages[pageIndex - 1] || pages[0];
                this.index = index;
            };
            previous.onclick = onPrevious;
            (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(previous);
        }
        this._previous = previous;
        if (next) {
            const onNext = () => {
                const { pages, pageIndex } = this;
                const index = pages[pageIndex + 1] || pages[pages.length - 1];
                this.index = index;
            };
            next.onclick = onNext;
            (_b = el.parentNode) === null || _b === void 0 ? void 0 : _b.appendChild(next);
        }
        this._next = next;
        this._updateButtons();
    }
    _updateButtons() {
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
    _removeButtons() {
        const { _previous, _next } = this;
        [_previous, _next].forEach((button) => {
            var _a;
            if (!button) {
                return;
            }
            button.onclick = null;
            (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
    }
    _addPagination() {
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
        const buttons = Array.from(pagination.querySelectorAll('button'))
            .map((button, index) => {
            button.onclick = () => this.index = pages[index];
            return button;
        });
        const target = (_mask || el).parentNode;
        target === null || target === void 0 ? void 0 : target.appendChild(pagination);
        this._pagination = pagination;
        this._paginationButtons = buttons;
        this._updatePagination();
    }
    _updatePagination() {
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
    _removePagination() {
        var _a;
        const { _pagination, _paginationButtons } = this;
        (_paginationButtons || []).forEach((button) => {
            var _a;
            button.onclick = null;
            (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
        this._paginationButtons = null;
        _pagination && ((_a = _pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(_pagination));
        this._pagination = null;
    }
    _onScroll(event) {
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_PAGE_INDEX);
        this._updateButtons();
        this._updatePagination();
        const { index, _conf: { onScroll } } = this;
        onScroll && onScroll({ index, type: EVENT_SCROLL, target: this, originalEvent: event });
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

exports.Carousel = Carousel;
