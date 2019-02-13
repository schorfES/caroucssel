import {Carousel} from './index';


let mockScrollbarDimensions = null;

jest.mock('./utils/Scrollbar', () => {
	return {
		Scrollbar: class {
			get dimensions() {
				return mockScrollbarDimensions;
			}
		}
	}
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
	`
}


describe('Caroucssel', () => {

	beforeEach(() => {
		mockScrollbarDimensions = {width: 0, height: 0};
	});

	afterEach(() => {
		document.body.innerHTML = '';
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

		it('should not add id-attribute when element already has an id', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');

			new Carousel(el);
			expect(el.id).toBe('custom-id');
		});

		it('should detect invisible scrollbar of OS by adding classname', () => {
			mockScrollbarDimensions = {width: 1, height: 1};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');

			new Carousel(el);
			expect(Array.from(el.classList)).toEqual([
				'caroucssel',
				'has-invisible-scrollbar'
			]);
		});

		it('should detect visible scrollbar of OS by adding classname', () => {
			mockScrollbarDimensions = {width: 0, height: 0};

			document.body.innerHTML = __fixture(3);
			const el = document.querySelector('.caroucssel');

			new Carousel(el);
			expect(Array.from(el.classList)).toEqual([
				'caroucssel',
				'has-visible-scrollbar'
			]);
		});

	});


	describe('buttons', () => {

		it('should add buttons', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			const options = {
				hasButtons: true
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add buttons with custom options', () => {
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

	});


	describe('pagination', () => {

		it('should add pagination', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			const options = {
				hasPagination: true
			};
			new Carousel(el, options);

			expect(document.body.innerHTML).toMatchSnapshot();
		});

		it('should add pagination with custom options', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
			const el = document.querySelector('.caroucssel');
			const items = [...el.children];
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
			expect(options.paginationLabel).toHaveBeenNthCalledWith(1, {index: 0, item: items[0], items});

			expect(options.paginationTitle).toHaveBeenCalledTimes(3);
			expect(options.paginationTitle).toHaveBeenNthCalledWith(3, {index: 2, item: items[2], items});
		});

		it('should add pagination with custom template', () => {
			document.body.innerHTML = __fixture(3, {id: 'custom-id'});
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
				}),
				paginationTemplate: jest.fn(({className, controls, items, label, title}) =>
					`<div class="${className}" aria-controls="${controls}">
						${items.map((item, index) => `
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

	});


	describe('destroy', () => {

		it('should cleanup dom', () => {
			const structure = __fixture(3);
			document.body.innerHTML = structure;
			const el = document.querySelector('.caroucssel');
			const carousel = new Carousel(el, {
				hasButtons: true,
				hasPagination: true
			});

			carousel.destroy();
			expect(document.body.innerHTML).toBe(structure);
		});

	});

});
