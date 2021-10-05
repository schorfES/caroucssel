import { fixture, querySelector, triggerMouse } from '../../__setup__/helpers';
import { Carousel } from '../../carousel';

import { HookEvent, Mouse } from './index';


describe('Mouse feature', () => {

	let rafOriginal: (callback: FrameRequestCallback) => number;

	beforeEach(() => {
		// Mock RequestAnimationFrame
		rafOriginal = window.requestAnimationFrame;
		window.requestAnimationFrame = (callback) => {
			callback(0);
			return 0;
		};

		jest.useFakeTimers();
	});

	afterEach(() => {
		window.requestAnimationFrame = rafOriginal;
		jest.clearAllTimers();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should return a name', () => {
		const feature = new Mouse();
		expect(feature.name).toBe('buildin:mouse');
	});

	it('should change index on drag and drop', () => {
		document.body.innerHTML = fixture(4);
		const el = querySelector('.caroucssel');
		el.mockedLeft = 0;
		el.mockedClientWidth = 300;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 300);
		const carousel = new Carousel(el, {
			features: [new Mouse()],
		});

		triggerMouse(el, 'mouseDown', 0);
		expect(el.scrollLeft).toBe(0);

		triggerMouse(el, 'mouseMove', -200);
		expect(el.scrollLeft).toBe(200);

		triggerMouse(el, 'mouseMove', -250);
		expect(el.scrollLeft).toBe(250);

		triggerMouse(el, 'mouseUp', -250);
		expect(carousel.index).toEqual([1]);
	});

	it('should not change index on drag and drop when page is not available', () => {
		document.body.innerHTML = fixture(1);
		const el = querySelector('.caroucssel');
		el.mockedLeft = 0;
		el.mockedClientWidth = 300;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 300);
		const carousel = new Carousel(el, {
			features: [new Mouse()],
		});

		triggerMouse(el, 'mouseDown', 0);
		expect(el.scrollLeft).toBe(0);

		triggerMouse(el, 'mouseMove', -200);
		expect(el.scrollLeft).toBe(200);

		triggerMouse(el, 'mouseMove', -250);
		expect(el.scrollLeft).toBe(250);

		triggerMouse(el, 'mouseUp', -250);
		expect(carousel.index).toEqual([0]);
	});

	it('should not change index on drag and drop when threshold is not reached', () => {
		document.body.innerHTML = fixture(4);
		const el = querySelector('.caroucssel');
		el.mockedLeft = 0;
		el.mockedClientWidth = 300;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 300);
		const carousel = new Carousel(el, {
			features: [new Mouse()],
		});

		triggerMouse(el, 'mouseDown', 0);
		expect(el.scrollLeft).toBe(0);

		triggerMouse(el, 'mouseMove', -99);
		expect(el.scrollLeft).toBe(99);

		triggerMouse(el, 'mouseUp', -99);
		expect(carousel.index).toEqual([0]);
	});

	it('should show indicator', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel') as HTMLElement;
		new Carousel(el, {
			features: [new Mouse({ indicator: true })],
		});

		expect(el.style.cursor).toBe('grab');

		triggerMouse(el, 'mouseDown', 0);
		expect(el.style.cursor).toBe('grabbing');

		triggerMouse(el, 'mouseUp', 0);
		expect(el.style.cursor).toBe('grab');
	});

	it('should not show indicator by default', () => {
		document.body.innerHTML = fixture(3);
		const el = querySelector('.caroucssel') as HTMLElement;
		new Carousel(el, {
			features: [new Mouse()],
		});

		expect(el.style.cursor).toBe('');

		triggerMouse(el, 'mouseDown', 0);
		expect(el.style.cursor).toBe('');

		triggerMouse(el, 'mouseUp', 0);
		expect(el.style.cursor).toBe('');
	});

	it('should disable user-select, snap-points and scroll-behavior on dragging', () => {
		document.body.innerHTML = fixture(1);
		const el = querySelector('.caroucssel') as HTMLDivElement;
		el.mockedLeft = 0;
		el.mockedClientWidth = 300;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 300);
		new Carousel(el, {
			features: [new Mouse()],
		});
		expect(el.style.userSelect).toBe('');
		expect(el.style.scrollSnapType).toBe('');
		expect(el.style.scrollBehavior).toBe('');

		triggerMouse(el, 'mouseDown', 0);
		expect(el.style.userSelect).toBe('none');
		expect(el.style.scrollSnapType).toBe('none');
		expect(el.style.scrollBehavior).toBe('auto');

		triggerMouse(el, 'mouseMove', -200);
		expect(el.style.userSelect).toBe('none');
		expect(el.style.scrollSnapType).toBe('none');
		expect(el.style.scrollBehavior).toBe('auto');

		triggerMouse(el, 'mouseMove', -250);
		expect(el.style.userSelect).toBe('none');
		expect(el.style.scrollSnapType).toBe('none');
		expect(el.style.scrollBehavior).toBe('auto');

		triggerMouse(el, 'mouseUp', -250);
		expect(el.style.userSelect).toBe('');
		expect(el.style.scrollSnapType).toBe('');
		expect(el.style.scrollBehavior).toBe('');
	});

	it('should call hooks', () => {
		const onStart = jest.fn<void, [HookEvent]>();
		const onDrag = jest.fn<void, [HookEvent]>();
		const onEnd = jest.fn<void, [HookEvent]>();

		document.body.innerHTML = fixture(4);
		const el = querySelector('.caroucssel');
		el.mockedLeft = 0;
		el.mockedClientWidth = 300;
		[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 300);
		new Carousel(el, {
			features: [new Mouse({ onStart, onDrag, onEnd })],
		});
		expect(onStart).not.toHaveBeenCalled();
		expect(onDrag).not.toHaveBeenCalled();
		expect(onEnd).not.toHaveBeenCalled();

		triggerMouse(el, 'mouseDown', 0);
		expect(onStart).toHaveBeenCalledTimes(1);
		expect(onStart.mock.calls[0]?.[0].originalEvent).toBeInstanceOf(MouseEvent);
		expect(onDrag).not.toHaveBeenCalled();
		expect(onEnd).not.toHaveBeenCalled();

		triggerMouse(el, 'mouseMove', -13);
		expect(onStart).toHaveBeenCalledTimes(1);
		expect(onDrag).toHaveBeenCalledTimes(1);
		expect(onDrag.mock.calls[0]?.[0].originalEvent).toBeInstanceOf(MouseEvent);
		expect(onEnd).not.toHaveBeenCalled();

		triggerMouse(el, 'mouseMove', -42);
		expect(onStart).toHaveBeenCalledTimes(1);
		expect(onDrag).toHaveBeenCalledTimes(2);
		expect(onDrag.mock.calls[1]?.[0].originalEvent).toBeInstanceOf(MouseEvent);
		expect(onEnd).not.toHaveBeenCalled();

		triggerMouse(el, 'mouseUp', -4711);
		expect(onStart).toHaveBeenCalledTimes(1);
		expect(onDrag).toHaveBeenCalledTimes(2);
		expect(onEnd).toHaveBeenCalledTimes(1);
		expect(onEnd.mock.calls[0]?.[0].originalEvent).toBeInstanceOf(MouseEvent);
	});

	it('should destroy', () => {
		const structure = fixture(3);
		document.body.innerHTML = structure;
		const el = querySelector('.caroucssel');
		const carousel = new Carousel(el, {
			features: [new Mouse({ indicator: true })],
		});
		carousel.destroy();

		expect(document.body.innerHTML).toBe(structure);
	});

});
