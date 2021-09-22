import { ICarousel, IFeature, Index, IProxy, Pages } from "./types";
/**
 * A proxy instance between carousel and each feature.
 * @internal
 */
export declare class Proxy implements IProxy {
    constructor(instance: ICarousel, features: IFeature[]);
    get id(): string;
    get el(): Element;
    get mask(): Element | null;
    get index(): Index;
    set index(value: Index);
    get items(): HTMLElement[];
    get pages(): Pages;
    get pageIndex(): number;
    update(sender: IFeature): void;
}
