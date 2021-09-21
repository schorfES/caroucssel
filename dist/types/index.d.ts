export declare type Index = [number, ...number[]];
export declare type Pages = [Index, ...Index[]];
export declare enum UpdateReason {
    SCROLL = "scroll",
    RESIZE = "resize",
    FORCED = "forced",
    PLUGIN = "plugin"
}
export declare type UpdateData = {
    reason: UpdateReason;
};
export interface PluginProxy {
    get el(): Element;
    get mask(): Element | null;
    get index(): Index;
    set index(value: Index);
    get items(): HTMLElement[];
    get pages(): Pages;
    get pageIndex(): number;
    update(plugin: Plugin): void;
}
export interface Plugin {
    get name(): string;
    init(proxy: PluginProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
}
export declare enum ScrollBehavior {
    AUTO = "auto",
    SMOOTH = "smooth"
}
export declare type ScrollHook = <T>(event: {
    index: number[];
    type: 'scroll';
    target: T;
    originalEvent: Event;
}) => void;
export declare type FilterItemFn = ((item: HTMLElement) => boolean) | ((item: HTMLElement, index: number) => boolean) | ((item: HTMLElement, index: number, array: HTMLElement[]) => boolean);
export declare type Configuration = {
    index?: Index | number;
    plugins: Plugin[];
    filterItem: FilterItemFn;
    onScroll: ScrollHook;
};
export declare type Options = Partial<Configuration>;
