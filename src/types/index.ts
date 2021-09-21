export type Index = [number, ...number[]];

export type Pages = [Index, ...Index[]];

export enum UpdateReason {
	SCROLL = 'scroll',
	RESIZE = 'resize',
	FORCED = 'forced',
	PLUGIN = 'plugin',
}

export type UpdateData = {
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
	update(data :UpdateData): void;
}

export type ScrollHook = <T>(event: {
	index: number[];
	type: 'scroll';
	target: T;
	originalEvent: Event;
}) => void;

export type FilterItemFn =
	((item: HTMLElement) => boolean) |
	((item: HTMLElement, index: number) => boolean) |
	((item: HTMLElement, index: number, array: HTMLElement[]) => boolean);

export type Configuration = {
	// Settings:
	index?: Index | number;

	// Plugins:
	plugins: Plugin[],

	// Filter:
	filterItem: FilterItemFn;

	// Hooks:
	onScroll: ScrollHook;
};

export type Options = Partial<Configuration>;
