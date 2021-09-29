import { IFeature, IProxy } from '../../types';
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


/**
 * Extracts the client x position from an event depending on the event type.
 * @internal
 * @param event the event
 * @returns the client x position
 */
function __getPositionX(event: Event): number {
	if (event instanceof MouseEvent) {
		return event.clientX;
	}

	if (event instanceof PointerEvent) {
		return event.clientX;
	}

	if (event instanceof TouchEvent) {
		return event.touches[0].clientX;
	}

	return 0;
}


/**
 * The options for the pagination feature.
 */
export type Options = {

	/**
	 * Show a drag indicator using css cursor properties (grab and grabbing).
	 */
	indicator?: boolean;

	/**
	 * A hook function that is called when the user stats to drag.
	 */
	onStart?: ((event: HookEvent) => void);

	/**
	 * A hook function that is called when the user is dragging.
	 */
	onDrag?: ((event: HookEvent) => void);

	/**
	 * A hook function that is called when the user stops to drag.
	 */
	onEnd?: ((event: HookEvent) => void);

};

/**
 * The event object that is passed for each hook.
 */
export type HookEvent = {
	originalEvent: Event,
};

/**
 * The keys in the options that are hooks.
 * @internal
 */
type Hooks = 'onStart' | 'onDrag' | 'onEnd';


/**
 * The required configuration for pagination feature.
 * @internal
 */
type Configuration =
	Omit<Required<Options>, Hooks> &
	Omit<Options, Exclude<keyof Options, Hooks>>;


const DEFAULTS: Configuration = {
	indicator: true,
};


/**
 * Feature to enable mouse controls
 * @experimental
 */
export class Mouse implements IFeature {

	/**
	 * Creates an instance of this feature.
	 * @param options are the options to configure this instance
	 */
	constructor(options: Options = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
		this._onStart = this._onStart.bind(this);
		this._onDrag = this._onDrag.bind(this);
		this._onEnd = this._onEnd.bind(this);
	}

	/**
	 * Returns the name of this feature.
	 */
	get name(): typeof FEATURE_NAME {
		return FEATURE_NAME;
	}

	/**
	 * Initializes this feature. This function will be called by the carousel
	 * instance and should not be called manually.
	 * @internal
	 * @param proxy the proxy instance between carousel and feature
	 */
	public init(proxy: IProxy): void {
		writeCache(this, CACHE_KEY_PROXY, proxy);

		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		const { el } = proxy;
		const element = el as HTMLElement;
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
	public destroy(): void {
		clearFullCache(this);
	}

	/**
	 * This triggers the feature to update its inner state. This function will be
	 * called by the carousel instance and should not be called manually. The
	 * carousel passes a event object that includes the update reason. This can be
	 * used to selectively/partially update sections of the feature.
	 * @internal
	 */
	public update(): void {
		/* nothing to update yet */
	}

	/**
	 * Handles the drag start event.
	 * @internal
	 * @param event the event that triggered the drag start
	 */
	private _onStart(event: Event): void {
		const timeout = fromCache<number>(this, CACHE_KEY_TIMEOUT);
		clearTimeout(timeout);

		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const element = proxy.el as HTMLElement;
		fromCache(this, CACHE_KEY_SCROLL_LEFT, (): number => element.scrollLeft);
		fromCache(this, CACHE_KEY_POSITION_X, (): number => __getPositionX(event));
		fromCache(this, CACHE_KEY_PAGE_INDEX, (): number => proxy.pageIndex);

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
		config.onStart?.({ originalEvent: event });
	}

	/**
	 * Handles the drag event. Calculates and updates scroll position.
	 * @internal
	 * @param event the event that triggered the dragging
	 */
	private _onDrag(event: Event): void {
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		const { el } = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const left = fromCache<number>(this, CACHE_KEY_SCROLL_LEFT) as number;
		const x = fromCache<number>(this, CACHE_KEY_POSITION_X) as number
		const currentX = __getPositionX(event);
		const deltaX = x - currentX;

		el.scrollLeft = left + deltaX;

		// Call the hook:
		config.onDrag?.({ originalEvent: event });
	}

	/**
	 * Handles the drag end event.
	 * @internal
	 * @param event the event that triggered the drag end
	 */
	private _onEnd(event: Event): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		const left = fromCache(this, CACHE_KEY_SCROLL_LEFT) as number;
		const pageIndex = fromCache(this, CACHE_KEY_PAGE_INDEX) as number;
		clearCache(this, CACHE_KEY_SCROLL_LEFT);
		clearCache(this, CACHE_KEY_POSITION_X);
		clearCache(this, CACHE_KEY_PAGE_INDEX);

		const element = proxy.el as HTMLElement;
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
			index = proxy.pages[at] ?? index;
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
		config.onEnd?.({ originalEvent: event });
	}

}
