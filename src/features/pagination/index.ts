import { IFeature, IProxy, UpdateEvent, UpdateType } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';


const FEATURE_NAME = 'buildin:pagination';

const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_PAGINATION = 'pags';
const CACHE_KEY_BUTTONS = 'btns';


/**
 * The template function to render a HTML markup of a pagination.
 * @param context the template context containing the required data to render
 * @return the HTML markup
 */
export type Template = (params: Context) => string;


/**
 * The template rendering context.
 */
export type Context = {
	controls: string;
	className: string;
	label: TextTemplate;
	title: TextTemplate;
	pages: number[][];
};


/**
 * A text template function to render a text node. This will be used for button
 * labels and text-attributes inside the pagination
 */
export type TextTemplate = (params: TextContext) => string;


/**
 * The text template rendering context.
 */
export type TextContext = {
	index: number;
	page: number[];
	pages: number[][];
};


/**
 * The options for the pagination feature.
 */
export type Options = {

	/**
	 * Render function for the pagination elemements.
	 */
	template?: Template;

	/**
	 * The class name the pagination element.
	 * @defaultValue `'pagination'`
	 */
	className?: string;

	/**
	 * Render function for each button label inside the pagination.
	 */
	label?: TextTemplate;

	/**
	 * Render function for each button title attribute inside the pagination.
	 */
	title?: TextTemplate;

};


/**
 * The required configuration for pagination feature.
 * @internal
 */
type Configuration = Required<Options>;


const DEFAULTS: Configuration = {
	template: ({ className, controls, pages, label, title }: Context) => `
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


/**
 * The feature to enable pagination controls.
 */
export class Pagination implements IFeature {

	/**
	 * Creates an instance of this feature.
	 * @param options are the options to configure this instance
	 */
	constructor(options: Options = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
		this._onClick = this._onClick.bind(this);
	}

	/**
	 * Returns the name of this feature.
	 */
	public get name(): typeof FEATURE_NAME {
		return FEATURE_NAME;
	}

	/**
	 * Initializes this feature. This function will be called by the carousel
	 * instance and should not be called manually.
	 * @internal
	 * @param proxy the proxy instance between carousel and feature
	 */
	public init(proxy: IProxy): void {
		writeCache(this, CACHE_KEY_PROXY, proxy);
		this._add();
	}

	/**
	 * Destroys this feature. This function will be called by the carousel instance
	 * and should not be called manually.
	 * @internal
	 */
	public destroy(): void {
		this._remove();
		clearFullCache(this);
	}

	/**
	 * This triggers the feature to update its inner state. This function will be
	 * called by the carousel instance and should not be called manually. The
	 * carousel passes a event object that includes the update reason. This can be
	 * used to selectively/partially update sections of the feature.
	 * @internal
	 * @param event event that triggered the update
	 * @param event.type is the update reason (why this was triggered)
	 */
	public update(event: UpdateEvent): void {
		switch (event.type) {
			case UpdateType.SCROLL:
				this._update();
				break;
			default:
				this._remove();
				this._add();
				break;
		}
	}

	/**
	 * Renders and adds the pagination element. Attaches event handlers to all
	 * button elements.
	 * @internal
	 */
	private _add(): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;
		const { el, mask, pages } = proxy;
		const target = mask ?? el;

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
				// The onClick listener was already bound in the constructor.
				//
				// eslint-disable-next-line @typescript-eslint/unbound-method
				button.addEventListener('click', this._onClick, true);
				return button;
			});

		target.parentNode?.appendChild(pagination);
		writeCache(this, CACHE_KEY_PAGINATION, pagination);
		writeCache(this, CACHE_KEY_BUTTONS, buttons);

		this._update();
	}

	/**
	 * Updates the states of all buttons inside the pagination.
	 * @internal
	 */
	private _update(): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const buttons = fromCache<HTMLButtonElement[]>(this, CACHE_KEY_BUTTONS) as HTMLButtonElement[];

		const { pageIndex } = proxy;
		buttons.forEach((button, at) => button.disabled = (at === pageIndex));
	}

	/**
	 * Removes the whole pagination element and removes all attached event handlers.
	 * @internal
	 */
	private _remove(): void {
		const pagination = fromCache<HTMLElement>(this, CACHE_KEY_PAGINATION);
		const buttons = fromCache<HTMLButtonElement[]>(this, CACHE_KEY_BUTTONS);

		buttons?.forEach((button) => {
			// The onClick listener was already bound in the constructor.
			//
			// eslint-disable-next-line @typescript-eslint/unbound-method
			button.removeEventListener('click', this._onClick);
			button.parentNode?.removeChild(button);
		});
		pagination?.parentNode?.removeChild(pagination);

		clearCache(this, CACHE_KEY_BUTTONS);
		clearCache(this, CACHE_KEY_PAGINATION);
	}

	/**
	 * Event handler when a button is clicked. Detects the current index of the
	 * clicked button inside the pagination and updates the index accordingly of
	 * the carousel.
	 * @internal
	 * @param event the mouse event
	 */
	private _onClick(event: MouseEvent): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const buttons = fromCache<HTMLButtonElement[]>(this, CACHE_KEY_BUTTONS) as HTMLButtonElement[];
		const target = event.currentTarget as HTMLButtonElement;
		const index = buttons.indexOf(target);
		proxy.index = proxy.pages[index];
	}

}
