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

export type ScrollHook = (event: {
	index: number[];
	type: 'scroll';
	target: Carousel;
	originalEvent: Event;
}) => any;

export type Options = {
	// Settings:
	index?: number;

	// Buttons:
	hasButtons?: boolean;
	buttonClassName?: string;
	buttonTemplate?: ButtonTemplate;
	buttonPrevious?: ButtonOptions;
	buttonNext?: ButtonOptions;

	// Pagination:
	hasPagination?: boolean;
	paginationClassName?: string;
	paginationTemplate?: PaginationTemplate;
	paginationLabel?: PaginationLabelTemplate;
	paginationTitle?: PaginationTitleTemplate;

	// Scrollbars:
	hasScrollbars?: boolean;

	// Hooks:
	onScroll?: ScrollHook;
};

export class Carousel {
	constructor(el: Element, options: Options);
	public get el(): Element;
	public get id(): string;
	public get index(): number[];
	public set index(values: number[]);
	public get items(): Element[];
	public get pages(): number[][];
	public destroy(): void;
	public update(): void;

	protected _updateScrollbars(): void;
	protected _addButtons(): void;
	protected _updateButtons(index: number[]): void;
	protected _removeButtons(): void;
	protected _addPagination(): void;
	protected _updatePagination(index: number[]): void;
	protected _removePagination(): void;
	protected _onScroll(event: Event): void;
	protected _onResize(event: Event): void;
}
