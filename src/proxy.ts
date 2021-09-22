import { ICarousel, IFeature, Index, IProxy, Pages, UpdateReason } from "./types";
import { fromCache, writeCache } from './utils/cache';


const CACHE_KEY_INSTANCE = 'instance';
const CACHE_KEY_FEATURES = 'features';


function __getInstance(ref: Proxy): ICarousel {
	return fromCache<ICarousel>(ref, CACHE_KEY_INSTANCE) as ICarousel;
}

function __getFeatures(ref: Proxy): IFeature[] {
	return fromCache<IFeature[]>(ref, CACHE_KEY_FEATURES) as IFeature[];
}

/**
 * A proxy instance between carousel and each feature.
 * @internal
 */
export class Proxy implements IProxy {

	constructor(instance: ICarousel, features: IFeature[]) {
		writeCache(this, CACHE_KEY_INSTANCE, instance);
		writeCache(this, CACHE_KEY_FEATURES, features);
	}

	public get id(): string {
		return __getInstance(this).id;
	}

	public get el(): Element {
		return __getInstance(this).el;
	}

	public get mask(): Element | null {
		return __getInstance(this).mask;
	}

	public get index(): Index {
		return __getInstance(this).index;
	}

	public set index(value: Index) {
		__getInstance(this).index = value;
	}

	public get items(): HTMLElement[] {
		return __getInstance(this).items;
	}

	public get pages(): Pages {
		return __getInstance(this).pages;
	}

	public get pageIndex(): number {
		return __getInstance(this).pageIndex;
	}

	public update(sender: IFeature): void {
		__getInstance(this).update();

		// Trigger update in all other features except the source feature that
		// triggered the event:
		__getFeatures(this).forEach((feature): void => {
			if (feature === sender) {
				return;
			}

			feature.update({ reason: UpdateReason.FEATURE });
		});
	}

}
