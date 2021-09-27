import { ICarousel, IFeature, Index, IProxy, Pages } from "./types";
/**
 * A proxy instance between carousel and a feature. Restricts the access for
 * features to the carousel instance.
 */
export declare class Proxy implements IProxy {
    /**
     * Creates an instance of the proxy.
     * @param instance the carousel instance to proxy the access to.
     * @param features all the features that should access the carousel through this instance.
     */
    constructor(instance: ICarousel, features: IFeature[]);
    /**
     * Proxies the {@link Carousel.id | `id`} getter of the carousel.
     */
    get id(): string;
    /**
     * Proxies the {@link Carousel.el | `el`} getter of the carousel.
     */
    get el(): Element;
    /**
     * Proxies the {@link Carousel.mask | `mask`} getter of the carousel.
     */
    get mask(): Element | null;
    /**
     * Proxies the {@link Carousel.index | `index`} getter of the carousel.
     */
    get index(): Index;
    /**
     * Proxies the {@link Carousel.index | `index`} setter of the carousel.
     */
    set index(value: Index);
    /**
     * Proxies the {@link Carousel.items | `items`} getter of the carousel.
     */
    get items(): HTMLElement[];
    /**
     * Proxies the {@link Carousel.pages | `pages`} getter of the carousel.
     */
    get pages(): Pages;
    /**
     * Proxies the {@link Carousel.pagesIndex | `pagesIndex`} getter of the carousel.
     */
    get pageIndex(): number;
    /**
     * Function to trigger an update from a feature. This will send an update to
     * the carousel instance and all other attached features exept the sender.
     * @param sender feature that triggers the update.
     */
    update(sender: IFeature): void;
}
