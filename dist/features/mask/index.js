import { UpdateType } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { Scrollbar } from './scrollbar';
const FEATURE_NAME = 'buildin:mask';
const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_MASK = 'mask';
const CACHE_KEY_HEIGHT = 'hght';
/**
 * Singleton of scrollbar util. Is shared across all instances of carousel to
 * reduce redundant calculations.
 * @internal
 */
let __scrollbar;
const DEFAULTS = {
    enabled: true,
    className: 'caroucssel-mask',
    tagName: 'div',
};
/**
 * The feature to enable/disabled mask and scrollbar support. This feature will
 * be added by default to each carousel. Use this feature to customize the
 * default behaviour.
 */
export class Mask {
    /**
     * Creates an instance of this feature.
     * @param options are the options to configure this instance
     */
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
    }
    /**
     * Returns the name of this feature.
     */
    get name() {
        return FEATURE_NAME;
    }
    /**
     * Returns the rendered element that wraps the carousel. If not enabled, this
     * returns `null`.
     * @return the mask element, otherwise `null` if disabled.
     */
    get el() {
        var _a;
        return (_a = fromCache(this, CACHE_KEY_MASK)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */
    init(proxy) {
        writeCache(this, CACHE_KEY_PROXY, proxy);
        // Create a singleton instance of scrollbar for all carousel instances:
        __scrollbar = __scrollbar !== null && __scrollbar !== void 0 ? __scrollbar : new Scrollbar();
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
     * @param event event that triggered the update
     * @param event.reason is the update reason (why this was triggered)
     */
    update(event) {
        switch (event.type) {
            case UpdateType.RESIZE:
            case UpdateType.FORCED:
                clearCache(this, CACHE_KEY_HEIGHT);
                this._render();
                break;
            default:
                this._render();
                break;
        }
    }
    /**
     * Renders the mask element, wraps the carousel element and crops the
     * height of the browsers scrollbar.
     * @internal
     */
    _render() {
        const { enabled, className, tagName } = fromCache(this, CACHE_KEY_CONFIGURATION);
        if (!enabled) {
            return;
        }
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const element = proxy.el;
        let { height } = __scrollbar.dimensions;
        if (element.scrollWidth <= element.clientWidth) {
            // If the contents are not scrollable because their width are less
            // than the container, there will be no visible scrollbar. In this
            // case, the scrollbar height is 0:
            height = 0;
        }
        // Use fromCache factory to render mask element only once:
        fromCache(this, CACHE_KEY_MASK, () => {
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
    /**
     * Removes the mask element and unwraps the carousel element.
     * @internal
     */
    _remove() {
        var _a, _b;
        const { el } = fromCache(this, CACHE_KEY_PROXY);
        const mask = fromCache(this, CACHE_KEY_MASK);
        (_a = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, mask);
        (_b = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(mask);
        el.removeAttribute('style');
    }
}
