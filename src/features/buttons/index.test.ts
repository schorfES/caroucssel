import { fixture, querySelector, triggerClick, triggerResize, triggerScroll } from '../../__setup__/helpers';
import { Carousel } from '../../carousel';

import { Buttons, Context } from './index';


describe('Buttons feature', () => {

	beforeEach(() => {
		jest.useFakeTimers();
	});


	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should return a name', () => {
		const feature = new Buttons();
		expect(feature.name).toBe('buildin:buttons');
	});

	it('should add buttons', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const options = {
			features: [new Buttons()],
		};
		new Carousel(el, options);

		expect(document.body.innerHTML).toMatchSnapshot();
	});

	it('should add buttons with custom options', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const options = {
			features: [new Buttons({
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
			template: jest.fn<string, Context[]>(({ className, label, title }) =>
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
			features: [new Buttons(options)],
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

	it('should add buttons when carousel element is not attached to dom', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		el.remove();

		expect(() => new Carousel(el, { features: [new Buttons()] })).not.toThrow();
	});

	it('should handle buttons with custom template that returns empty string', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		const template: jest.Mock<string, []> = jest.fn(() => '');

		new Carousel(el, {
			features: [new Buttons({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(2);
	});

	it('should handle buttons with custom template that returns null', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		// @ts-expect-error test when js custom implementation returns null
		const template: jest.Mock<string, []> = jest.fn(() => null);

		new Carousel(el, {
			features: [new Buttons({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(2);
	});

	it('should handle buttons with custom template that returns undefined', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		// @ts-expect-error test when js custom implementation returns undefined
		const template: jest.Mock<string, [Context]> = jest.fn(() => undefined);

		new Carousel(el, {
			features: [new Buttons({ template })],
		});

		expect(document.body.innerHTML).toMatchSnapshot();
		expect(template).toHaveBeenCalledTimes(2);
	});


	it('should add disabled buttons without items', () => {
		document.body.innerHTML = fixture(0);
		const el = querySelector('.caroucssel');
		const options = {
			features: [new Buttons()],
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
			features: [new Buttons()],
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
			features: [new Buttons()],
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
			features: [new Buttons()],
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
			features: [new Buttons()],
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

	it('should destroy', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		const carousel = new Carousel(el, {
			features: [new Buttons()],
		});
		carousel.destroy();

		expect(document.body.innerHTML).toBe(structure);
	});

	it('should destroy when buttons are not attached to dom', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		const carousel = new Carousel(el, {
			features: [new Buttons()],
		});

		const buttons = document.querySelectorAll('.button');
		buttons.forEach((button) => button.remove());
		carousel.destroy();

		expect(document.body.innerHTML).toBe(structure);
	});

	it('should destroy when buttons are not rendered', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		const carousel = new Carousel(el, {
			features: [new Buttons({
				template: () => '',
			})],
		});
		carousel.destroy();

		expect(document.body.innerHTML).toBe(structure);
	});

});
