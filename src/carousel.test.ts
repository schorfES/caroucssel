import { fixture, querySelector, triggerResize, triggerScroll } from './__setup__/helpers';
import { Carousel } from './carousel';
import { Buttons } from './features/buttons';
import { Mask } from './features/mask';
import { ScrollbarDimensions } from './features/mask/scrollbar';
import { Pagination } from './features/pagination';
import { Proxy } from './proxy';
import { FilterItemFn, IFeature, UpdateType } from './types';


let mockScrollbarDimensions: ScrollbarDimensions | null = null;

jest.mock('./features/mask/scrollbar', () => {
	return {
		Scrollbar: class {
			get dimensions() {
				return mockScrollbarDimensions;
			}
		},
	};
});


describe('Carousel', () => {

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
			document.body.innerHTML = fixture(0);

			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.el).toBe(el);
		});

	});


	describe('el', () => {

		it('should return given element', () => {
			document.body.innerHTML = fixture(3);

			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.el).toBe(el);

			carousel.destroy();
		});

	});


	describe('mask', () => {

		it('should return mask element', () => {
			document.body.innerHTML = fixture(3);

			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.mask).toBe(el.parentNode);

			carousel.destroy();
		});

		it('should not return mask element when disabled', () => {
			document.body.innerHTML = fixture(3);

			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				features: [new Mask({ enabled: false })],
			});
			expect(carousel.mask).toBeNull();

			carousel.destroy();
		});

		it('should apply mask feature(s) only once', () => {
			document.body.innerHTML = fixture(3);

			const el = querySelector('.caroucssel');
			const features = [
				new Mask(), // Should be initialized
				new Mask(), // Should NOT be initialized
				new Buttons(), // Should be initialized because to other feature
				new Mask(), // Should NOT be initialized
			];
			const spies = features.map((mask) => jest.spyOn(mask, 'init'));

			const carousel = new Carousel(el, { features });

			expect(spies[0]).toHaveBeenCalledTimes(1);
			expect(spies[0].mock.calls[0][0]).toBeInstanceOf(Proxy);

			expect(spies[1]).not.toHaveBeenCalled();

			expect(spies[2]).toHaveBeenCalledTimes(1);
			expect(spies[2].mock.calls[0][0]).toBeInstanceOf(Proxy);

			expect(spies[3]).not.toHaveBeenCalled();

			carousel.destroy();
		});

	});

	describe('id', () => {

		it('should add id-attribute when element has no id', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			new Carousel(el);
			expect(/^caroucssel-[0-9]*$/.test(el.id)).toBeTruthy();
		});

		it('should create unique ids for multiple instances', () => {
			document.body.innerHTML = `${fixture(3)}${fixture(3)}`;
			const instances: Carousel[] = [];
			[...document.querySelectorAll('.caroucssel')].forEach((el) =>
				instances.push(new Carousel(el)));

			expect.assertions(2);
			instances.forEach((el, index) =>
				expect(el.id).toBe(`caroucssel-${index + 1}`));
		});

		it('should not add id-attribute when element already has an id', () => {
			document.body.innerHTML = fixture(3, { id: 'custom-id' });
			const el = querySelector('.caroucssel');

			new Carousel(el);
			expect(el.id).toBe('custom-id');
		});

	});


	describe('index', () => {

		it('should return current index of visible item', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);

			triggerScroll(el, { left: 120 });
			expect(carousel.index).toEqual([1]);
		});

		it('should return current index(s) when multiple items are visible', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 120;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 40);

			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0, 1, 2]);

			triggerScroll(el, { left: 120 });
			expect(carousel.index).toEqual([3, 4, 5]);
		});

		it('should return current index when no items are available', () => {
			document.body.innerHTML = fixture(0);

			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);
		});

		it('should not set initial index when option is undefined (default)', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: undefined });
			expect(carousel.index).toEqual([0]);
			expect(scrollTo).not.toHaveBeenCalled();
		});

		it('should not set initial index when option is an empty array', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
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
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: 4 });
			expect(carousel.index).toEqual([4]);
			expect(scrollTo).toHaveBeenCalled();
		});

		it('should set initial index by option', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: [2] });
			expect(carousel.index).toEqual([2]);
			expect(scrollTo).toHaveBeenCalled();
		});

		it('should set initial index when option is [0]', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const scrollTo = jest.spyOn(el, 'scrollTo');
			const carousel = new Carousel(el, { index: [0] });
			expect(carousel.index).toEqual([0]);
			expect(scrollTo).toHaveBeenCalled();
		});

		it('should set initial index as option when multiple items are visible', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 120;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 40);

			const carousel = new Carousel(el, { index: [2] });
			expect(carousel.index).toEqual([2, 3, 4]);
		});

		it('should return current index(s) at expected bounds (using 25% rule)', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0, 1]);

			triggerScroll(el, { left: 50 * 0.25 });
			expect(carousel.index).toEqual([0, 1]);

			triggerScroll(el, { left: 50 * 0.25 + 1 });
			expect(carousel.index).toEqual([1]);

			triggerScroll(el, { left: 50 * 0.75 - 1 });
			expect(carousel.index).toEqual([1]);

			triggerScroll(el, { left: 50 * 0.75 });
			expect(carousel.index).toEqual([1, 2]);

			triggerScroll(el, { left: 50 * 1 });
			expect(carousel.index).toEqual([1, 2]);
		});

		it('should set index', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);

			carousel.index = [2];
			expect(carousel.index).toEqual([2, 3]);
		});

		it('should not set empty index', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);

			// Test untyped behaviour of setter
			// @ts-ignore
			carousel.index = [];
			expect(carousel.index).toEqual([0, 1]);
		});

		it('should not set numbered index', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);

			// Test untyped behaviour of setter
			// @ts-ignore
			carousel.index = 2;
			expect(carousel.index).toEqual([0, 1]);
		});

		it('should not set undefiend index', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);

			// Test untyped behaviour of setter
			// @ts-ignore
			carousel.index = undefined;
			expect(carousel.index).toEqual([0, 1]);
		});

		it('should not set null index', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);

			// Test untyped behaviour of setter
			// @ts-ignore
			carousel.index = null;
			expect(carousel.index).toEqual([0, 1]);
		});

	});


	describe('pages', () => {

		it('should return pages when each item is at 100% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 75% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 75);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 58% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 58);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 57% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 57);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
			]);
		});

		it('should return pages when each item is at 50% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
			]);
		});

		it('should return pages when each item is at 33.33% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 33.33);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1, 2], [3, 4, 5], [6, 7, 8], [9],
			]);
		});

		it('should return pages when each item is at 120% width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 120);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when item is at 0px width', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 0);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			]);
		});

		it('should return pages for each item when element width is 0px', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 0;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

	});


	describe('pageIndex', () => {

		it('should return pageIndex', () => {
			document.body.innerHTML = fixture(10);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.pageIndex).toBe(0);

			triggerScroll(el, { left: 50 });
			expect(carousel.pageIndex).toBe(0);

			triggerScroll(el, { left: 51 });
			expect(carousel.pageIndex).toBe(1);
		});

	});


	describe('items', () => {

		it('should ignore <link> in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const hidden = document.createElement('link');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <meta> in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const hidden = document.createElement('meta');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <noscript> in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const hidden = document.createElement('noscript');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <script> in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const hidden = document.createElement('script');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <style> in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const hidden = document.createElement('style');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <title> in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const hidden = document.createElement('title');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore with "hidden" attribute in items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const child = el.firstElementChild as HTMLElement;
			child.hidden = true;

			const hidden = document.createElement('div');
			hidden.setAttribute('hidden', 'hidden');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(2);
		});

		it('should filter items based on filter function', () => {
			document.body.innerHTML = fixture(9);
			const el = querySelector('.caroucssel');
			const filterItem: FilterItemFn = (item: Element, index: number) => (index % 3) === 0;
			const carousel = new Carousel(el, { filterItem });
			expect(carousel.items).toHaveLength(3);
		});

	});


	describe('features', () => {

		it('should initialize features', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const features = [
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
			] as unknown as IFeature[];
			const spies = features.map((feature) => jest.spyOn(feature, 'init'));
			new Carousel(el, { features });

			expect(spies[0]).toHaveBeenCalledTimes(1);
			expect(spies[1]).toHaveBeenCalledTimes(1);
			expect(spies[2]).toHaveBeenCalledTimes(1);
		});

		it('should initialize with same proxy instance', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const features = [
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
			] as unknown as IFeature[];
			const spies = features.map((feature) => jest.spyOn(feature, 'init'));
			new Carousel(el, { features });

			expect(spies[0].mock.calls[0][0]).toBeInstanceOf(Proxy);

			expect(spies[1].mock.calls[0][0]).toBeInstanceOf(Proxy);
			expect(spies[1].mock.calls[0][0]).toBe(spies[0].mock.calls[0][0]);

			expect(spies[2].mock.calls[0][0]).toBeInstanceOf(Proxy);
			expect(spies[2].mock.calls[0][0]).toBe(spies[1].mock.calls[0][0]);
		});

		it('should not update features when initialized', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const features = [
				{ init: jest.fn(), update: jest.fn() },
				{ init: jest.fn(), update: jest.fn() },
				{ init: jest.fn(), update: jest.fn() },
			] as unknown as IFeature[];
			const spies = features.map((feature) => jest.spyOn(feature, 'update'));
			new Carousel(el, { features });

			expect(spies[0]).not.toHaveBeenCalled();
			expect(spies[1]).not.toHaveBeenCalled();
			expect(spies[2]).not.toHaveBeenCalled();
		});

		it('should update features on scroll', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const features = [
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
			] as unknown as IFeature[];
			const spies = features.map((feature) => jest.spyOn(feature, 'update'));
			new Carousel(el, { features });

			triggerScroll(el, { left: 100 });

			expect(spies[0]).toHaveBeenCalledTimes(1);
			expect(spies[0]).toHaveBeenLastCalledWith(
				expect.objectContaining({ type: UpdateType.SCROLL }),
			);
		});

		it('should update features on resize', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const features = [
				{ init: jest.fn(), update: jest.fn() },
			] as unknown as IFeature[];
			const spies = features.map((feature) => jest.spyOn(feature, 'update'));
			new Carousel(el, { features });

			triggerResize();

			expect(spies[0]).toHaveBeenCalledTimes(1);
			expect(spies[0]).toHaveBeenLastCalledWith(
				expect.objectContaining({ type: UpdateType.RESIZE }),
			);
		});

		it('should update features on forced update', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const features = [
				{ init: jest.fn(), update: jest.fn(), destroy: jest.fn() },
			] as unknown as IFeature[];
			const spies = features.map((feature) => jest.spyOn(feature, 'update'));
			const carousel = new Carousel(el, { features });
			carousel.update();

			expect(spies[0]).toHaveBeenCalledTimes(1);
			expect(spies[0]).toHaveBeenLastCalledWith(
				expect.objectContaining({ type: UpdateType.FORCED }),
			);
		});

	});


	describe('update()', () => {

		it('should force-update items', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			const items = [...el.children];
			const carousel = new Carousel(el);
			expect(carousel.items).toEqual(items);

			const clone = items[0].cloneNode(true);
			el.appendChild(clone);
			expect(carousel.items).toEqual(items);

			carousel.update();
			expect(carousel.items).toEqual([...items, clone]);
		});

		it('should force-update index', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);

			el.mockedLeft = 100;
			expect(carousel.index).toEqual([0]);

			carousel.update();
			expect(carousel.index).toEqual([1]);
		});

		it('should force-update pages', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([[0], [1], [2]]);

			el.firstElementChild?.remove();
			expect(carousel.pages).toEqual([[0], [1], [2]]);

			carousel.update();
			expect(carousel.pages).toEqual([[0], [1]]);
		});

		it('should force-update page index', () => {
			document.body.innerHTML = fixture(3);
			const el = querySelector('.caroucssel');
			el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
			const carousel = new Carousel(el);
			expect(carousel.pageIndex).toBe(0);

			el.mockedLeft = 100;
			expect(carousel.pageIndex).toBe(0);

			carousel.update();
			expect(carousel.pageIndex).toBe(1);
		});

	});


	describe('destroy()', () => {

		it('should cleanup dom', () => {
			const structure = fixture(3);
			document.body.innerHTML = structure;
			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom with custom id', () => {
			const structure = fixture(3, { id: 'custom-id' });
			document.body.innerHTML = structure;
			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el);

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom from features', () => {
			const structure = fixture(3);
			document.body.innerHTML = structure;
			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				features: [
					new Pagination(),
					new Buttons(),
				],
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without scrollbars mask', () => {
			const structure = fixture(3);
			document.body.innerHTML = structure;
			const el = querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				features: [
					new Buttons(),
					new Pagination(),
					new Mask({ enabled: false }),
				],
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

	});

});
