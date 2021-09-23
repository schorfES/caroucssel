import { fixture, querySelector } from '../../__setup__/helpers';
import { Carousel } from '../../carousel';

import { ScrollbarDimensions } from './scrollbar';

import { Mask } from './index';


let mockScrollbarDimensions: ScrollbarDimensions | null = null;

jest.mock('../../features/mask/scrollbar', () => {
	return {
		Scrollbar: class {
			get dimensions() {
				return mockScrollbarDimensions;
			}
		},
	};
});

describe('Mask feature', () => {

	beforeEach(() => {
		jest.useFakeTimers();
		mockScrollbarDimensions = { height: 0 };
	});


	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should return a name', () => {
		const feature = new Mask();
		expect(feature.name).toBe('buildin:mask');
	});

	it('should wrap mask element', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		new Carousel(el, {
			features: [new Mask()],
		});
		const mask = el.parentNode as HTMLElement;
		expect(mask.tagName).toBe('DIV');
		expect(mask.className).toBe('caroucssel-mask');
		expect(mask.style.overflow).toBe('hidden');
		expect(mask.style.height).toBe('100%');
	});

	it('should wrap mask with custom class name', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		new Carousel(el, {
			features: [new Mask({ className: 'mask' })],
		});
		const mask = el.parentNode as HTMLElement;
		expect(mask.tagName).toBe('DIV');
		expect(mask.className).toBe('mask');
	});

	it('should wrap mask with custom tag name', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		new Carousel(el, {
			features: [new Mask({ tagName: 'section' })],
		});
		const mask = el.parentNode as HTMLElement;
		expect(mask.tagName).toBe('SECTION');
		expect(mask.className).toBe('caroucssel-mask');
	});

	it('should detect invisible scrollbar', () => {
		mockScrollbarDimensions = { height: 0 };

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const style = {};

		Object.defineProperty(el, 'style', { value: style, writable: false });
		Object.defineProperty(el, 'clientWidth', { value: 600, writable: false });
		Object.defineProperty(el, 'scrollWidth', { value: 800, writable: false });

		new Carousel(el, {
			features: [new Mask()],
		});
		expect(style).toEqual({
			marginBottom: '0px',
			height: 'calc(100% + 0px)',
		});
	});

	it('should detect visible scrollbar', () => {
		mockScrollbarDimensions = { height: 15 };

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const style = {};

		Object.defineProperty(el, 'style', { value: style, writable: false });
		Object.defineProperty(el, 'clientWidth', { value: 600, writable: false });
		Object.defineProperty(el, 'scrollWidth', { value: 800, writable: false });

		new Carousel(el, {
			features: [new Mask()],
		});
		expect(style).toEqual({
			marginBottom: '-15px',
			height: 'calc(100% + 15px)',
		});
	});

	it('should detect not existing scrollbar (content is smaller than container)', () => {
		mockScrollbarDimensions = { height: 15 };

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
		const style = {};

		Object.defineProperty(el, 'style', { value: style, writable: false });
		Object.defineProperty(el, 'clientWidth', { value: 800, writable: false });
		Object.defineProperty(el, 'scrollWidth', { value: 200, writable: false });

		new Carousel(el, {
			features: [new Mask()],
		});
		expect(style).toEqual({
			marginBottom: '0px',
			height: 'calc(100% + 0px)',
		});
	});

	it('should use css defaults by not wrapping mask element', () => {
		mockScrollbarDimensions = { height: 1 };

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		new Carousel(el, {
			features: [new Mask({ enabled: false })],
		});
		expect(el.getAttribute('style')).toBeNull();
	});

	it('should disable mask', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		new Carousel(el, {
			features: [new Mask({ enabled: false })],
		});

		const parent = el.parentNode as HTMLElement;
		expect(parent.className).toBe('container');
	});

	it('should destroy', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		const carousel = new Carousel(el, {
			features: [new Mask()],
		});
		carousel.destroy();

		expect(document.body.innerHTML).toBe(structure);
	});

	it('should destroy when not enabled', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		const carousel = new Carousel(el, {
			features: [new Mask({ enabled: false })],
		});
		carousel.destroy();

		expect(document.body.innerHTML).toBe(structure);
	});

});
