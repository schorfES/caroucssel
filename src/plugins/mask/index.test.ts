import { fixture, querySelector } from '../../__setup__/helpers';
import { Carousel } from '../../caroucssel';
import { ScrollbarDimensions } from '../../utils/scrollbar';

import { Mask } from './index';


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

describe('Mask plugin', () => {

	beforeEach(() => {
		jest.useFakeTimers();
		mockScrollbarDimensions = { height: 0 };
	});


	afterEach(() => {
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should wrap mask element', () => {
		mockScrollbarDimensions = { height: 15 };

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		new Carousel(el);
		const parent = el.parentNode as HTMLElement;
		expect(parent.className).toBe('caroucssel-mask');
		expect(parent.style.overflow).toBe('hidden');
		expect(parent.style.height).toBe('100%');
	});

	it('should detect invisible scrollbar', () => {
		mockScrollbarDimensions = { height: 0 };

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
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

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
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

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');
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

		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel');

		new Carousel(el, {
			plugins: [new Mask({ enabled: false })],
		});
		expect(el.getAttribute('style')).toBeNull();
	});

});
