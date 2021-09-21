import { IFeature, IProxy } from '../../types';
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

	nextClassName: string;
	nextLabel: string;
	nextTitle: string;

	previousClassName: string;
	previousLabel: string;
	previousTitle: string;
};

const DEFAULTS: Configuration = {
	template: ({ className, controls, label, title }: Params) => `
		<button type="button" class="${className}" aria-label="${label}" title="${title}" aria-controls="${controls}">
			<span>${label}</span>
		</button>
	`,
	className: 'button',

	nextClassName: 'is-next',
	nextLabel: 'Next',
	nextTitle: 'Go to next',

	previousClassName: 'is-previous',
	previousLabel: 'Previous',
	previousTitle: 'Go to previous',
};

const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_BUTTONS = 'buttons';

/**
 * The feature to enable button controls.
 */
export class Buttons implements IFeature {

	constructor(options: Partial<Configuration> = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
		this._onPrevious = this._onPrevious.bind(this);
		this._onNext = this._onNext.bind(this);
	}

	get name(): string {
		return 'buildin:buttons';
	}

	public init(proxy: IProxy): void {
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
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;

		const { el, mask, pages, pageIndex } = proxy;
		const target = mask ?? el;
		const {
			template, className,
			previousClassName, previousLabel, previousTitle,
			nextClassName, nextLabel, nextTitle,
		} = config;

		// Create button elements:
		const settings = [
			{
				controls: el.id,
				label: nextLabel,
				title: nextTitle,
				className: [className, nextClassName].join(' '),
				// eslint-disable-next-line @typescript-eslint/unbound-method
				handler: this._onNext,
			},
			{
				controls: el.id,
				label: previousLabel,
				title: previousTitle,
				className: [className, previousClassName].join(' '),
				// eslint-disable-next-line @typescript-eslint/unbound-method
				handler: this._onPrevious,
			},
		];

		const [next, previous] = fromCache<(HTMLButtonElement | null)[]>(
			this, 'buttons', () => settings.map(({ handler, ...params }) => {
				const button = render<HTMLButtonElement, Params>(template, params);
				if (!button) {
					return null;
				}

				button.addEventListener('click', handler);
				target.parentNode?.insertBefore(button, target.nextSibling);
				return button;
			}),
		);

		if (next) {
			const lastPage = pages[pageIndex + 1];
			const isLastPage = lastPage === undefined;
			next.disabled = isLastPage;
		}

		if (previous) {
			const firstPage = pages[pageIndex - 1];
			const isFirstPage = firstPage === undefined;
			previous.disabled = isFirstPage;
		}
	}

	private _remove(): void {
		const buttons = fromCache<(HTMLButtonElement | null)[]>(this, CACHE_KEY_BUTTONS);
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
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const { pages, pageIndex } = proxy;
		const index = pages[pageIndex - 1] || pages[0];
		proxy.index = index;
	}

	private _onNext(): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const { pages, pageIndex } = proxy;
		const index = pages[pageIndex + 1] || pages[pages.length - 1];
		proxy.index = index;
	}

}
