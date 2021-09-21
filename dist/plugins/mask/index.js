import { UpdateReason } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { Scrollbar } from '../../utils/scrollbar';
/*
 * Singleton of scrollbar util. Is shared across all instances of carousel to
 * reduce redundant calculations.
 */
let __scrollbar;
const DEFAULTS = {
    enabled: true,
    // @TODO: customize class name
    // className: 'caroucssel-mask',
    // @TODO: customize tag name
    // tagName: 'div',
};
const CLASSNAME = 'caroucssel-mask';
const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_MASK = 'mask';
const CACHE_KEY_HEIGHT = 'scrollbar';
/**
 * The plugin to enable/disabled mask and scrollbar features. This plugin will
 * be added by default to each carousel. Use this plugin to customize the default behaviour.
 */
export class Mask {
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
    }
    get name() {
        return 'buildin:mask';
    }
    get el() {
        var _a;
        return (_a = fromCache(this, CACHE_KEY_MASK)) !== null && _a !== void 0 ? _a : null;
    }
    init(proxy) {
        writeCache(this, CACHE_KEY_PROXY, proxy);
        // Create a singleton instance of scrollbar for all carousel instances:
        __scrollbar = __scrollbar || new Scrollbar();
        this._render();
    }
    destroy() {
        this._remove();
        clearFullCache(this);
    }
    update(data) {
        switch (data.reason) {
            case UpdateReason.RESIZE:
            case UpdateReason.FORCED:
                clearCache(this, CACHE_KEY_HEIGHT);
                this._render();
                break;
            default:
                this._render();
                break;
        }
    }
    _render() {
        const { enabled } = fromCache(this, CACHE_KEY_CONFIGURATION);
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
        // Use from cache factory to render mask element only once:
        fromCache(this, CACHE_KEY_MASK, () => {
            var _a;
            const mask = document.createElement('div');
            mask.className = CLASSNAME;
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
        const { el } = fromCache(this, CACHE_KEY_PROXY);
        const mask = fromCache(this, CACHE_KEY_MASK);
        (_a = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, mask);
        (_b = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(mask);
        el.removeAttribute('style');
    }
}
