import { CarouselCore, CarouselPlugin, CarouselProxy, Index, Pages, UpdateReason } from "./types";
import { fromCache, writeCache } from './utils/cache';


const CACHE_KEY_INSTANCE = 'instance';
const CACHE_KEY_PLUGINS = 'plugins';


/**
 * A proxy instance between carousel and each plugin.
 * @internal
 */
export class Proxy implements CarouselProxy {

	constructor(instance: CarouselCore, plugins: CarouselPlugin[]) {
		writeCache(this, CACHE_KEY_INSTANCE, instance);
		writeCache(this, CACHE_KEY_PLUGINS, plugins);
	}

	public get el(): Element {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		return instance.el;
	}

	public get mask(): Element | null {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		return instance.mask;
	}

	public get index(): Index {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		return instance.index;
	}

	public set index(value: Index) {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		instance.index = value;
	}

	public get items(): HTMLElement[] {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		return instance.items;
	}

	public get pages(): Pages {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		return instance.pages;
	}

	public get pageIndex(): number {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		return instance.pageIndex;
	}

	public update(sender: CarouselPlugin): void {
		const instance = fromCache<CarouselCore>(this, CACHE_KEY_INSTANCE) as CarouselCore;
		instance.update();

		// Trigger update in all other plugins except the source plugin that
		// triggered the event:
		const plugins = fromCache<CarouselPlugin[]>(this, CACHE_KEY_PLUGINS) as CarouselPlugin[];
		plugins.forEach((plugin): void => {
			if (plugin === sender) {
				return;
			}

			plugin.update({ reason: UpdateReason.PLUGIN });
		});
	}

}
