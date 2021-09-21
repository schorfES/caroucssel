import { ICarousel, IFeature, Index, IProxy, Pages, UpdateReason } from "./types";
import { fromCache, writeCache } from './utils/cache';


const CACHE_KEY_INSTANCE = 'instance';
const CACHE_KEY_FEATURES = 'features';


/**
 * A proxy instance between carousel and each feature.
 * @internal
 */
export class Proxy implements IProxy {

	constructor(instance: ICarousel, features: IFeature[]) {
		writeCache(this, CACHE_KEY_INSTANCE, instance);
		writeCache(this, CACHE_KEY_FEATURES, features);
	}

	public get el(): Element {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		return instance.el;
	}

	public get mask(): Element | null {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		return instance.mask;
	}

	public get index(): Index {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		return instance.index;
	}

	public set index(value: Index) {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		instance.index = value;
	}

	public get items(): HTMLElement[] {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		return instance.items;
	}

	public get pages(): Pages {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		return instance.pages;
	}

	public get pageIndex(): number {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		return instance.pageIndex;
	}

	public update(sender: IFeature): void {
		const instance = fromCache<ICarousel>(this, CACHE_KEY_INSTANCE) as ICarousel;
		instance.update();

		// Trigger update in all other features except the source feature that
		// triggered the event:
		const features = fromCache<IFeature[]>(this, CACHE_KEY_FEATURES) as IFeature[];
		features.forEach((feature): void => {
			if (feature === sender) {
				return;
			}

			feature.update({ reason: UpdateReason.FEATURE });
		});
	}

}
