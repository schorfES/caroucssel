import { IFeature, IProxy, UpdateData, UpdateReason } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';

import { Scrollbar } from './scrollbar';


export type Configuration = {
	enabled: boolean;
	className: string;
	tagName: string;
};

/*
 * Singleton of scrollbar util. Is shared across all instances of carousel to
 * reduce redundant calculations.
 */
let __scrollbar: Scrollbar;

const DEFAULTS: Configuration = {
	enabled: true,
	className: 'caroucssel-mask',
	tagName: 'div',
};

const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_MASK = 'mask';
const CACHE_KEY_HEIGHT = 'scrollbar';

/**
 * The feature to enable/disabled mask and scrollbar features. This feature will
 * be added by default to each carousel. Use this feature to customize the default behaviour.
 */
export class Mask implements IFeature {

	constructor(options: Partial<Configuration> = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
	}

	get name(): string {
		return 'buildin:mask';
	}

	get el(): Element | null {
		return fromCache<Element>(this, CACHE_KEY_MASK) ?? null;
	}

	public init(proxy: IProxy): void {
		writeCache(this, CACHE_KEY_PROXY, proxy);

		// Create a singleton instance of scrollbar for all carousel instances:
		__scrollbar = __scrollbar || new Scrollbar();

		this._render();
	}

	public destroy(): void {
		this._remove();
		clearFullCache(this);
	}

	public update(data: UpdateData): void {
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

	private _remove(): void {
		const { el } = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const mask = fromCache<HTMLDivElement>(this, CACHE_KEY_MASK);

		mask?.parentNode?.insertBefore(el, mask);
		mask?.parentNode?.removeChild(mask);
		el.removeAttribute('style');
	}

}
