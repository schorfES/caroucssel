import { ICarousel, IFeature, Index, IProxy, Pages, UpdateType } from "./types";
import { fromCache, writeCache } from './utils/cache';


const CACHE_KEY_INSTANCE = 'inst';
const CACHE_KEY_FEATURES = 'feat';


/**
 * Helper to access the instance cache.
 * @internal
 */
function __getInstance(ref: Proxy): ICarousel {
	return fromCache<ICarousel>(ref, CACHE_KEY_INSTANCE) as ICarousel;
}


/**
 * Helper to access the features cache.
 * @internal
 */
function __getFeatures(ref: Proxy): IFeature[] {
	return fromCache<IFeature[]>(ref, CACHE_KEY_FEATURES) as IFeature[];
}

/**
 * A proxy instance between carousel and a feature. Restricts the access for
 * features to the carousel instance.
 */
export class Proxy implements IProxy {

	/**
	 * Creates an instance of the proxy.
	 * @param instance the carousel instance to proxy the access to.
	 * @param features all the features that should access the carousel through this instance.
	 */
	constructor(instance: ICarousel, features: IFeature[]) {
		writeCache(this, CACHE_KEY_INSTANCE, instance);
		writeCache(this, CACHE_KEY_FEATURES, features);
	}

	/**
	 * Proxies the {@link Carousel.id | `id`} getter of the carousel.
	 */
	public get id(): string {
		return __getInstance(this).id;
	}

	/**
	 * Proxies the {@link Carousel.el | `el`} getter of the carousel.
	 */
	public get el(): Element {
		return __getInstance(this).el;
	}

	/**
	 * Proxies the {@link Carousel.mask | `mask`} getter of the carousel.
	 */
	public get mask(): Element | null {
		return __getInstance(this).mask;
	}

	/**
	 * Proxies the {@link Carousel.index | `index`} getter of the carousel.
	 */
	public get index(): Index {
		return __getInstance(this).index;
	}

	/**
	 * Proxies the {@link Carousel.index | `index`} setter of the carousel.
	 */
	public set index(value: Index) {
		__getInstance(this).index = value;
	}

	/**
	 * Proxies the {@link Carousel.items | `items`} getter of the carousel.
	 */
	public get items(): HTMLElement[] {
		return __getInstance(this).items;
	}

	/**
	 * Proxies the {@link Carousel.pages | `pages`} getter of the carousel.
	 */
	public get pages(): Pages {
		return __getInstance(this).pages;
	}

	/**
	 * Proxies the {@link Carousel.pagesIndex | `pagesIndex`} getter of the carousel.
	 */
	public get pageIndex(): number {
		return __getInstance(this).pageIndex;
	}

	/**
	 * Function to trigger an update from a feature. This will send an update to
	 * the carousel instance and all other attached features exept the sender.
	 * @param sender feature that triggers the update.
	 */
	public update(sender: IFeature): void {
		__getInstance(this).update();

		// Trigger update in all other features except the source feature that
		// triggered the event:
		__getFeatures(this).forEach((feature): void => {
			if (feature === sender) {
				return;
			}

			feature.update({ type: UpdateType.FEATURE });
		});
	}

}
