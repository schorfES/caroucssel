var caroucssel = (function (exports) {
    'use strict';

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    const __CACHE = new WeakMap();
    function fromCache(ref, key, factory) {
        const storage = __CACHE.get(ref) || new Map();
        if (storage.has(key)) {
            return storage.get(key);
        }
        if (!factory) {
            return undefined;
        }
        const value = factory();
        storage.set(key, value);
        __CACHE.set(ref, storage);
        return value;
    }
    function writeCache(ref, key, value) {
        const storage = __CACHE.get(ref) || new Map();
        storage.set(key, value);
        __CACHE.set(ref, storage);
    }
    function clearCache(ref, key) {
        const storage = __CACHE.get(ref);
        if (!storage || !storage.has(key)) {
            return;
        }
        storage.delete(key);
    }
    function clearFullCache(ref) {
        __CACHE.delete(ref);
    }

    function render(template, context) {
        const el = document.createElement('div');
        el.innerHTML = template(context);
        const ref = el.firstElementChild;
        if (!ref) {
            return null;
        }
        return ref;
    }

    const FEATURE_NAME$3 = 'buildin:buttons';
    const CACHE_KEY_PROXY$4 = 'prxy';
    const CACHE_KEY_CONFIGURATION$4 = 'conf';
    const CACHE_KEY_BUTTONS$1 = 'btns';
    const EVENT_CLICK = 'click';
    const DEFAULTS$4 = {
        template: ({ className, controls, label, title }) => `
		<button type="button" class="${className}" aria-label="${label}" title="${title}" aria-controls="${controls}">
			<span>${label}</span>
		</button>
	`,
        className: 'button',
        nextClassName: 'is-next',
        nextLabel: 'Next',
        nextTitle: 'Go to next',
        previousClassName: 'is-previous',
        previousLabel: 'Previous',
        previousTitle: 'Go to previous',
    };
    class Buttons {
        constructor(options = {}) {
            writeCache(this, CACHE_KEY_CONFIGURATION$4, Object.assign(Object.assign({}, DEFAULTS$4), options));
            this._onPrev = this._onPrev.bind(this);
            this._onNext = this._onNext.bind(this);
        }
        get name() {
            return FEATURE_NAME$3;
        }
        init(proxy) {
            writeCache(this, CACHE_KEY_PROXY$4, proxy);
            this._render();
        }
        destroy() {
            this._remove();
            clearFullCache(this);
        }
        update( ) {
            this._render();
        }
        _render() {
            const proxy = fromCache(this, CACHE_KEY_PROXY$4);
            const config = fromCache(this, CACHE_KEY_CONFIGURATION$4);
            const { el, mask, pages, pageIndex } = proxy;
            const [next, previous] = fromCache(this, CACHE_KEY_BUTTONS$1, () => {
                const target = mask !== null && mask !== void 0 ? mask : el;
                const { template, className, previousClassName, previousLabel, previousTitle, nextClassName, nextLabel, nextTitle, } = config;
                const settings = [
                    {
                        controls: el.id,
                        label: nextLabel,
                        title: nextTitle,
                        className: [className, nextClassName].join(' '),
                        handler: this._onNext,
                    },
                    {
                        controls: el.id,
                        label: previousLabel,
                        title: previousTitle,
                        className: [className, previousClassName].join(' '),
                        handler: this._onPrev,
                    },
                ];
                return settings.map((_a) => {
                    var _b;
                    var { handler } = _a, params = __rest(_a, ["handler"]);
                    const button = render(template, params);
                    if (!button) {
                        return null;
                    }
                    button.addEventListener(EVENT_CLICK, handler);
                    (_b = target.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(button, target.nextSibling);
                    return button;
                });
            });
            if (next) {
                const lastPage = pages[pageIndex + 1];
                const isLastPage = lastPage === undefined;
                next.disabled = isLastPage;
            }
            if (previous) {
                const firstPage = pages[pageIndex - 1];
                const isFirstPage = firstPage === undefined;
                previous.disabled = isFirstPage;
            }
        }
        _remove() {
            const buttons = fromCache(this, CACHE_KEY_BUTTONS$1);
            buttons === null || buttons === void 0 ? void 0 : buttons.forEach((button) => {
                var _a;
                button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, this._onPrev);
                button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, this._onNext);
                (_a = button === null || button === void 0 ? void 0 : button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
            });
        }
        _onPrev() {
            const proxy = fromCache(this, CACHE_KEY_PROXY$4);
            const { pages, pageIndex } = proxy;
            const index = pages[pageIndex - 1] || pages[0];
            proxy.index = index;
        }
        _onNext() {
            const proxy = fromCache(this, CACHE_KEY_PROXY$4);
            const { pages, pageIndex } = proxy;
            const index = pages[pageIndex + 1] || pages[pages.length - 1];
            proxy.index = index;
        }
    }

    const FEATURE_NAME$2 = 'buildin:mouse';
    const CACHE_KEY_PROXY$3 = 'prxy';
    const CACHE_KEY_CONFIGURATION$3 = 'conf';
    const CACHE_KEY_PAGE_INDEX$1 = 'pgidx';
    const CACHE_KEY_POSITION_X = 'posx';
    const CACHE_KEY_SCROLL_LEFT = 'scrl';
    const CACHE_KEY_TIMEOUT = 'time';
    const CURSOR_GRAB = 'grab';
    const CURSOR_GRABBING = 'grabbing';
    const EVENT_START = 'mousedown';
    const EVENT_DRAG = 'mousemove';
    const EVENT_END = 'mouseup';
    const THRESHOLD_MIN = 100;
    const THRESHOLD_MAX = 250;
    const THRESHOLD_FACTOR = 0.25;
    function __getPositionX(event) {
        if (event instanceof MouseEvent) {
            return event.clientX;
        }
        return 0;
    }
    const DEFAULTS$3 = {
        indicator: false,
    };
    class Mouse {
        constructor(options = {}) {
            writeCache(this, CACHE_KEY_CONFIGURATION$3, Object.assign(Object.assign({}, DEFAULTS$3), options));
            this._onStart = this._onStart.bind(this);
            this._onDrag = this._onDrag.bind(this);
            this._onEnd = this._onEnd.bind(this);
        }
        get name() {
            return FEATURE_NAME$2;
        }
        init(proxy) {
            writeCache(this, CACHE_KEY_PROXY$3, proxy);
            const config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
            const { el } = proxy;
            const element = el;
            element.style.cursor = config.indicator ? CURSOR_GRAB : '';
            el.addEventListener(EVENT_START, this._onStart, { passive: true });
        }
        destroy() {
            clearFullCache(this);
        }
        update() {
        }
        _onStart(event) {
            var _a;
            const timeout = fromCache(this, CACHE_KEY_TIMEOUT);
            clearTimeout(timeout);
            const config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
            const proxy = fromCache(this, CACHE_KEY_PROXY$3);
            const element = proxy.el;
            fromCache(this, CACHE_KEY_SCROLL_LEFT, () => element.scrollLeft);
            fromCache(this, CACHE_KEY_POSITION_X, () => __getPositionX(event));
            fromCache(this, CACHE_KEY_PAGE_INDEX$1, () => proxy.pageIndex);
            element.style.userSelect = 'none';
            element.style.scrollBehavior = 'auto';
            element.style.scrollSnapType = 'none';
            element.style.cursor = config.indicator ? CURSOR_GRABBING : '';
            window.addEventListener(EVENT_DRAG, this._onDrag, { passive: true });
            window.addEventListener(EVENT_END, this._onEnd, { passive: true });
            (_a = config.onStart) === null || _a === void 0 ? void 0 : _a.call(config, { originalEvent: event });
        }
        _onDrag(event) {
            var _a, _b, _c;
            const config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
            const { el } = fromCache(this, CACHE_KEY_PROXY$3);
            const left = (_a = fromCache(this, CACHE_KEY_SCROLL_LEFT)) !== null && _a !== void 0 ? _a : 0;
            const x = (_b = fromCache(this, CACHE_KEY_POSITION_X)) !== null && _b !== void 0 ? _b : 0;
            const currentX = __getPositionX(event);
            const deltaX = x - currentX;
            el.scrollLeft = left + deltaX;
            (_c = config.onDrag) === null || _c === void 0 ? void 0 : _c.call(config, { originalEvent: event });
        }
        _onEnd(event) {
            var _a, _b, _c, _d;
            const proxy = fromCache(this, CACHE_KEY_PROXY$3);
            const config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
            const left = (_a = fromCache(this, CACHE_KEY_SCROLL_LEFT)) !== null && _a !== void 0 ? _a : 0;
            const pageIndex = (_b = fromCache(this, CACHE_KEY_PAGE_INDEX$1)) !== null && _b !== void 0 ? _b : 0;
            clearCache(this, CACHE_KEY_SCROLL_LEFT);
            clearCache(this, CACHE_KEY_POSITION_X);
            clearCache(this, CACHE_KEY_PAGE_INDEX$1);
            const element = proxy.el;
            const threshold = Math.min(Math.max(THRESHOLD_MIN, element.clientWidth * THRESHOLD_FACTOR), THRESHOLD_MAX);
            const currentLeft = element.scrollLeft;
            const distance = currentLeft - left;
            const offset = Math.abs(distance);
            element.style.removeProperty('user-select');
            element.style.removeProperty('scroll-behavior');
            element.style.cursor = config.indicator ? CURSOR_GRAB : '';
            let index = proxy.index;
            if (offset > threshold) {
                const direction = distance / offset;
                const at = Math.max(pageIndex + direction, 0);
                index = (_c = proxy.pages[at]) !== null && _c !== void 0 ? _c : index;
            }
            window.requestAnimationFrame(() => {
                proxy.index = index;
            });
            const timeout = window.setTimeout(() => {
                element.style.removeProperty('scroll-snap-type');
            }, 1000);
            writeCache(this, CACHE_KEY_TIMEOUT, timeout);
            window.removeEventListener(EVENT_DRAG, this._onDrag);
            window.removeEventListener(EVENT_END, this._onEnd);
            (_d = config.onEnd) === null || _d === void 0 ? void 0 : _d.call(config, { originalEvent: event });
        }
    }

    exports.UpdateType = void 0;
    (function (UpdateType) {
        UpdateType["SCROLL"] = "scroll";
        UpdateType["RESIZE"] = "resize";
        UpdateType["FORCED"] = "forced";
        UpdateType["FEATURE"] = "feature";
    })(exports.UpdateType || (exports.UpdateType = {}));
    exports.ScrollBehavior = void 0;
    (function (ScrollBehavior) {
        ScrollBehavior["AUTO"] = "auto";
        ScrollBehavior["SMOOTH"] = "smooth";
    })(exports.ScrollBehavior || (exports.ScrollBehavior = {}));

    const FEATURE_NAME$1 = 'buildin:pagination';
    const CACHE_KEY_PROXY$2 = 'prxy';
    const CACHE_KEY_CONFIGURATION$2 = 'conf';
    const CACHE_KEY_PAGINATION = 'pags';
    const CACHE_KEY_BUTTONS = 'btns';
    const DEFAULTS$2 = {
        template: ({ className, controls, pages, label, title }) => `
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
        className: 'pagination',
        label: ({ index }) => `${index + 1}`,
        title: ({ index }) => `Go to ${index + 1}. page`,
    };
    class Pagination {
        constructor(options = {}) {
            writeCache(this, CACHE_KEY_CONFIGURATION$2, Object.assign(Object.assign({}, DEFAULTS$2), options));
            this._onClick = this._onClick.bind(this);
        }
        get name() {
            return FEATURE_NAME$1;
        }
        init(proxy) {
            writeCache(this, CACHE_KEY_PROXY$2, proxy);
            this._add();
        }
        destroy() {
            this._remove();
            clearFullCache(this);
        }
        update(event) {
            switch (event.type) {
                case exports.UpdateType.SCROLL:
                    this._update();
                    break;
                default:
                    this._remove();
                    this._add();
                    break;
            }
        }
        _add() {
            var _a;
            const proxy = fromCache(this, CACHE_KEY_PROXY$2);
            const config = fromCache(this, CACHE_KEY_CONFIGURATION$2);
            const { el, mask, pages } = proxy;
            const target = mask !== null && mask !== void 0 ? mask : el;
            if (pages.length < 2) {
                return;
            }
            const { template, className, label, title } = config;
            const pagination = render(template, { label, title, pages, className, controls: el.id });
            if (!pagination) {
                return;
            }
            const buttons = Array.from(pagination.querySelectorAll('button'))
                .map((button) => {
                button.addEventListener('click', this._onClick, true);
                return button;
            });
            (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(pagination);
            writeCache(this, CACHE_KEY_PAGINATION, pagination);
            writeCache(this, CACHE_KEY_BUTTONS, buttons);
            this._update();
        }
        _update() {
            const proxy = fromCache(this, CACHE_KEY_PROXY$2);
            const buttons = fromCache(this, CACHE_KEY_BUTTONS);
            const { pageIndex } = proxy;
            buttons === null || buttons === void 0 ? void 0 : buttons.forEach((button, at) => button.disabled = (at === pageIndex));
        }
        _remove() {
            var _a;
            const pagination = fromCache(this, CACHE_KEY_PAGINATION);
            const buttons = fromCache(this, CACHE_KEY_BUTTONS);
            buttons === null || buttons === void 0 ? void 0 : buttons.forEach((button) => {
                var _a;
                button.removeEventListener('click', this._onClick);
                (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
            });
            (_a = pagination === null || pagination === void 0 ? void 0 : pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(pagination);
            clearCache(this, CACHE_KEY_BUTTONS);
            clearCache(this, CACHE_KEY_PAGINATION);
        }
        _onClick(event) {
            const proxy = fromCache(this, CACHE_KEY_PROXY$2);
            const buttons = fromCache(this, CACHE_KEY_BUTTONS);
            if (!buttons) {
                return;
            }
            const target = event.currentTarget;
            const index = buttons.indexOf(target);
            proxy.index = proxy.pages[index];
        }
    }

    const CACHE_KEY_DIMENSIONS = 'dims';
    class Scrollbar {
        constructor() {
            window.addEventListener('resize', () => {
                clearCache(this, CACHE_KEY_DIMENSIONS);
            });
        }
        get dimensions() {
            return fromCache(this, CACHE_KEY_DIMENSIONS, () => {
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

    const FEATURE_NAME = 'buildin:mask';
    const CACHE_KEY_PROXY$1 = 'prxy';
    const CACHE_KEY_CONFIGURATION$1 = 'conf';
    const CACHE_KEY_MASK$1 = 'mask';
    const CACHE_KEY_HEIGHT = 'hght';
    let __scrollbar;
    const DEFAULTS$1 = {
        enabled: true,
        className: 'caroucssel-mask',
        tagName: 'div',
    };
    class Mask {
        constructor(options = {}) {
            writeCache(this, CACHE_KEY_CONFIGURATION$1, Object.assign(Object.assign({}, DEFAULTS$1), options));
        }
        get name() {
            return FEATURE_NAME;
        }
        get el() {
            var _a;
            return (_a = fromCache(this, CACHE_KEY_MASK$1)) !== null && _a !== void 0 ? _a : null;
        }
        init(proxy) {
            writeCache(this, CACHE_KEY_PROXY$1, proxy);
            __scrollbar = __scrollbar !== null && __scrollbar !== void 0 ? __scrollbar : new Scrollbar();
            this._render();
        }
        destroy() {
            this._remove();
            clearFullCache(this);
        }
        update(event) {
            switch (event.type) {
                case exports.UpdateType.RESIZE:
                case exports.UpdateType.FORCED:
                    clearCache(this, CACHE_KEY_HEIGHT);
                    this._render();
                    break;
                default:
                    this._render();
                    break;
            }
        }
        _render() {
            const { enabled, className, tagName } = fromCache(this, CACHE_KEY_CONFIGURATION$1);
            if (!enabled) {
                return;
            }
            const proxy = fromCache(this, CACHE_KEY_PROXY$1);
            const element = proxy.el;
            let { height } = __scrollbar.dimensions;
            if (element.scrollWidth <= element.clientWidth) {
                height = 0;
            }
            fromCache(this, CACHE_KEY_MASK$1, () => {
                var _a;
                const mask = document.createElement(tagName);
                mask.className = className;
                mask.style.overflow = 'hidden';
                mask.style.height = '100%';
                (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(mask, element);
                mask.appendChild(element);
                return mask;
            });
            const cachedHeight = fromCache(this, CACHE_KEY_HEIGHT);
            if (height === cachedHeight) {
                return;
            }
            writeCache(this, CACHE_KEY_HEIGHT, height);
            element.style.height = `calc(100% + ${height}px)`;
            element.style.marginBottom = `${height * -1}px`;
        }
        _remove() {
            var _a, _b;
            const { el } = fromCache(this, CACHE_KEY_PROXY$1);
            const mask = fromCache(this, CACHE_KEY_MASK$1);
            (_a = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, mask);
            (_b = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(mask);
            el.removeAttribute('style');
        }
    }

    const CACHE_KEY_INSTANCE = 'inst';
    const CACHE_KEY_FEATURES$1 = 'feat';
    function __getInstance(ref) {
        return fromCache(ref, CACHE_KEY_INSTANCE);
    }
    function __getFeatures(ref) {
        return fromCache(ref, CACHE_KEY_FEATURES$1);
    }
    class Proxy {
        constructor(instance, features) {
            writeCache(this, CACHE_KEY_INSTANCE, instance);
            writeCache(this, CACHE_KEY_FEATURES$1, features);
        }
        get id() {
            return __getInstance(this).id;
        }
        get el() {
            return __getInstance(this).el;
        }
        get mask() {
            return __getInstance(this).mask;
        }
        get index() {
            return __getInstance(this).index;
        }
        set index(value) {
            __getInstance(this).index = value;
        }
        get items() {
            return __getInstance(this).items;
        }
        get pages() {
            return __getInstance(this).pages;
        }
        get pageIndex() {
            return __getInstance(this).pageIndex;
        }
        update(sender) {
            __getInstance(this).update();
            __getFeatures(this).forEach((feature) => {
                if (feature === sender) {
                    return;
                }
                feature.update({ type: exports.UpdateType.FEATURE });
            });
        }
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

    const ID_NAME = (count) => `caroucssel-${count}`;
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
    let __instanceCount = 0;
    const DEFAULTS = {
        features: [],
        filterItem: () => true,
        onScroll: () => undefined,
    };
    class Carousel {
        static resetInstanceCount() {
        }
        constructor(el, options = {}) {
            this.behavior = exports.ScrollBehavior.AUTO;
            if (!el || !(el instanceof Element)) {
                throw new Error(`Carousel needs a dom element but "${(typeof el)}" was passed.`);
            }
            writeCache(this, CACHE_KEY_ELEMENT, el);
            __instanceCount++;
            el.id = el.id || ID_NAME(__instanceCount);
            writeCache(this, CACHE_KEY_ID, el.id);
            const configuration = Object.assign(Object.assign({}, DEFAULTS), options);
            writeCache(this, CACHE_KEY_CONFIGURATION, configuration);
            let mask = null;
            let features = [...configuration.features];
            const index = configuration.features.findIndex((feature) => feature instanceof Mask);
            if (index > -1) {
                [mask] = features.splice(index, 1);
            }
            mask !== null && mask !== void 0 ? mask : (mask = new Mask());
            features = features.filter((feature) => !(feature instanceof Mask));
            features = [mask, ...features];
            writeCache(this, CACHE_KEY_MASK, mask);
            const proxy = new Proxy(this, features);
            writeCache(this, CACHE_KEY_PROXY, proxy);
            writeCache(this, CACHE_KEY_FEATURES, features);
            features.forEach((feature) => feature.init(proxy));
            switch (true) {
                case Array.isArray(options.index):
                    this.index = options.index;
                    break;
                case !isNaN(options.index):
                    this.index = [options.index];
                    break;
            }
            this.behavior = exports.ScrollBehavior.SMOOTH;
            this._onScroll = debounce(this._onScroll.bind(this), 45);
            this._onResize = debounce(this._onResize.bind(this), 25);
            el.addEventListener(EVENT_SCROLL, this._onScroll);
            window.addEventListener(EVENT_RESIZE, this._onResize);
        }
        get el() {
            return fromCache(this, CACHE_KEY_ELEMENT);
        }
        get mask() {
            var _a;
            const mask = fromCache(this, CACHE_KEY_MASK);
            return (_a = mask.el) !== null && _a !== void 0 ? _a : null;
        }
        get id() {
            return fromCache(this, CACHE_KEY_ID);
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
            if (value === this.pages[0][0]) {
                to.left = 0;
            }
            if (from.left === to.left) {
                return;
            }
            clearCache(this, CACHE_KEY_INDEX);
            el.scrollTo(Object.assign(Object.assign({}, to), { behavior }));
        }
        get items() {
            return fromCache(this, CACHE_KEY_ITEMS, () => {
                const { filterItem } = fromCache(this, CACHE_KEY_CONFIGURATION);
                const { el } = this;
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
            const features = fromCache(this, CACHE_KEY_FEATURES);
            features.forEach((feature) => feature.destroy());
            el.removeEventListener(EVENT_SCROLL, this._onScroll);
            window.removeEventListener(EVENT_RESIZE, this._onResize);
            clearFullCache(this);
        }
        update() {
            clearCache(this, CACHE_KEY_INDEX);
            clearCache(this, CACHE_KEY_ITEMS);
            clearCache(this, CACHE_KEY_PAGES);
            clearCache(this, CACHE_KEY_PAGE_INDEX);
            const features = fromCache(this, CACHE_KEY_FEATURES);
            features.forEach((feature) => feature.update({ type: exports.UpdateType.FORCED }));
        }
        _onScroll(event) {
            clearCache(this, CACHE_KEY_INDEX);
            clearCache(this, CACHE_KEY_PAGE_INDEX);
            const features = fromCache(this, CACHE_KEY_FEATURES);
            features.forEach((feature) => feature.update({ type: exports.UpdateType.SCROLL }));
            const { index } = this;
            const configuration = fromCache(this, CACHE_KEY_CONFIGURATION);
            configuration.onScroll({ index, type: EVENT_SCROLL, target: this, originalEvent: event });
        }
        _onResize() {
            clearCache(this, CACHE_KEY_PAGES);
            clearCache(this, CACHE_KEY_INDEX);
            clearCache(this, CACHE_KEY_PAGE_INDEX);
            const features = fromCache(this, CACHE_KEY_FEATURES);
            features.forEach((feature) => feature.update({ type: exports.UpdateType.RESIZE }));
        }
    }

    const version = '1.1.6';

    exports.Buttons = Buttons;
    exports.Carousel = Carousel;
    exports.Mask = Mask;
    exports.Mouse = Mouse;
    exports.Pagination = Pagination;
    exports.version = version;

    return exports;

})({});
