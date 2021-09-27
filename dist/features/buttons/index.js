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
const FEATURE_NAME = 'buildin:buttons';
const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_BUTTONS = 'btns';
const EVENT_CLICK = 'click';
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
/**
 * The feature to enable button controls (next and previous) for a carousel.
 */
export class Buttons {
    /**
     * Creates an instance of this feature.
     * @param options are the options to configure this instance
     */
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
        this._onPrev = this._onPrev.bind(this);
        this._onNext = this._onNext.bind(this);
    }
    /**
     * Returns the name of this feature.
     */
    get name() {
        return FEATURE_NAME;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */
    init(proxy) {
        writeCache(this, CACHE_KEY_PROXY, proxy);
        this._render();
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */
    destroy() {
        this._remove();
        clearFullCache(this);
    }
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     */
    update( /* event :UpdateEvent */) {
        this._render();
    }
    /**
     * Renders and update the button elements. Buttons will only be rendered once
     * and then loaded from cache. When calling this function twice or more, the
     * button states will be updated based on the scroll position.
     * @internal
     */
    _render() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const { el, mask, pages, pageIndex } = proxy;
        // Render buttons only once. Load them from cache if already rendered and
        // attached to the dom:
        const [next, previous] = fromCache(this, CACHE_KEY_BUTTONS, () => {
            const target = mask !== null && mask !== void 0 ? mask : el;
            const { template, className, previousClassName, previousLabel, previousTitle, nextClassName, nextLabel, nextTitle, } = config;
            // Create button elements:
            const settings = [
                {
                    controls: el.id,
                    label: nextLabel,
                    title: nextTitle,
                    className: [className, nextClassName].join(' '),
                    // The onClick listener is already bound in the constructor.
                    //
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    handler: this._onNext,
                },
                {
                    controls: el.id,
                    label: previousLabel,
                    title: previousTitle,
                    className: [className, previousClassName].join(' '),
                    // The onClick listener is already bound in the constructor.
                    //
                    // eslint-disable-next-line @typescript-eslint/unbound-method
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
    /**
     * Removes all buttons from the dom and detaches all event handler.
     * @internal
     */
    _remove() {
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        buttons.forEach((button) => {
            var _a;
            // The onClick listener is already bound in the constructor.
            //
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, this._onPrev);
            // The onClick listener is already bound in the constructor.
            //
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, this._onNext);
            (_a = button === null || button === void 0 ? void 0 : button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
    }
    /**
     * Event handler to navigate backwards (to the left).
     * @internal
     */
    _onPrev() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const { pages, pageIndex } = proxy;
        const index = pages[pageIndex - 1] || pages[0];
        proxy.index = index;
    }
    /**
     * Event handler to navigate forwards (to the right).
     * @internal
     */
    _onNext() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const { pages, pageIndex } = proxy;
        const index = pages[pageIndex + 1] || pages[pages.length - 1];
        proxy.index = index;
    }
}
