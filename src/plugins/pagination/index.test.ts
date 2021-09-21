import { fixture, querySelector, triggerClick, triggerResize, triggerScroll } from '../../__setup__/helpers';
import { Carousel } from '../../caroucssel';
import { ScrollbarDimensions } from '../../utils/scrollbar';

import { Pagination, Params, TextParams } from './index';


let mockScrollbarDimensions: ScrollbarDimensions | null = null;

jest.mock('../../utils/scrollbar', () => {
	return {
		Scrollbar: class {
			get dimensions() {
				return mockScrollbarDimensions;
			}
		},
	};
});

describe('Pagination plugin', () => {

	beforeEach(() => {
		jest.useFakeTimers();
		mockScrollbarDimensions = { height: 0 };
	});


	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should add pagination', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		new Carousel(el, {
			plugins: [new Pagination()],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
	});

	it('should add pagination with custom options', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		const label: jest.Mock<string, [TextParams]> = jest.fn(
			({ index }) => {
				switch (index) {
					case 0: return 'first';
					case 1: return 'second';
					case 2: return 'third';
					default: return 'un-defined';
				}
			},
		);

		const title: jest.Mock<string, [TextParams]> = jest.fn(
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
			plugins: [
				new Pagination({
					label,
					title,
					className: 'custom-pagination-class',
				}),
			],
		});

		expect(document.body.innerHTML).toMatchSnapshot();

		expect(label).toHaveBeenCalledTimes(3);
		expect(label).toHaveBeenNthCalledWith(1, {
			index: 0,
			page: [0],
			pages: [[0], [1], [2]],
		});

		expect(title).toHaveBeenCalledTimes(3);
		expect(title).toHaveBeenNthCalledWith(3, {
			index: 2,
			page: [2],
			pages: [[0], [1], [2]],
		});
	});

	it('should add pagination with custom template', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		const label: jest.Mock<string, [TextParams]> = jest.fn(
			({ index }) => {
				switch (index) {
					case 0: return 'first';
					case 1: return 'second';
					case 2: return 'third';
					default: return 'un-defined';
				}
			},
		);

		const title: jest.Mock<string, [TextParams]> = jest.fn(
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

		const template: jest.Mock<string, [Params]> = jest.fn(
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
			plugins: [
				new Pagination({
					label,
					title,
					template,
					className: 'custom-pagination-class',
				}),
			],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(1);
	});

	it('should handle pagination with custom template that returns empty string', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		const template: jest.Mock<string, []> = jest.fn(() => '');

		new Carousel(el, {
			plugins: [new Pagination({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(1);
	});

	it('should handle pagination with custom template that returns null', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		// Test when js custom implementation returns null
		// @ts-ignore
		const template: jest.Mock<string, []> = jest.fn(() => null);

		new Carousel(el, {
			plugins: [new Pagination({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(1);
	});

	it('should handle pagination with custom template that returns undefined', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		// Test when js custom implementation returns undefined
		// @ts-ignore
		const template: jest.Mock<string, []> = jest.fn(() => undefined);

		new Carousel(el, {
			plugins: [new Pagination({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(1);
	});

	it('should not add pagination without items', () => {
		document.body.innerHTML = fixture(0);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
		new Carousel(el, {
			plugins: [new Pagination()],
		});

		const pagination = document.querySelectorAll('.pagination');
		expect(pagination).toHaveLength(0);
	});

	it('should not add pagination with single item', () => {
		document.body.innerHTML = fixture(1);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
		new Carousel(el, {
			plugins: [new Pagination()],
		});

		const pagination = document.querySelectorAll('.pagination');
		expect(pagination).toHaveLength(0);
	});

	it('should re-render pagination on resize', () => {
		document.body.innerHTML = fixture(4);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		new Carousel(el, {
			plugins: [new Pagination()],
		});

		let pagination = document.querySelectorAll('.pagination');
		let pages = pagination[0].querySelectorAll('li');
		expect(pagination).toHaveLength(1);
		expect(pages).toHaveLength(2);

		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
		triggerResize();
		pagination = document.querySelectorAll('.pagination');
		pages = pagination[0].querySelectorAll('li');
		expect(pagination).toHaveLength(1);
		expect(pages).toHaveLength(4);

		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 25);
		triggerResize();
		pagination = document.querySelectorAll('.pagination');
		expect(pagination).toHaveLength(0);

		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 10);
		triggerResize();
		pagination = document.querySelectorAll('.pagination');
		expect(pagination).toHaveLength(0);

		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		triggerResize();
		pagination = document.querySelectorAll('.pagination');
		pages = pagination[0].querySelectorAll('li');
		expect(pagination).toHaveLength(1);
		expect(pages).toHaveLength(2);
	});

	it('should update pagination on scroll', () => {
		document.body.innerHTML = fixture(6);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		new Carousel(el, {
			plugins: [new Pagination()],
		});

		const pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');
		expect(pagination).toHaveLength(3);
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

		triggerScroll(el, { left: 100 });
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

		triggerScroll(el, { left: 200 });
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
	});

	it('should update pagination manually', () => {
		document.body.innerHTML = fixture(6);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		const carousel = new Carousel(el, {
			plugins: [new Pagination()],
		});

		let pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');
		expect(pagination).toHaveLength(3);
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

		el.scrollTo({ left: 100 });
		carousel.update();
		pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

		el.scrollTo({ left: 200 });
		carousel.update();
		pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
	});

	it('should handle clicks', () => {
		document.body.innerHTML = fixture(6);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		new Carousel(el, {
			plugins: [new Pagination()],
		});

		const callback = jest.spyOn(el, 'scrollTo');
		const pagination = document.querySelectorAll<HTMLButtonElement>('.pagination > li > button');

		triggerClick(pagination[1]);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenNthCalledWith(1, { left: 100, behavior: 'smooth' });
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

		triggerClick(pagination[0]);
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenNthCalledWith(2, { left: 0, behavior: 'smooth' });
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

		triggerClick(pagination[2]);
		expect(callback).toHaveBeenCalledTimes(3);
		expect(callback).toHaveBeenNthCalledWith(3, { left: 200, behavior: 'smooth' });
		expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);

		triggerClick(pagination[2]); // doesn't work, disabled
		expect(callback).toHaveBeenCalledTimes(3);
	});

});
