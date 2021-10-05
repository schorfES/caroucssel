import { UpdateType } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';
const FEATURE_NAME = 'buildin:pagination';
const CACHE_KEY_PROXY = 'prxy';
const CACHE_KEY_CONFIGURATION = 'conf';
const CACHE_KEY_PAGINATION = 'pags';
const CACHE_KEY_BUTTONS = 'btns';
const DEFAULTS = {
    // @TODO: ESLint don't like the nested template literals and loops.
    /* eslint-disable indent */
    template: ({ className, controls, pages, label, title }) => `
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
    /* eslint-enable indent */
    className: 'pagination',
    label: ({ index }) => `${index + 1}`,
    title: ({ index }) => `Go to ${index + 1}. page`,
};
/**
 * The feature to enable pagination controls.
 */
export class Pagination {
    /**
     * Creates an instance of this feature.
     * @param options are the options to configure this instance
     */
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Returns the name of this feature.
     */
    get name() {
        return FEATURE_NAME;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */
    init(proxy) {
        writeCache(this, CACHE_KEY_PROXY, proxy);
        this._add();
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */
    destroy() {
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
    update(event) {
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
    _add() {
        var _a;
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const config = fromCache(this, CACHE_KEY_CONFIGURATION);
        const { el, mask, pages } = proxy;
        const target = mask !== null && mask !== void 0 ? mask : el;
        if (pages.length < 2) {
            return;
        }
        const { template, className, label, title } = config;
        const pagination = render(template, { label, title, pages, className, controls: el.id });
        if (!pagination) {
            return;
        }
        // @TODO: Add template for buttons:
        const buttons = Array.from(pagination.querySelectorAll('button'))
            .map((button) => {
            // The onClick listener is already bound in the constructor.
            //
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button.addEventListener('click', this._onClick, true);
            return button;
        });
        (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(pagination);
        writeCache(this, CACHE_KEY_PAGINATION, pagination);
        writeCache(this, CACHE_KEY_BUTTONS, buttons);
        this._update();
    }
    /**
     * Updates the states of all buttons inside the pagination.
     * @internal
     */
    _update() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        const { pageIndex } = proxy;
        buttons.forEach((button, at) => button.disabled = (at === pageIndex));
    }
    /**
     * Removes the whole pagination element and removes all attached event handlers.
     * @internal
     */
    _remove() {
        var _a;
        const pagination = fromCache(this, CACHE_KEY_PAGINATION);
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        buttons === null || buttons === void 0 ? void 0 : buttons.forEach((button) => {
            var _a;
            // The onClick listener is already bound in the constructor.
            //
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button.removeEventListener('click', this._onClick);
            (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
        (_a = pagination === null || pagination === void 0 ? void 0 : pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(pagination);
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
    _onClick(event) {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        const target = event.currentTarget;
        const index = buttons.indexOf(target);
        proxy.index = proxy.pages[index];
    }
}
