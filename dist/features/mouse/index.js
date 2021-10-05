import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
const FEATURE_NAME = 'buildin:mouse';
const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_PAGE_INDEX = 'pgidx';
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
const THRESHOLD_FACTOR = 0.25; // Relative carousel element width
// We are ignoring this due to this whole feature is only here to make TS happy.
/* istanbul ignore next */
/**
 * Extracts the client x position from an event depending on the event type.
 * @internal
 * @param event the event
 * @returns the client x position
 */
function __getPositionX(event) {
    if (event instanceof MouseEvent) {
        return event.clientX;
    }
    return 0;
}
const DEFAULTS = {
    indicator: false,
};
/**
 * Feature to enable mouse controls
 */
export class Mouse {
    /**
     * Creates an instance of this feature.
     * @param options are the options to configure this instance
     */
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
        this._onStart = this._onStart.bind(this);
        this._onDrag = this._onDrag.bind(this);
        this._onEnd = this._onEnd.bind(this);
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
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const { el } = proxy;
        const element = el;
        element.style.cursor = config.indicator ? CURSOR_GRAB : '';
        // The handler is already bound in the constructor.
        //
        // eslint-disable-next-line @typescript-eslint/unbound-method
        el.addEventListener(EVENT_START, this._onStart, { passive: true });
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */
    destroy() {
        clearFullCache(this);
    }
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     */
    update() {
        /* nothing to update yet */
    }
    /**
     * Handles the drag start event.
     * @internal
     * @param event the event that triggered the drag start
     */
    _onStart(event) {
        var _a;
        const timeout = fromCache(this, CACHE_KEY_TIMEOUT);
        clearTimeout(timeout);
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const element = proxy.el;
        fromCache(this, CACHE_KEY_SCROLL_LEFT, () => element.scrollLeft);
        fromCache(this, CACHE_KEY_POSITION_X, () => __getPositionX(event));
        fromCache(this, CACHE_KEY_PAGE_INDEX, () => proxy.pageIndex);
        // Reset scroll behavior and scroll snapping to emulate regular scrolling.
        // Prevent user selection while the user drags:
        element.style.userSelect = 'none';
        element.style.scrollBehavior = 'auto';
        element.style.scrollSnapType = 'none';
        element.style.cursor = config.indicator ? CURSOR_GRABBING : '';
        // The handlers are already bound in the constructor.
        //
        /* eslint-disable @typescript-eslint/unbound-method */
        window.addEventListener(EVENT_DRAG, this._onDrag, { passive: true });
        window.addEventListener(EVENT_END, this._onEnd, { passive: true });
        /* eslint-enable @typescript-eslint/unbound-method */
        // Call the hook:
        (_a = config.onStart) === null || _a === void 0 ? void 0 : _a.call(config, { originalEvent: event });
    }
    /**
     * Handles the drag event. Calculates and updates scroll position.
     * @internal
     * @param event the event that triggered the dragging
     */
    _onDrag(event) {
        var _a;
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const { el } = fromCache(this, CACHE_KEY_PROXY);
        const left = fromCache(this, CACHE_KEY_SCROLL_LEFT);
        const x = fromCache(this, CACHE_KEY_POSITION_X);
        const currentX = __getPositionX(event);
        const deltaX = x - currentX;
        el.scrollLeft = left + deltaX;
        // Call the hook:
        (_a = config.onDrag) === null || _a === void 0 ? void 0 : _a.call(config, { originalEvent: event });
    }
    /**
     * Handles the drag end event.
     * @internal
     * @param event the event that triggered the drag end
     */
    _onEnd(event) {
        var _a, _b;
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const left = fromCache(this, CACHE_KEY_SCROLL_LEFT);
        const pageIndex = fromCache(this, CACHE_KEY_PAGE_INDEX);
        clearCache(this, CACHE_KEY_SCROLL_LEFT);
        clearCache(this, CACHE_KEY_POSITION_X);
        clearCache(this, CACHE_KEY_PAGE_INDEX);
        const element = proxy.el;
        const threshold = Math.min(Math.max(THRESHOLD_MIN, element.clientWidth * THRESHOLD_FACTOR), THRESHOLD_MAX);
        const currentLeft = element.scrollLeft;
        const distance = currentLeft - left;
        const offset = Math.abs(distance);
        element.style.removeProperty('user-select');
        element.style.removeProperty('scroll-behavior');
        element.style.cursor = config.indicator ? CURSOR_GRAB : '';
        // Apply the index. If the scroll offset is higher that the threshold,
        // navigate to the next page depending on the drag direction.
        let index = proxy.index;
        if (offset > threshold) {
            const direction = distance / offset;
            const at = Math.max(pageIndex + direction, 0);
            index = (_a = proxy.pages[at]) !== null && _a !== void 0 ? _a : index;
        }
        // Apply the index until the styles are rendered to the element. This is
        // required to have a smooth scroll-behaviour which is disabled during the
        // mouse dragging.
        window.requestAnimationFrame(() => {
            proxy.index = index;
        });
        // Get around the scroll-snapping. Enable it until the position is already
        // applied. This will take ~1000ms depending on distance and browser
        // behaviour.
        const timeout = window.setTimeout(() => {
            element.style.removeProperty('scroll-snap-type');
        }, 1000);
        writeCache(this, CACHE_KEY_TIMEOUT, timeout);
        // The handlers are already bound in the constructor.
        //
        /* eslint-disable @typescript-eslint/unbound-method */
        window.removeEventListener(EVENT_DRAG, this._onDrag);
        window.removeEventListener(EVENT_END, this._onEnd);
        /* eslint-enable @typescript-eslint/unbound-method */
        // Call the hook:
        (_b = config.onEnd) === null || _b === void 0 ? void 0 : _b.call(config, { originalEvent: event });
    }
}
