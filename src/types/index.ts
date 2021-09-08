export type Index = [number, ...number[]];

export type Pages = [Index, ...Index[]];

export type ButtonParams = {
	controls: string;
	className: string;
	label: string;
	title: string;
};

export type ButtonTemplate = (params: ButtonParams) => string;

export type ButtonOptions = {
	className?: string;
	label?: string;
	title?: string;
};

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

export type Options = {
	// Settings:
	index?: Index | number;

	// Buttons:
	hasButtons: boolean;
	buttonClassName: string;
	buttonTemplate: ButtonTemplate;
	buttonPrevious: ButtonOptions;
	buttonNext: ButtonOptions;

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
