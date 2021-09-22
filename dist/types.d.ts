export declare type Index = [number, ...number[]];
export declare type Pages = [Index, ...Index[]];
interface ICore {
    get id(): string;
    get el(): Element;
    get mask(): Element | null;
    get index(): Index;
    set index(value: Index);
    get items(): HTMLElement[];
    get pages(): Pages;
    get pageIndex(): number;
}
export interface ICarousel extends ICore {
    behavior: ScrollBehavior;
    destroy(): void;
    update(): void;
}
export interface IProxy extends ICore {
    update(sender: IFeature): void;
}
export interface IFeature {
    get name(): string;
    init(proxy: IProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
}
export declare enum UpdateReason {
    SCROLL = "scroll",
    RESIZE = "resize",
    FORCED = "forced",
    FEATURE = "feature"
}
export declare type UpdateData = {
    reason: UpdateReason;
};
export declare enum ScrollBehavior {
    AUTO = "auto",
    SMOOTH = "smooth"
}
export declare type ScrollHook = <T>(event: {
    index: Index;
    type: 'scroll';
    target: T;
    originalEvent: Event;
}) => void;
export declare type FilterItemFn = ((item: HTMLElement) => boolean) | ((item: HTMLElement, index: number) => boolean) | ((item: HTMLElement, index: number, array: HTMLElement[]) => boolean);
export declare type Configuration = {
    features: IFeature[];
    filterItem: FilterItemFn;
    onScroll: ScrollHook;
};
export declare type Options = Partial<Configuration> & {
    index?: Index | number;
};
export {};
