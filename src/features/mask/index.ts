import { IFeature, IProxy, UpdateEvent, UpdateType } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';

import { Scrollbar } from './scrollbar';


const FEATURE_NAME = 'buildin:mask';

const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_MASK = 'mask';
const CACHE_KEY_HEIGHT = 'hght';


/**
 * The options for the mask and scrollbar features.
 */
export type Options = {

	/**
	 * Enables/disables the rendering of the mask to hide (enabled) or show
	 * (disabled) the browsers scrollbars.
	 * @defaultValue `true`
	 */
	enabled?: boolean;

	/**
	 * The class name of the mask element that will wrap the carousel element.
	 * @defaultValue `'caroucssel-mask'`
	 */
	className?: string;

	/**
	 * The tag name of the mask element that will wrap the carousel element.
	 * @defaultValue `'div'`
	 */
	tagName?: string;

};


/**
 * The required configuration for mask and scrollbar features.
 * @internal
 */
type Configuration = Required<Options>;


/**
 * Singleton of scrollbar util. Is shared across all instances of carousel to
 * reduce redundant calculations.
 * @internal
 */
let __scrollbar: Scrollbar;


const DEFAULTS: Configuration = {
	enabled: true,
	className: 'caroucssel-mask',
	tagName: 'div',
};


/**
 * The feature to enable/disabled mask and scrollbar support. This feature will
 * be added by default to each carousel. Use this feature to customize the
 * default behaviour.
 */
export class Mask implements IFeature {

	/**
	 * Creates an instance of this feature.
	 * @param options are the options to configure this instance
	 */
	constructor(options: Options = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
	}

	/**
	 * Returns the name of this feature.
	 */
	public get name(): typeof FEATURE_NAME {
		return FEATURE_NAME;
	}

	/**
	 * Returns the rendered element that wraps the carousel. If not enabled, this
	 * returns `null`.
	 * @return the mask element, otherwise `null` if disabled.
	 */
	public get el(): Element | null {
		return fromCache<Element>(this, CACHE_KEY_MASK) ?? null;
	}

	/**
	 * Initializes this feature. This function will be called by the carousel
	 * instance and should not be called manually.
	 * @internal
	 * @param proxy the proxy instance between carousel and feature
	 */
	public init(proxy: IProxy): void {
		writeCache(this, CACHE_KEY_PROXY, proxy);

		// Create a singleton instance of scrollbar for all carousel instances:
		__scrollbar = __scrollbar ?? new Scrollbar();

		this._render();
	}

	/**
	 * Destroys this feature. This function will be called by the carousel instance
	 * and should not be called manually.
	 * @internal
	 */
	public destroy(): void {
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
	public update(event: UpdateEvent): void {
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
	private _render(): void {
		const { enabled, className, tagName } = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		if (!enabled) {
			return;
		}

		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const element = proxy.el as HTMLElement | SVGElement;
		let { height } = __scrollbar.dimensions;

		if (element.scrollWidth <= element.clientWidth) {
			// If the contents are not scrollable because their width are less
			// than the container, there will be no visible scrollbar. In this
			// case, the scrollbar height is 0:
			height = 0;
		}

		// Use fromCache factory to render mask element only once:
		fromCache<Element>(this, CACHE_KEY_MASK, () => {
			const mask = document.createElement(tagName);
			mask.className = className;
			mask.style.overflow = 'hidden';
			mask.style.height = '100%';
			element.parentNode?.insertBefore(mask, element);
			mask.appendChild(element);
			return mask;
		});

		const cachedHeight = fromCache<number>(this, CACHE_KEY_HEIGHT);
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
	private _remove(): void {
		const { el } = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const mask = fromCache<HTMLDivElement>(this, CACHE_KEY_MASK);

		mask?.parentNode?.insertBefore(el, mask);
		mask?.parentNode?.removeChild(mask);
		el.removeAttribute('style');
	}

}
