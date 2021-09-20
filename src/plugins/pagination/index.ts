import { Plugin, PluginProxy, UpdateData, UpdateReason } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';


export type Params = {
	controls: string;
	className: string;
	label: TextTemplate;
	title: TextTemplate;
	pages: number[][];
};

export type TextParams = {
	index: number;
	page: number[];
	pages: number[][];
};

export type Template = (params: Params) => string;

export type TextTemplate = (params: TextParams) => string;

export type Configuration = {
	template: Template;
	className: string;
	label: TextTemplate;
	title: TextTemplate;
};

const DEFAULTS: Configuration = {
	template: ({ className, controls, pages, label, title }: Params) => `
		<ul class="${className}">
			${pages.map((page, index) => {
				const data = { index, page, pages };
				const labelStr = label(data);
				const titleStr = title(data);
				return `<li>
					<button type="button" aria-controls="${controls}" aria-label="${titleStr}" title="${titleStr}">
						<span>${labelStr}</span>
					</button>
				</li>`;
			}).join('')}
		</ul>
	`,

	className: 'pagination',
	label: ({ index }) => `${index + 1}`,
	title: ({ index }) => `Go to ${index + 1}. page`,
};

const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_PAGINATION = 'pagination';
const CACHE_KEY_BUTTONS = 'buttons';

/**
 * The plugin to enable pagination controls.
 */
export class Pagination implements Plugin {

	constructor(options: Partial<Configuration> = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
		this._onClick = this._onClick.bind(this);
	}

	get name(): string {
		return 'buildin:pagination';
	}

	public init(proxy: PluginProxy): void {
		writeCache(this, CACHE_KEY_PROXY, proxy);
		this._add();
	}

	public destroy(): void {
		this._remove();
		clearFullCache(this);
	}

	public update(data: UpdateData): void {
		switch (data.reason) {
			case UpdateReason.SCROLL:
				this._update();
				break;
			default:
				this._remove();
				this._add();
				break;
		}
	}

	private _add(): void {
		const proxy = fromCache<PluginProxy>(this, CACHE_KEY_PROXY) as PluginProxy;
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		const { el, pages } = proxy;

		if (pages.length < 2) {
			return;
		}

		const { template, className, label, title } = config;
		const pagination = render(template, { label, title, pages, className, controls: el.id });

		if (!pagination) {
			return;
		}

		// @TODO: Add template for buttons:
		const buttons = Array.from(pagination.querySelectorAll<HTMLButtonElement>('button'))
			.map((button) => {
				// eslint-disable-next-line @typescript-eslint/unbound-method
				button.addEventListener('click', this._onClick, true);
				return button;
			});

		// @TODO: Check where to add: Mask or Element?
		el.parentNode?.appendChild(pagination);
		writeCache(this, CACHE_KEY_PAGINATION, pagination);
		writeCache(this, CACHE_KEY_BUTTONS, buttons);

		this._update();
	}

	private _update(): void {
		const proxy = fromCache<PluginProxy>(this, CACHE_KEY_PROXY) as PluginProxy;
		const buttons = fromCache<HTMLButtonElement[]>(this, CACHE_KEY_BUTTONS);

		const { pageIndex } = proxy;
		buttons?.forEach((button, at) => button.disabled = (at === pageIndex));
	}

	private _remove(): void {
		const pagination = fromCache<HTMLElement>(this, CACHE_KEY_PAGINATION);
		const buttons = fromCache<HTMLButtonElement[]>(this, CACHE_KEY_BUTTONS);

		buttons?.forEach((button) => {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			button.removeEventListener('click', this._onClick);
			button.parentNode?.removeChild(button);
		});
		pagination?.parentNode?.removeChild(pagination);

		clearCache(this, CACHE_KEY_BUTTONS);
		clearCache(this, CACHE_KEY_PAGINATION);
	}

	private _onClick(event: MouseEvent): void {
		const proxy = fromCache<PluginProxy>(this, CACHE_KEY_PROXY) as PluginProxy;
		const buttons = fromCache<HTMLButtonElement[]>(this, CACHE_KEY_BUTTONS);
		const target = event.currentTarget as HTMLButtonElement;
		const index = buttons?.indexOf(target) ?? 0;
		proxy.index = proxy.pages[index];
	}

}
