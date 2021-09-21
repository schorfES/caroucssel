var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';
const DEFAULTS = {
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
const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_BUTTONS = 'buttons';
/**
 * The plugin to enable button controls.
 */
export class Buttons {
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
        this._onPrevious = this._onPrevious.bind(this);
        this._onNext = this._onNext.bind(this);
    }
    get name() {
        return 'buildin:buttons';
    }
    init(proxy) {
        writeCache(this, CACHE_KEY_PROXY, proxy);
        this._render();
    }
    destroy() {
        this._remove();
        clearFullCache(this);
    }
    update() {
        this._render();
    }
    _render() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const { el, mask, pages, pageIndex } = proxy;
        const target = mask !== null && mask !== void 0 ? mask : el;
        const { template, className, previousClassName, previousLabel, previousTitle, nextClassName, nextLabel, nextTitle, } = config;
        // Create button elements:
        const settings = [
            {
                controls: el.id,
                label: nextLabel,
                title: nextTitle,
                className: [className, nextClassName].join(' '),
                // eslint-disable-next-line @typescript-eslint/unbound-method
                handler: this._onNext,
            },
            {
                controls: el.id,
                label: previousLabel,
                title: previousTitle,
                className: [className, previousClassName].join(' '),
                // eslint-disable-next-line @typescript-eslint/unbound-method
                handler: this._onPrevious,
            },
        ];
        const [next, previous] = fromCache(this, 'buttons', () => settings.map((_a) => {
            var _b;
            var { handler } = _a, params = __rest(_a, ["handler"]);
            const button = render(template, params);
            if (!button) {
                return null;
            }
            button.addEventListener('click', handler);
            (_b = target.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(button, target.nextSibling);
            return button;
        }));
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
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        if (!buttons) {
            return;
        }
        buttons.forEach((button) => {
            var _a;
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button === null || button === void 0 ? void 0 : button.removeEventListener('click', this._onPrevious);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button === null || button === void 0 ? void 0 : button.removeEventListener('click', this._onNext);
            (_a = button === null || button === void 0 ? void 0 : button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
    }
    _onPrevious() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const { pages, pageIndex } = proxy;
        const index = pages[pageIndex - 1] || pages[0];
        proxy.index = index;
    }
    _onNext() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const { pages, pageIndex } = proxy;
        const index = pages[pageIndex + 1] || pages[pages.length - 1];
        proxy.index = index;
    }
}
