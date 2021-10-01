import { Carousel } from './caroucssel';
import { ButtonParams, FilterItemFn, PaginationParams, PaginationTextParams } from './types';
import { ScrollbarDimensions } from './utils/scrollbar';


/* Mocks
 * -------------------------------------------------------------------------- */

let mockScrollbarDimensions: ScrollbarDimensions | null = null;

jest.mock('./utils/scrollbar', () => {
	return {
		Scrollbar: class {
			get dimensions() {
				return mockScrollbarDimensions;
			}
		},
	};
});


/* Test Helpers
 * -------------------------------------------------------------------------- */

type FixtureOptions = {id: string | null;};
function __fixture(count: number, options: Partial<FixtureOptions> = {}) {
	const settings: FixtureOptions = { id: null, ...options };

	return `
		<div class="container">
			<div class="caroucssel"${settings.id ? ` id="${settings.id}"` : ''}>
				${[...Array(count).keys()].map((index) => `
					<div class="item item-${index}">Item ${index}</div>
				`).join('')}
			</div>
		</div>
	`;
}

function __triggerResize() {
	const event = document.createEvent('UIEvents');
	event.initEvent('resize', true, false);
	window.dispatchEvent(event);
	jest.runAllTimers();
}

type TriggerScrollPosition = {left?: number; top?: number;};
function __triggerScroll(element: Element, position: TriggerScrollPosition) {
	element.mockedTop = position.top || 0;
	element.mockedLeft = position.left || 0;

	const event = document.createEvent('Event');
	event.initEvent('scroll');
	element.dispatchEvent(event);
	jest.runAllTimers();
}

function __triggerClick(element: Element) {
	const event = document.createEvent('Event');
	event.initEvent('click');
	element.dispatchEvent(event);
	jest.runAllTimers();
}

function __querySelector(selector: string): Element {
	const el = document.querySelector(selector);
	if (!el) {
		throw new Error('Selector not found');
	}

	return el;
}






describe('Caroucssel', () => {

	beforeEach(() => {
		jest.useFakeTimers();
		mockScrollbarDimensions = { height: 0 };
	});


	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});


	describe('core', () => {

		it('should throw an error when not passing an element', () => {
			// Test untyped behaviour of constructor
			// @ts-ignore
			expect(() => new Carousel())
				.toThrow(new Error('Carousel needs a dom element but "undefined" was passed.'));
			// @ts-ignore
			expect(() => new Carousel(true))
				.toThrow(new Error('Carousel needs a dom element but "boolean" was passed.'));
			// @ts-ignore
			expect(() => new Carousel({}))
				.toThrow(new Error('Carousel needs a dom element but "object" was passed.'));
		});

		it('should render empty', () => {
			document.body.innerHTML = __fixture(0);

			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.el).toBe(el);
		});

		it('should return given element', () => {
			document.body.innerHTML = __fixture(3);

			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.el).toBe(el);
		});

		it('should add id-attribute when element has no id', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			new Carousel(el);
			expect(/^caroucssel-[0-9]*$/.test(el.id)).toBeTruthy();
		});

		it('should create unique ids for multiple instances', () => {
			document.body.innerHTML = `${__fixture(3)}${__fixture(3)}`;
			const instances: Carousel[] = [];
			[...document.querySelectorAll('.caroucssel')].forEach((el) =>
				instances.push(new Carousel(el)));

			expect.assertions(2);
			instances.forEach((el, index) =>
				expect(el.id).toBe(`caroucssel-${index + 1}`));
		});

		it('should not add id-attribute when element already has an id', () => {
			document.body.innerHTML = __fixture(3, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');

			new Carousel(el);
			expect(el.id).toBe('custom-id');
		});

		it('should return current index of visible item', () => {
			document.body.innerHTML = __fixture(3, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);

			__triggerScroll(el, { left: 120 });
			expect(carousel.index).toEqual([1]);
		});

		it('should return current index(s) when multiple items are visible', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 120;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 40);

			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0, 1, 2]);

			__triggerScroll(el, { left: 120 });
			expect(carousel.index).toEqual([3, 4, 5]);
		});

		it('should return current index when no items are available', () => {
			document.body.innerHTML = __fixture(0);

			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);
		});

		it('should not set initial index when option is undefined (default)', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: undefined });
			expect(carousel.index).toEqual([0]);
			expect(scrollTo).not.toHaveBeenCalled();
		});

		it('should not set initial index when option is an empty array', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');

			// Test untyped behaviour of constructor
			// @ts-ignore
			const carousel = new Carousel(el, { index: [] });
			expect(carousel.index).toEqual([0]);
			expect(scrollTo).not.toHaveBeenCalled();
		});

		it('should set initial index when option is a number', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: 4 });
			expect(carousel.index).toEqual([4]);
			expect(scrollTo).toHaveBeenCalled();
		});

		it('should set initial index by option', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: [2] });
			expect(carousel.index).toEqual([2]);
			expect(scrollTo).toHaveBeenCalled();
		});

		it('should set initial index when option is [0]', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: [0] });
			expect(carousel.index).toEqual([0]);
			expect(scrollTo).toHaveBeenCalled();
		});

		it('should set initial index as option when multiple items are visible', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 120;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 40);

			const carousel = new Carousel(el, { index: [2] });
			expect(carousel.index).toEqual([2, 3, 4]);
		});

		it('should return current index(s) at expected bounds (using 25% rule)', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0, 1]);

			__triggerScroll(el, { left: 50 * 0.25 });
			expect(carousel.index).toEqual([0, 1]);

			__triggerScroll(el, { left: 50 * 0.25 + 1 });
			expect(carousel.index).toEqual([1]);

			__triggerScroll(el, { left: 50 * 0.75 - 1 });
			expect(carousel.index).toEqual([1]);

			__triggerScroll(el, { left: 50 * 0.75 });
			expect(carousel.index).toEqual([1, 2]);

			__triggerScroll(el, { left: 50 * 1 });
			expect(carousel.index).toEqual([1, 2]);
		});

		it('should return pages when each item is at 100% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 75% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 75);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 58% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 58);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 57% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 57);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
			]);
		});

		it('should return pages when each item is at 50% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
			]);
		});

		it('should return pages when each item is at 33.33% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 33.33);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1, 2], [3, 4, 5], [6, 7, 8], [9],
			]);
		});

		it('should return pages when each item is at 120% width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 120);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when item is at 0px width', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 0);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			]);
		});

		it('should return pages for each item when element width is 0px', () => {
			document.body.innerHTML = __fixture(10, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 0;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should ignore <link> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const hidden = document.createElement('link');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <meta> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const hidden = document.createElement('meta');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <noscript> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const hidden = document.createElement('noscript');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <script> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const hidden = document.createElement('script');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <style> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const hidden = document.createElement('style');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <title> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const hidden = document.createElement('title');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore with "hidden" attribute in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const child = el.firstElementChild as HTMLElement;
			child.hidden = true;

			const hidden = document.createElement('div');
			hidden.setAttribute('hidden', 'hidden');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(2);
		});

		it('should filter items based on filter function', () => {
			document.body.innerHTML = __fixture(9);
			const el = __querySelector('.caroucssel');
			const filterItem: FilterItemFn = (item: Element, index: number) => (index % 3) === 0;
			const carousel = new Carousel(el, { filterItem });
			expect(carousel.items).toHaveLength(3);
		});

	});


	describe('buttons', () => {

		it('should add buttons', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const options = {
				hasButtons: true,
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add buttons with custom options', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonClassName: 'custom-button-class',
				buttonPrevious: {
					className: 'custom-previous-button-class',
					label: 'Custom previous label',
					title: 'Custom previous title',
				},
				buttonNext: {
					className: 'custom-next-button-class',
					label: 'Custom next label',
					title: 'Custom next title',
				},
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add buttons with custom template', () => {
			document.body.innerHTML = __fixture(3, { id: 'custom-id' });
			const el = __querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonClassName: 'custom-button-class',
				buttonPrevious: {
					className: 'custom-previous-button-class',
					label: 'Custom previous label',
					title: 'Custom previous title',
				},
				buttonNext: {
					className: 'custom-next-button-class',
					label: 'Custom next label',
					title: 'Custom next title',
				},
				buttonTemplate: jest.fn<string, ButtonParams[]>(({ className, label, title }) =>
					`<span class="${className}" title="${title}">${label}</span>`),
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
			expect(options.buttonTemplate).toHaveBeenNthCalledWith(1, {
				className: 'custom-button-class custom-previous-button-class',
				controls: 'custom-id',
				label: 'Custom previous label',
				title: 'Custom previous title',
			});
			expect(options.buttonTemplate).toHaveBeenNthCalledWith(2, {
				className: 'custom-button-class custom-next-button-class',
				controls: 'custom-id',
				label: 'Custom next label',
				title: 'Custom next title',
			});
		});

		it('should handle buttons with custom template that returns empty string', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			const buttonTemplate: jest.Mock<string, []> = jest.fn(() => '');

			const options = {
				hasButtons: true,
				buttonTemplate,
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
		});

		it('should handle buttons with custom template that returns null', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			// Test when js custom implementation returns null
			// @ts-ignore
			const buttonTemplate: jest.Mock<string, []> = jest.fn(() => null);

			const options = {
				hasButtons: true,
				buttonTemplate,
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
		});

		it('should handle buttons with custom template that returns undefined', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			// Test when js custom implementation returns undefined
			// @ts-ignore
			const buttonTemplate: jest.Mock<string, [ButtonParams]> = jest.fn(() => undefined);

			const options = {
				hasButtons: true,
				buttonTemplate,
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
		});


		it('should add disabled buttons without items', () => {
			document.body.innerHTML = __fixture(0);
			const el = __querySelector('.caroucssel');
			new Carousel(el, { hasButtons: true });

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(document.querySelectorAll('.button[disabled]')).toHaveLength(2);
		});

		it('should re-render buttons on resize', () => {
			document.body.innerHTML = __fixture(4);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			new Carousel(el, { hasButtons: true });

			expect(document.querySelectorAll('.button[disabled]')).toHaveLength(1);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 25);
			__triggerResize();
			expect(document.querySelectorAll('.button[disabled]')).toHaveLength(2);
		});

		it('should update buttons on scroll', () => {
			document.body.innerHTML = __fixture(6);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			new Carousel(el, { hasButtons: true });

			const buttons = document.querySelectorAll<HTMLButtonElement>('.button');
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

			__triggerScroll(el, { left: 100 });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			__triggerScroll(el, { left: 200 });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);
		});

		it('should update buttons manually', () => {
			document.body.innerHTML = __fixture(6);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			const carousel = new Carousel(el, { hasButtons: true });

			const buttons = document.querySelectorAll<HTMLButtonElement>('.button');
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

			el.scrollTo({ left: 100 });
			carousel.update();
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			el.scrollTo({ left: 200 });
			carousel.update();
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);
		});

		it('should handle clicks', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			new Carousel(el, { hasButtons: true });

			const callback = jest.spyOn(el, 'scrollTo');
			const buttons = document.querySelectorAll<HTMLButtonElement>('.button');

			__triggerClick(buttons[1]); // navigate forwards
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenNthCalledWith(1, { left: 100, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			__triggerClick(buttons[1]); // navigate forwards
			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback).toHaveBeenNthCalledWith(2, { left: 200, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);

			__triggerClick(buttons[1]); // navigate forwards (doesn't work, disabled)
			expect(callback).toHaveBeenCalledTimes(2);

			__triggerClick(buttons[0]); // navigate backwards
			expect(callback).toHaveBeenCalledTimes(3);
			expect(callback).toHaveBeenNthCalledWith(3, { left: 100, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			__triggerClick(buttons[0]); // navigate backwards
			expect(callback).toHaveBeenCalledTimes(4);
			expect(callback).toHaveBeenNthCalledWith(4, { left: 0, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

			__triggerClick(buttons[0]); // navigate backwards (doesn't work, disabled)
			expect(callback).toHaveBeenCalledTimes(4);
		});

	});


	describe('pagination', () => {

		it('should add pagination', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			new Carousel(el, { hasPagination: true });

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add pagination with custom options', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			const paginationLabel: jest.Mock<string, [PaginationTextParams]> = jest.fn(
				({ index }) => {
					switch (index) {
						case 0: return 'first';
						case 1: return 'second';
						case 2: return 'third';
						default: return 'un-defined';
					}
				},
			);

			const paginationTitle: jest.Mock<string, [PaginationTextParams]> = jest.fn(
				({ index }) => {
					let name: string;

					switch (index) {
						case 0: name = 'first'; break;
						case 1: name = 'second'; break;
						case 2: name = 'third'; break;
						default: name = 'un-defined'; break;
					}

					return `Go to ${name} item`;
				},
			);

			new Carousel(el, {
				hasPagination: true,
				paginationClassName: 'custom-pagination-class',
				paginationLabel,
				paginationTitle,
			});

			expect(document.body.innerHTML).toMatchSnapshot();

			expect(paginationLabel).toHaveBeenCalledTimes(3);
			expect(paginationLabel).toHaveBeenNthCalledWith(1, {
				index: 0,
				page: [0],
				pages: [[0], [1], [2]],
			});

			expect(paginationTitle).toHaveBeenCalledTimes(3);
			expect(paginationTitle).toHaveBeenNthCalledWith(3, {
				index: 2,
				page: [2],
				pages: [[0], [1], [2]],
			});
		});

		it('should add pagination with custom template', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			const paginationLabel: jest.Mock<string, [PaginationTextParams]> = jest.fn(
				({ index }) => {
					switch (index) {
						case 0: return 'first';
						case 1: return 'second';
						case 2: return 'third';
						default: return 'un-defined';
					}
				},
			);

			const paginationTitle: jest.Mock<string, [PaginationTextParams]> = jest.fn(
				({ index }) => {
					let name;
					switch (index) {
						case 0: name = 'first'; break;
						case 1: name = 'second'; break;
						case 2: name = 'third'; break;
						default: name = 'un-defined'; break;
					}
					return `Go to ${name} page`;
				},
			);

			const paginationTemplate: jest.Mock<string, [PaginationParams]> = jest.fn(
				({ className, controls, pages, label, title }) =>
					`<div class="${className}" aria-controls="${controls}">
						${pages.map((page, index) => `
							<div class="item" aria-label="${title({ index, page, pages })}">
								${label({ index, page, pages })}
							</div>`
						).join('')}
					</div>`,
			);

			new Carousel(el, {
				hasPagination: true,
				paginationClassName: 'custom-pagination-class',
				paginationLabel,
				paginationTitle,
				paginationTemplate,
			});

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should handle pagination with custom template that returns empty string', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			const paginationTemplate: jest.Mock<string, []> = jest.fn(
				() => '',
			);

			new Carousel(el, {
				hasPagination: true,
				paginationTemplate,
			});

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should handle pagination with custom template that returns null', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			// Test when js custom implementation returns null
			// @ts-ignore
			const paginationTemplate: jest.Mock<string, []> = jest.fn(
				() => null,
			);

			new Carousel(el, {
				hasPagination: true,
				paginationTemplate,
			});

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should handle pagination with custom template that returns undefined', () => {
			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			// Test when js custom implementation returns undefined
			// @ts-ignore
			const paginationTemplate: jest.Mock<string, []> = jest.fn(
				() => undefined,
			);

			new Carousel(el, {
				hasPagination: true,
				paginationTemplate,
			});

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should not add pagination without items', () => {
			document.body.innerHTML = __fixture(0);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			new Carousel(el, { hasPagination: true });

			const pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);
		});

		it('should not add pagination with single item', () => {
			document.body.innerHTML = __fixture(1);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			new Carousel(el, { hasPagination: true });

			const pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);
		});

		it('should re-render pagination on resize', () => {
			document.body.innerHTML = __fixture(4);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			new Carousel(el, { hasPagination: true });

			let pagination = document.querySelectorAll('.pagination');
			let pages = pagination[0].querySelectorAll('li');
			expect(pagination).toHaveLength(1);
			expect(pages).toHaveLength(2);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			pages = pagination[0].querySelectorAll('li');
			expect(pagination).toHaveLength(1);
			expect(pages).toHaveLength(4);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 25);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 10);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			pages = pagination[0].querySelectorAll('li');
			expect(pagination).toHaveLength(1);
			expect(pages).toHaveLength(2);
		});

		it('should update pagination on scroll', () => {
			document.body.innerHTML = __fixture(6);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			new Carousel(el, { hasPagination: true });

			const pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');
			expect(pagination).toHaveLength(3);
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

			__triggerScroll(el, { left: 100 });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

			__triggerScroll(el, { left: 200 });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
		});

		it('should update pagination manually', () => {
			document.body.innerHTML = __fixture(6);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			const carousel = new Carousel(el, { hasPagination: true });

			const pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');
			expect(pagination).toHaveLength(3);
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

			el.scrollTo({ left: 100 });
			carousel.update()
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

			el.scrollTo({ left: 200 });
			carousel.update()
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
		});

		it('should handle clicks', () => {
			document.body.innerHTML = __fixture(6);
			const el = __querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
			new Carousel(el, { hasPagination: true });

			const callback = jest.spyOn(el, 'scrollTo');
			const pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');

			__triggerClick(pagination[1]);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenNthCalledWith(1, { left: 100, behavior: 'smooth' });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

			__triggerClick(pagination[0]);
			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback).toHaveBeenNthCalledWith(2, { left: 0, behavior: 'smooth' });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

			__triggerClick(pagination[2]);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(callback).toHaveBeenNthCalledWith(3, { left: 200, behavior: 'smooth' });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);

			__triggerClick(pagination[2]); // doesn't work, disabled
			expect(callback).toHaveBeenCalledTimes(3);
		});

	});


	describe('scrollbars', () => {
		it('should wrap mask element', () => {
			mockScrollbarDimensions = { height: 15 };

			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			new Carousel(el);
			const parent = el.parentNode as HTMLElement;
			expect(parent.className).toBe('caroucssel-mask');
			expect(parent.style.overflow).toBe('hidden');
			expect(parent.style.height).toBe('100%');
		});

		it('should detect invisible scrollbar', () => {
			mockScrollbarDimensions = { height: 0 };

			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const style = {};

			Object.defineProperty(el, 'style', { value: style, writable: false });
			Object.defineProperty(el, 'clientWidth', { value: 600, writable: false });
			Object.defineProperty(el, 'scrollWidth', { value: 800, writable: false });

			new Carousel(el);
			expect(style).toEqual({
				marginBottom: '0px',
				height: 'calc(100% + 0px)',
			});
		});

		it('should detect visible scrollbar', () => {
			mockScrollbarDimensions = { height: 15 };

			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const style = {};

			Object.defineProperty(el, 'style', { value: style, writable: false });
			Object.defineProperty(el, 'clientWidth', { value: 600, writable: false });
			Object.defineProperty(el, 'scrollWidth', { value: 800, writable: false });

			new Carousel(el);
			expect(style).toEqual({
				marginBottom: '-15px',
				height: 'calc(100% + 15px)',
			});
		});

		it('should detect not existing scrollbar (content is smaller than container)', () => {
			mockScrollbarDimensions = { height: 15 };

			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');
			const style = {};

			Object.defineProperty(el, 'style', { value: style, writable: false });
			Object.defineProperty(el, 'clientWidth', { value: 800, writable: false });
			Object.defineProperty(el, 'scrollWidth', { value: 200, writable: false });

			new Carousel(el);
			expect(style).toEqual({
				marginBottom: '0px',
				height: 'calc(100% + 0px)',
			});
		});

		it('should use css defaults by not wrapping mask element', () => {
			mockScrollbarDimensions = { height: 1 };

			document.body.innerHTML = __fixture(3);
			const el = __querySelector('.caroucssel');

			new Carousel(el, { hasScrollbars: true });
			expect(el.getAttribute('style')).toBeNull();
		});

	});


	describe('destroy', () => {

		it('should cleanup dom', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el);

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without buttons', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				hasButtons: false,
				hasPagination: true,
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without pagiantion', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				hasButtons: true,
				hasPagination: false,
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without scrollbars mask', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = __querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				hasButtons: true,
				hasPagination: true,
				hasScrollbars: true,
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

	});

});