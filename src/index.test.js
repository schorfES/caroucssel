import {Carousel} from './index';


let mockScrollbarDimensions = null;

jest.mock('./utils/Scrollbar', () => {
	return {
		Scrollbar: class {
			get dimensions() {
				return mockScrollbarDimensions;
			}
		}
	};
});

function __fixture(count, options = null) {
	options = {id: null, ...options};

	return `
		<div class="container">
			<div class="caroucssel"${options.id ? ` id="${options.id}"` : ''}>
				${[...Array(count).keys()].map((index) => `
					<div class="item item-${index}">Item ${index}</div>
				`).join('')}
			</div>
		</div>
	`;
}

function __triggerResize() {
	const event = document.createEvent('UIEvents');
	event.initUIEvent('resize', true, false, window, 0);
	window.dispatchEvent(event);
	jest.runAllTimers();
}

function __triggerScroll(element) {
	const event = document.createEvent('Event');
	event.initEvent('scroll');
	element.dispatchEvent(event);
	jest.runAllTimers();
}

function __triggerClick(element) {
	const event = document.createEvent('Event');
	event.initEvent('click');
	element.dispatchEvent(event);
	jest.runAllTimers();
}


describe('Caroucssel', () => {

	beforeEach(() => {
		jest.useFakeTimers();
		mockScrollbarDimensions = {width: 0, height: 0};
	});


	afterEach(() => {
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});


	describe('core', () => {

		it('should throw an error when not passing an element', () => {
			expect(() => new Carousel())
				.toThrow(new Error('Carousel needs a dom element but "undefined" was passed.'));

			expect(() => new Carousel(true))
				.toThrow(new Error('Carousel needs a dom element but "boolean" was passed.'));

			expect(() => new Carousel({}))
				.toThrow(new Error('Carousel needs a dom element but "object" was passed.'));
		});

		it('should render empty', () => {
			document.body.innerHTML = __fixture(0);

			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.el).toBe(el);
		});

		it('should return given element', () => {
			document.body.innerHTML = __fixture(3);

			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.el).toBe(el);
		});

		it('should add id-attribute when element has no id', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');

			new Carousel(el);
			expect(/^caroucssel-[0-9]*$/.test(el.id)).toBeTruthy();
		});

		it('should create unique ids for multiple instances', () => {
			document.body.innerHTML = `${__fixture(3)}${__fixture(3)}`;
			const instances = [];
			[...document.querySelectorAll('.caroucssel')].forEach((el) =>
				instances.push(new Carousel(el)));

			expect.assertions(2);
			instances.forEach((el, index) =>
				expect(el.id).toBe(`caroucssel-${index + 1}`));
		});

		it('should not add id-attribute when element already has an id', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');

			new Carousel(el);
			expect(el.id).toBe('custom-id');
		});

		it('should return current index of visible item', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);

			el.scrollTo({left: 120});
			expect(carousel.index).toEqual([1]);
		});

		it('should return current index(s) when multiple items are visible', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 120;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 40);

			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0, 1, 2]);

			el.scrollTo({left: 120});
			expect(carousel.index).toEqual([3, 4, 5]);
		});

		it('should return current index when no items are available', () => {
			document.body.innerHTML = __fixture(0);

			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0]);
		});

		it('should set initial index as option', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el, {index: [2]});
			expect(carousel.index).toEqual([2]);
		});

		it('should set initial index as option when multiple items are visible', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 120;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 40);

			const carousel = new Carousel(el, {index: [2]});
			expect(carousel.index).toEqual([2, 3, 4]);
		});

		it('should return current index(s) at expected bounds (using 25% rule)', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.index).toEqual([0, 1]);

			el.scrollTo({left: 50 * 0.25});
			expect(carousel.index).toEqual([0, 1]);

			el.scrollTo({left: 50 * 0.25 + 1});
			expect(carousel.index).toEqual([1]);

			el.scrollTo({left: 50 * 0.75 - 1});
			expect(carousel.index).toEqual([1]);

			el.scrollTo({left: 50 * 0.75});
			expect(carousel.index).toEqual([1, 2]);

			el.scrollTo({left: 50 * 1});
			expect(carousel.index).toEqual([1, 2]);
		});

		it('should return pages when each item is at 100% width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 100);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when each item is at 75% width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 75);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2, 3], [4], [5], [6, 7], [8], [9],
			]);
		});

		it('should return pages when each item is at 66.66% width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 66.66);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1, 2], [3], [4, 5], [6], [7, 8], [9],
			]);
		});

		it('should return pages when each item is at 50% width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
			]);
		});

		it('should return pages when each item is at 33.33% width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 33.33);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1, 2], [3, 4, 5], [6, 7, 8], [9],
			]);
		});

		it('should return pages when each item is at 120% width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 120);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should return pages when item is at 0px width', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 0);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			]);
		});

		it('should return pages for each item when element width is 0px', () => {
			document.body.innerHTML = __fixture(10, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 0;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 100);

			const carousel = new Carousel(el);
			expect(carousel.pages).toEqual([
				[0], [1], [2], [3], [4], [5], [6], [7], [8], [9],
			]);
		});

		it('should ignore <link> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const hidden = document.createElement('link');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <link> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const hidden = document.createElement('link');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <noscript> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const hidden = document.createElement('noscript');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <script> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const hidden = document.createElement('script');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <style> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const hidden = document.createElement('style');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore <title> in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const hidden = document.createElement('title');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(3);
		});

		it('should ignore with "hidden" attribute in items', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			el.children[0].hidden = true;

			const hidden = document.createElement('div');
			hidden.setAttribute('hidden', 'hidden');
			el.appendChild(hidden);

			const carousel = new Carousel(el);
			expect(carousel.items).toHaveLength(2);
		});

		it('should filter items based on filter function', () => {
			document.body.innerHTML = __fixture(9);
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				filterItem: (item, index) => (index % 3) === 0
			});
			expect(carousel.items).toHaveLength(3);
		});

	});


	describe('buttons', () => {

		it('should add buttons', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add buttons with custom options', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonClassName: 'custom-button-class',
				buttonPrevious: {
					className: 'custom-previous-button-class',
					label: 'Custom previous label',
					title: 'Custom previous title'
				},
				buttonNext: {
					className: 'custom-next-button-class',
					label: 'Custom next label',
					title: 'Custom next title'
				}
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add buttons with custom template', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonClassName: 'custom-button-class',
				buttonPrevious: {
					className: 'custom-previous-button-class',
					label: 'Custom previous label',
					title: 'Custom previous title'
				},
				buttonNext: {
					className: 'custom-next-button-class',
					label: 'Custom next label',
					title: 'Custom next title'
				},
				buttonTemplate: jest.fn(({className, label, title}) =>
					`<span class="${className}" title="${title}">${label}</span>`)
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
			expect(options.buttonTemplate).toHaveBeenNthCalledWith(1, {
				className: 'custom-button-class custom-previous-button-class',
				controls: 'custom-id',
				label: 'Custom previous label',
				title: 'Custom previous title'
			});
			expect(options.buttonTemplate).toHaveBeenNthCalledWith(2, {
				className: 'custom-button-class custom-next-button-class',
				controls: 'custom-id',
				label: 'Custom next label',
				title: 'Custom next title'
			});
		});

		it('should handle buttons with custom template that returns empty string', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonTemplate: jest.fn(() => '')
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
		});

		it('should handle buttons with custom template that returns null', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonTemplate: jest.fn(() => null)
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
		});

		it('should handle buttons with custom template that returns undefined', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true,
				buttonTemplate: jest.fn(() => undefined)
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.buttonTemplate).toHaveBeenCalledTimes(2);
		});


		it('should add disabled buttons without items', () => {
			document.body.innerHTML = __fixture(0);
			const el = document.querySelector('.caroucssel');
			new Carousel(el, { hasButtons: true });

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(document.querySelectorAll('.button[disabled]')).toHaveLength(2);
		});

		it('should re-render buttons on resize', () => {
			document.body.innerHTML = __fixture(4);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			new Carousel(el, { hasButtons: true });

			expect(document.querySelectorAll('.button[disabled]')).toHaveLength(1);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 25);
			__triggerResize();
			expect(document.querySelectorAll('.button[disabled]')).toHaveLength(2);
		});

		it('should update buttons on scroll', () => {
			document.body.innerHTML = __fixture(6);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			new Carousel(el, { hasButtons: true });

			const buttons = document.querySelectorAll('.button');
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

			el.scrollTo({left: 100});
			__triggerScroll(el);
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			el.scrollTo({left: 200});
			__triggerScroll(el);
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);
		});

		it('should update buttons manually', () => {
			document.body.innerHTML = __fixture(6);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			const carousel = new Carousel(el, { hasButtons: true });

			const buttons = document.querySelectorAll('.button');
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

			el.scrollTo({left: 100});
			carousel.update();
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			el.scrollTo({left: 200});
			carousel.update();
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);
		});

		it('should handle clicks', () => {
			document.body.innerHTML = __fixture(6);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			new Carousel(el, { hasButtons: true });


			const callback = jest.spyOn(el, 'scrollTo');
			const buttons = document.querySelectorAll('.button');

			__triggerClick(buttons[1]); // navigate forwards
			__triggerScroll(el);
			el.scrollLeft = 100;
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenNthCalledWith(1, { left: 100, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			__triggerClick(buttons[1]); // navigate forwards
			__triggerScroll(el);
			el.scrollLeft = 200;
			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback).toHaveBeenNthCalledWith(2, { left: 200, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);

			__triggerClick(buttons[0]); // navigate backwards
			__triggerScroll(el);
			el.scrollLeft = 100;
			expect(callback).toHaveBeenCalledTimes(3);
			expect(callback).toHaveBeenNthCalledWith(3, { left: 100, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

			__triggerClick(buttons[0]); // navigate backwards
			__triggerScroll(el);
			el.scrollLeft = 0;
			expect(callback).toHaveBeenCalledTimes(4);
			expect(callback).toHaveBeenNthCalledWith(4, { left: 0, behavior: 'smooth' });
			expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);
		});

	});


	describe('pagination', () => {

		it('should add pagination', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add pagination with custom options', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true,
				paginationClassName: 'custom-pagination-class',
				paginationLabel: jest.fn(({index}) => {
					switch (index) {
						case 0: return 'first';
						case 1: return 'second';
						case 2: return 'third';
						default: return 'un-defined';
					}
				}),
				paginationTitle: jest.fn(({index}) => {
					let name;
					switch (index) {
						case 0: name = 'first'; break;
						case 1: name = 'second'; break;
						case 2: name = 'third'; break;
						default: name = 'un-defined'; break;
					}
					return `Go to ${name} item`;
				})
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();

			expect(options.paginationLabel).toHaveBeenCalledTimes(3);
			expect(options.paginationLabel).toHaveBeenNthCalledWith(1, {
				index: 0,
				page: [0],
				pages: [[0], [1], [2]],
			});

			expect(options.paginationTitle).toHaveBeenCalledTimes(3);
			expect(options.paginationTitle).toHaveBeenNthCalledWith(3, {
				index: 2,
				page: [2],
				pages: [[0], [1], [2]],
			});
		});

		it('should add pagination with custom template', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true,
				paginationClassName: 'custom-pagination-class',
				paginationLabel: jest.fn(({index}) => {
					switch (index) {
						case 0: return 'first';
						case 1: return 'second';
						case 2: return 'third';
						default: return 'un-defined';
					}
				}),
				paginationTitle: jest.fn(({index}) => {
					let name;
					switch (index) {
						case 0: name = 'first'; break;
						case 1: name = 'second'; break;
						case 2: name = 'third'; break;
						default: name = 'un-defined'; break;
					}
					return `Go to ${name} page`;
				}),
				paginationTemplate: jest.fn(({className, controls, pages, label, title}) =>
					`<div class="${className}" aria-controls="${controls}">
						${pages.map((page, index) => `
							<div class="item" aria-label="${title({index})}">
								${label({index})}
							</div>`
						).join('')}
					</div>`)
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should handle pagination with custom template that returns empty string', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true,
				paginationTemplate: jest.fn(() => '')
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should handle pagination with custom template that returns null', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true,
				paginationTemplate: jest.fn(() => null)
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should handle pagination with custom template that returns undefined', () => {
			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true,
				paginationTemplate: jest.fn(() => undefined)
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
			expect(options.paginationTemplate).toHaveBeenCalledTimes(1);
		});

		it('should not add pagination without items', () => {
			document.body.innerHTML = __fixture(0);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 100);
			new Carousel(el, { hasPagination: true });

			const pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);
		});

		it('should not add pagination with single item', () => {
			document.body.innerHTML = __fixture(1);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 100);
			new Carousel(el, { hasPagination: true });

			const pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);
		});

		it('should re-render pagination on resize', () => {
			document.body.innerHTML = __fixture(4);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			new Carousel(el, { hasPagination: true });

			let pagination = document.querySelectorAll('.pagination');
			let pages = pagination[0].querySelectorAll('li');
			expect(pagination).toHaveLength(1);
			expect(pages).toHaveLength(2);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 100);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			pages = pagination[0].querySelectorAll('li');
			expect(pagination).toHaveLength(1);
			expect(pages).toHaveLength(4);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 25);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			expect(pagination).toHaveLength(0);

			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			__triggerResize();
			pagination = document.querySelectorAll('.pagination');
			pages = pagination[0].querySelectorAll('li');
			expect(pagination).toHaveLength(1);
			expect(pages).toHaveLength(2);
		});

		it('should update pagination on scroll', () => {
			document.body.innerHTML = __fixture(6);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			new Carousel(el, { hasPagination: true });

			let pagination = document.querySelectorAll('.pagination > li > button');
			expect(pagination).toHaveLength(3);
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

			el.scrollTo({left: 100});
			__triggerScroll(el);
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

			el.scrollTo({left: 200});
			__triggerScroll(el);
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
		});

		it('should update pagination manually', () => {
			document.body.innerHTML = __fixture(6);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			const carousel = new Carousel(el, { hasPagination: true });

			let pagination = document.querySelectorAll('.pagination > li > button');
			expect(pagination).toHaveLength(3);
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

			el.scrollTo({left: 100});
			carousel.update()
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

			el.scrollTo({left: 200});
			carousel.update()
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
		});

		it('should handle clicks', () => {
			document.body.innerHTML = __fixture(6);
			const el = document.querySelector('.caroucssel');
			el.mockWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockWidth = 50);
			new Carousel(el, { hasPagination: true });


			const callback = jest.spyOn(el, 'scrollTo');
			const pagination = document.querySelectorAll('.pagination > li > button');

			__triggerClick(pagination[1]);
			__triggerScroll(el);
			el.scrollLeft = 100;
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenNthCalledWith(1, { left: 100, behavior: 'smooth' });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, true, false]);

			__triggerClick(pagination[0]);
			__triggerScroll(el);
			el.scrollLeft = 0;
			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback).toHaveBeenNthCalledWith(2, { left: 0, behavior: 'smooth' });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([true, false, false]);

			__triggerClick(pagination[2]);
			__triggerScroll(el);
			el.scrollLeft = 200;
			expect(callback).toHaveBeenCalledTimes(3);
			expect(callback).toHaveBeenNthCalledWith(3, { left: 200, behavior: 'smooth' });
			expect([...pagination].map(({ disabled }) => disabled)).toEqual([false, false, true]);
		});

	});


	describe('scrollbars', () => {
		it('should wrap mask element', () => {
			mockScrollbarDimensions = {width: 15, height: 15};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');

			new Carousel(el);
			expect(el.parentNode.className).toBe('caroucssel-mask');
			expect(el.parentNode.style.overflow).toBe('hidden');
			expect(el.parentNode.style.height).toBe('100%');
		});

		it('should detect invisible scrollbar', () => {
			mockScrollbarDimensions = {width: 0, height: 0};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
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
			mockScrollbarDimensions = {width: 15, height: 15};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
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
			mockScrollbarDimensions = {width: 15, height: 15};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');
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
			mockScrollbarDimensions = {width: 1, height: 1};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');

			new Carousel(el, {hasScrollbars: true});
			expect(el.getAttribute('style')).toBeNull();
		});

	});


	describe('destroy', () => {

		it('should cleanup dom', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el);

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without buttons', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				hasButtons: false,
				hasPagination: true
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without pagiantion', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				hasButtons: true,
				hasPagination: false
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

		it('should cleanup dom without scrollbars mask', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = document.querySelector('.caroucssel');
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
