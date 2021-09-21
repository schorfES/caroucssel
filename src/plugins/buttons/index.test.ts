import { fixture, querySelector, triggerClick, triggerResize, triggerScroll } from '../../__setup__/helpers';
import { Carousel } from '../../carousel';
import { ScrollbarDimensions } from '../../utils/scrollbar';

import { Buttons, Params } from './index';


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

describe('Buttons plugin', () => {

	beforeEach(() => {
		jest.useFakeTimers();
		mockScrollbarDimensions = { height: 0 };
	});


	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should add buttons', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const options = {
			plugins: [new Buttons()],
		};
		new Carousel(el, options);

		expect(document.body.innerHTML).toMatchSnapshot();
	});

	it('should add buttons with custom options', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const options = {
			plugins: [new Buttons({
				className: 'custom-button-class',
				previousClassName: 'custom-previous-button-class',
				previousLabel: 'Custom previous label',
				previousTitle: 'Custom previous title',
				nextClassName: 'custom-next-button-class',
				nextLabel: 'Custom next label',
				nextTitle: 'Custom next title',
			})],
		};
		new Carousel(el, options);

		expect(document.body.innerHTML).toMatchSnapshot();
	});

	it('should add buttons with custom template', () => {
		document.body.innerHTML = fixture(3, { id: 'custom-id' });
		const el = querySelector('.caroucssel');
		const options = {
			template: jest.fn<string, Params[]>(({ className, label, title }) =>
				`<span class="${className}" title="${title}">${label}</span>`),
			className: 'custom-button-class',

			nextClassName: 'custom-next-button-class',
			nextLabel: 'Custom next label',
			nextTitle: 'Custom next title',

			previousClassName: 'custom-previous-button-class',
			previousLabel: 'Custom previous label',
			previousTitle: 'Custom previous title',
		};
		new Carousel(el, {
			plugins: [new Buttons(options)],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(options.template).toHaveBeenCalledTimes(2);
		expect(options.template).toHaveBeenNthCalledWith(1, {
			className: 'custom-button-class custom-next-button-class',
			controls: 'custom-id',
			label: 'Custom next label',
			title: 'Custom next title',
		});
		expect(options.template).toHaveBeenNthCalledWith(2, {
			className: 'custom-button-class custom-previous-button-class',
			controls: 'custom-id',
			label: 'Custom previous label',
			title: 'Custom previous title',
		});
	});

	it('should handle buttons with custom template that returns empty string', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		const template: jest.Mock<string, []> = jest.fn(() => '');

		new Carousel(el, {
			plugins: [new Buttons({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(2);
	});

	it('should handle buttons with custom template that returns null', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		// Test when js custom implementation returns null
		// @ts-ignore
		const template: jest.Mock<string, []> = jest.fn(() => null);

		new Carousel(el, {
			plugins: [new Buttons({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(2);
	});

	it('should handle buttons with custom template that returns undefined', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		// Test when js custom implementation returns undefined
		// @ts-ignore
		const template: jest.Mock<string, [Params]> = jest.fn(() => undefined);

		new Carousel(el, {
			plugins: [new Buttons({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(2);
	});


	it('should add disabled buttons without items', () => {
		document.body.innerHTML = fixture(0);
		const el = querySelector('.caroucssel');
		const options = {
			plugins: [new Buttons()],
		};
		new Carousel(el, options);

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(document.querySelectorAll('.button[disabled]')).toHaveLength(2);
	});

	it('should re-render buttons on resize', () => {
		document.body.innerHTML = fixture(4);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		const options = {
			plugins: [new Buttons()],
		};
		new Carousel(el, options);

		expect(document.querySelectorAll('.button[disabled]')).toHaveLength(1);

		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 25);
		triggerResize();
		expect(document.querySelectorAll('.button[disabled]')).toHaveLength(2);
	});

	it('should update buttons on scroll', () => {
		document.body.innerHTML = fixture(6);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		const options = {
			plugins: [new Buttons()],
		};
		new Carousel(el, options);

		const buttons = document.querySelectorAll<HTMLButtonElement>('.button');
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

		triggerScroll(el, { left: 100 });
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

		triggerScroll(el, { left: 200 });
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);
	});

	it('should update buttons manually', () => {
		document.body.innerHTML = fixture(6);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 50);
		const options = {
			plugins: [new Buttons()],
		};
		const carousel = new Carousel(el, options);

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
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
		const options = {
			plugins: [new Buttons()],
		};
		new Carousel(el, options);

		const callback = jest.spyOn(el, 'scrollTo');
		const buttons = document.querySelectorAll<HTMLButtonElement>('.button');

		triggerClick(buttons[1]); // navigate forwards
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenNthCalledWith(1, { left: 100, behavior: 'smooth' });
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

		triggerClick(buttons[1]); // navigate forwards
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenNthCalledWith(2, { left: 200, behavior: 'smooth' });
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, true]);

		triggerClick(buttons[1]); // navigate forwards (doesn't work, disabled)
		expect(callback).toHaveBeenCalledTimes(2);

		triggerClick(buttons[0]); // navigate backwards
		expect(callback).toHaveBeenCalledTimes(3);
		expect(callback).toHaveBeenNthCalledWith(3, { left: 100, behavior: 'smooth' });
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([false, false]);

		triggerClick(buttons[0]); // navigate backwards
		expect(callback).toHaveBeenCalledTimes(4);
		expect(callback).toHaveBeenNthCalledWith(4, { left: 0, behavior: 'smooth' });
		expect([...buttons].map(({ disabled }) => disabled)).toEqual([true, false]);

		triggerClick(buttons[0]); // navigate backwards (doesn't work, disabled)
		expect(callback).toHaveBeenCalledTimes(4);
	});

});
