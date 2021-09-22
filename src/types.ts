export type Index = [number, ...number[]];

export type Pages = [Index, ...Index[]];

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
	update(data :UpdateData): void;
}

export enum UpdateReason {
	SCROLL = 'scroll',
	RESIZE = 'resize',
	FORCED = 'forced',
	FEATURE = 'feature',
}

export type UpdateData = {
	reason: UpdateReason;
};

export enum ScrollBehavior {
	AUTO = 'auto',
	SMOOTH = 'smooth',
}

export type ScrollHook = <T>(event: {
	index: Index;
	type: 'scroll';
	target: T;
	originalEvent: Event;
}) => void;

export type FilterItemFn =
	((item: HTMLElement) => boolean) |
	((item: HTMLElement, index: number) => boolean) |
	((item: HTMLElement, index: number, array: HTMLElement[]) => boolean);

export type Configuration = {
	features: IFeature[],
	filterItem: FilterItemFn;
	onScroll: ScrollHook;
};

export type Options = Partial<Configuration> & {
	index?: Index | number;
};
