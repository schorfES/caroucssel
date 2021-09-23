import { IFeature, IProxy } from '../../types';
import { clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';


const FEATURE_NAME = 'buildin:buttons';

const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_BUTTONS = 'btns';

const EVENT_CLICK = 'click';


/**
 * The template function to render a HTML markup of a button.
 * @param context the template context containing the required data to render
 * @return the HTML markup
 */
export type Template = (context: Context) => string;


/**
 * The template rendering context.
 */
export type Context = {
	controls: string;
	className: string;
	label: string;
	title: string;
};


/**
 * Short type of HTMLButtonElement or nullish (not rendered).
 * @interal
 */
type Button = HTMLButtonElement | null;


/**
 * The options for the buttons feature.
 */
export type Options = {
	/**
	 * Render function for a single button.
	 */
	template?: Template;

	/**
	 * The shared class name for both buttons (next and previous).
	 * @defaultValue `'button'`
	 */
	className?: string;

	/**
	 * The class name of the next button.
	 * @defaultValue `'is-next'`
	 */
	nextClassName?: string;

	/**
	 * The text label of the next button.
	 * @defaultValue `'Next'`
	 */
	nextLabel?: string;

	/**
	 * The title attribute value of the next button.
	 * @defaultValue `'Go to next'`
	 */
	nextTitle?: string;

	/**
	 * The class name of the previous button.
	 * @defaultValue `'is-previous'`
	 */
	previousClassName?: string;

	/**
	 * The text label of the previous button.
	 * @defaultValue `'Previous'`
	 */
	previousLabel?: string;

	/**
	 * The title attribute value of the previous button.
	 * @defaultValue `'Go to previous'`
	 */
	previousTitle?: string;

};


/**
 * The required configuration for buttons feature.
 * @internal
 */
type Configuration = Required<Options>;


const DEFAULTS: Configuration = {
	template: ({ className, controls, label, title }: Context) => `
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


/**
 * The feature to enable button controls (next and previous) for a carousel.
 */
export class Buttons implements IFeature {

	/**
	 * Creates an instance of this feature.
	 * @param options are the options to configure this instance
	 */
	constructor(options: Options = {}) {
		writeCache(this, CACHE_KEY_CONFIGURATION, { ...DEFAULTS, ...options });
		this._onPrev = this._onPrev.bind(this);
		this._onNext = this._onNext.bind(this);
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
		this._render();
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
	 */
	public update(/* event :UpdateEvent */): void {
		this._render();
	}

	/**
	 * Renders and update the button elements. Buttons will only be rendered once
	 * and then loaded from cache. When calling this function twice or more, the
	 * button states will be updated based on the scroll position.
	 * @internal
	 */
	private _render(): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const config = fromCache<Configuration>(this, CACHE_KEY_CONFIGURATION) as Configuration;

		const { el, mask, pages, pageIndex } = proxy;

		// Render buttons only once. Load them from cache if already rendered and
		// attached to the dom:
		const [next, previous] = fromCache<Button[]>(
			this, CACHE_KEY_BUTTONS, () => {
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
						// The onClick listener was already bound in the constructor.
						//
						// eslint-disable-next-line @typescript-eslint/unbound-method
						handler: this._onNext,
					},
					{
						controls: el.id,
						label: previousLabel,
						title: previousTitle,
						className: [className, previousClassName].join(' '),
						// The onClick listener was already bound in the constructor.
						//
						// eslint-disable-next-line @typescript-eslint/unbound-method
						handler: this._onPrev,
					},
				];

				return settings.map(({ handler, ...params }) => {
					const button = render<HTMLButtonElement, Context>(template, params);
					if (!button) {
						return null;
					}

					button.addEventListener(EVENT_CLICK, handler);
					target.parentNode?.insertBefore(button, target.nextSibling);
					return button;
				});
			},
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

	/**
	 * Removes all buttons from the dom and detaches all event handler.
	 * @internal
	 */
	private _remove(): void {
		const buttons = fromCache<Button[]>(this, CACHE_KEY_BUTTONS) as Button[];

		buttons.forEach((button): void => {
			// The onClick listener was already bound in the constructor.
			//
			// eslint-disable-next-line @typescript-eslint/unbound-method
			button?.removeEventListener(EVENT_CLICK, this._onPrev);
			// The onClick listener was already bound in the constructor.
			//
			// eslint-disable-next-line @typescript-eslint/unbound-method
			button?.removeEventListener(EVENT_CLICK, this._onNext);
			button?.parentNode?.removeChild(button);
		});
	}

	/**
	 * Event handler to navigate backwards (to the left).
	 * @internal
	 */
	private _onPrev(): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const { pages, pageIndex } = proxy;
		const index = pages[pageIndex - 1] || pages[0];
		proxy.index = index;
	}

	/**
	 * Event handler to navigate forwards (to the right).
	 * @internal
	 */
	private _onNext(): void {
		const proxy = fromCache<IProxy>(this, CACHE_KEY_PROXY) as IProxy;
		const { pages, pageIndex } = proxy;
		const index = pages[pageIndex + 1] || pages[pages.length - 1];
		proxy.index = index;
	}

}
