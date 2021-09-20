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

export type PaginationTextParams = {
	index: number;
	page: number[];
	pages: number[][];
};

export type PaginationText = (params: PaginationTextParams) => string;

export type PaginationParams = {
	controls: string;
	className: string;
	label: PaginationText;
	title: PaginationText;
	pages: number[][];
};

export type PaginationTemplate = (params: PaginationParams) => string;

export type PaginationLabelTemplate = PaginationText;

export type PaginationTitleTemplate = PaginationText;

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

	// Pagination:
	hasPagination: boolean;
	paginationClassName: string;
	paginationTemplate: PaginationTemplate;
	paginationLabel: PaginationLabelTemplate;
	paginationTitle: PaginationTitleTemplate;

	// Scrollbars:
	hasScrollbars: boolean;
	scrollbarsMaskClassName: string;

	// Filter:
	filterItem: FilterItemFn;

	// Hooks:
	onScroll: ScrollHook;
};

export type Options = Partial<Configuration>;
