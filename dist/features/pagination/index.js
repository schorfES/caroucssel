import { UpdateReason } from '../../types';
import { clearCache, clearFullCache, fromCache, writeCache } from '../../utils/cache';
import { render } from '../../utils/render';
const DEFAULTS = {
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
    className: 'pagination',
    label: ({ index }) => `${index + 1}`,
    title: ({ index }) => `Go to ${index + 1}. page`,
};
const CACHE_KEY_PROXY = 'proxy';
const CACHE_KEY_CONFIGURATION = 'config';
const CACHE_KEY_PAGINATION = 'pagination';
const CACHE_KEY_BUTTONS = 'buttons';
/**
 * The feature to enable pagination controls.
 */
export class Pagination {
    constructor(options = {}) {
        writeCache(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
        this._onClick = this._onClick.bind(this);
    }
    get name() {
        return 'buildin:pagination';
    }
    init(proxy) {
        writeCache(this, CACHE_KEY_PROXY, proxy);
        this._add();
    }
    destroy() {
        this._remove();
        clearFullCache(this);
    }
    update(data) {
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
            // The onClick listener was already bound in the constructor.
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
    _update() {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        const { pageIndex } = proxy;
        buttons.forEach((button, at) => button.disabled = (at === pageIndex));
    }
    _remove() {
        var _a;
        const pagination = fromCache(this, CACHE_KEY_PAGINATION);
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        buttons === null || buttons === void 0 ? void 0 : buttons.forEach((button) => {
            var _a;
            // The onClick listener was already bound in the constructor.
            //
            // eslint-disable-next-line @typescript-eslint/unbound-method
            button.removeEventListener('click', this._onClick);
            (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
        (_a = pagination === null || pagination === void 0 ? void 0 : pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(pagination);
        clearCache(this, CACHE_KEY_BUTTONS);
        clearCache(this, CACHE_KEY_PAGINATION);
    }
    _onClick(event) {
        const proxy = fromCache(this, CACHE_KEY_PROXY);
        const buttons = fromCache(this, CACHE_KEY_BUTTONS);
        const target = event.currentTarget;
        const index = buttons.indexOf(target);
        proxy.index = proxy.pages[index];
    }
}
