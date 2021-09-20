import { Plugin, PluginProxy } from '../../types';
import { clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';


export type Params = {
	controls: string;
	className: string;
	label: string;
	title: string;
};

export type Template = (params: Params) => string;

export type Configuration = {
	template: Template;
	className: string;
	previousClassName: string;
	previousLabel: string;
	previousTitle: string;
	nextClassName: string;
	nextLabel: string;
	nextTitle: string;
};

const DEFAULTS: Configuration = {
	template: ({ className, controls, label, title }: Params) => `
		<button type="button" class="${className}" aria-label="${label}" title="${title}" aria-controls="${controls}">
			<span>${label}</span>
		</button>
	`,

	className: 'button',

	previousClassName: 'is-previous',
	previousLabel: 'Previous',
	previousTitle: 'Go to previous',

	nextClassName: 'is-next',
	nextLabel: 'Next',
	nextTitle: 'Go to next',
};

const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';

/**
 * The plugin to enable button controls.
 */
export class Buttons implements Plugin {

	constructor(options: Partial<Configuration> = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
		this._onPrevious = this._onPrevious.bind(this);
		this._onNext = this._onNext.bind(this);
	}

	get name(): string {
		return 'buildin:buttons';
	}

	public init(proxy: PluginProxy): void {
		writeCache(this, CACHE_KEY_PROXY, proxy);
		this._render();
	}

	public destroy(): void {
		this._remove();
		clearFullCache(this);
	}

	public update(): void {
		this._render();
	}

	private _render(): void {
		const proxy = fromCache<PluginProxy>(this, CACHE_KEY_PROXY) as PluginProxy;
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;

		const { el, pages, pageIndex } = proxy;
		const {
			template, className,
			previousClassName, previousLabel, previousTitle,
			nextClassName, nextLabel, nextTitle,
		} = config;

		// Create button elements:
		const settings = [
			{
				controls: el.id,
				label: previousLabel,
				title: previousTitle,
				className: [className, previousClassName].join(' '),
				// eslint-disable-next-line @typescript-eslint/unbound-method
				handler: this._onPrevious,
			},
			{
				controls: el.id,
				label: nextLabel,
				title: nextTitle,
				className: [className, nextClassName].join(' '),
				// eslint-disable-next-line @typescript-eslint/unbound-method
				handler: this._onNext,
			},
		];

		const [previous, next] = fromCache<(HTMLButtonElement | null)[]>(
			this, 'buttons', () => settings.map(({ handler, ...params }) => {
				const button = render<HTMLButtonElement, Params>(template, params);
				if (!button) {
					return null;
				}

				button.addEventListener('click', handler);
				// @TODO: Check where to add: Mask or Element?
				// el.parentNode?.insertBefore(button, el.nextSibling);
				el.parentNode?.appendChild(button);
				return button;
			}),
		);

		if (previous) {
			const firstPage = pages[pageIndex - 1];
			const isFirstPage = firstPage === undefined;
			previous.disabled = isFirstPage;
		}

		if (next) {
			const lastPage = pages[pageIndex + 1];
			const isLastPage = lastPage === undefined;
			next.disabled = isLastPage;
		}
	}

	private _remove(): void {
		const buttons = fromCache<(HTMLButtonElement | null)[]>(this, 'buttons');
		if (!buttons) {
			return;
		}

		buttons.forEach((button): void => {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			button?.removeEventListener('click', this._onPrevious);
			// eslint-disable-next-line @typescript-eslint/unbound-method
			button?.removeEventListener('click', this._onNext);
			button?.parentNode?.removeChild(button);
		});
	}

	private _onPrevious(): void {
		const proxy = fromCache<PluginProxy>(this, CACHE_KEY_PROXY) as PluginProxy;
		const { pages, pageIndex } = proxy;
		const index = pages[pageIndex - 1] || pages[0];
		proxy.index = index;
	}

	private _onNext(): void {
		const proxy = fromCache<PluginProxy>(this, CACHE_KEY_PROXY) as PluginProxy;
		const { pages, pageIndex } = proxy;
		const index = pages[pageIndex + 1] || pages[pages.length - 1];
		proxy.index = index;
	}

}
