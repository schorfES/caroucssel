export type Index = [number, ...number[]];

export type Pages = [Index, ...Index[]];

interface Carousel {
	get el(): Element;
	get mask(): Element | null;
	get index(): Index;
	set index(value: Index);
	get items(): HTMLElement[];
	get pages(): Pages;
	get pageIndex(): number;
}

export interface CarouselCore extends Carousel {
	behavior: ScrollBehavior;
	destroy(): void;
	update(): void;
}

export interface CarouselProxy extends Carousel {
	update(sender: CarouselPlugin): void;
}

export interface CarouselPlugin {
	get name(): string;

	init(proxy: CarouselProxy): void;
	destroy(): void;
	update(data :UpdateData): void;
}

export enum UpdateReason {
	SCROLL = 'scroll',
	RESIZE = 'resize',
	FORCED = 'forced',
	PLUGIN = 'plugin',
}

export type UpdateData = {
	reason: UpdateReason;
};



export enum ScrollBehavior {
	AUTO = 'auto',
	SMOOTH = 'smooth',
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
	plugins: CarouselPlugin[],

	// Filter:
	filterItem: FilterItemFn;

	// Hooks:
	onScroll: ScrollHook;
};

export type Options = Partial<Configuration>;
