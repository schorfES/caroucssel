import { fixture, querySelector, triggerScroll } from './__setup__/helpers';
import { Carousel } from './carousel';
import { Proxy } from './proxy';
import { IFeature } from './types';


describe('proxy', () => {

	let carousel: Carousel;
	beforeEach(() => {
		jest.useFakeTimers();

		document.body.innerHTML = fixture(4, { id: 'proxied-carousel' });
		const el = querySelector('.caroucssel');
		el.mockedClientWidth = 100;
			[...document.querySelectorAll('.item')].forEach((item) => item.mockedClientWidth = 100);
		carousel = new Carousel(el);
	});

	afterEach(() => {
		jest.clearAllTimers();

		carousel.destroy();
		document.body.innerHTML = '';
		Carousel.resetInstanceCount();
	});

	it('should proxy id', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.id).toBe('proxied-carousel');
	});

	it('should proxy element', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.el).toBe(carousel.el);
	});

	it('should proxy mask', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.mask).toBe(carousel.mask);
		expect(proxy.mask).toBe(carousel.el.parentNode);
	});

	it('should proxy items', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.items).toBe(carousel.items);
	});

	it('should proxy index', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.index).toEqual([0]);
		expect(proxy.index).toBe(carousel.index);

		proxy.index = [3];
		expect(proxy.index).toEqual([3]);
		expect(proxy.index).toBe(carousel.index);
	});

	it('should proxy pages', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.pages).toEqual([[0], [1], [2], [3]]);
		expect(proxy.pages).toBe(carousel.pages);
	});

	it('should proxy pageIndex', () => {
		const proxy = new Proxy(carousel, []);
		expect(proxy.pageIndex).toBe(0);
		expect(proxy.pageIndex).toBe(carousel.pageIndex);

		triggerScroll(carousel.el, { left: 200 });
		expect(proxy.pageIndex).toBe(2);
		expect(proxy.pageIndex).toBe(carousel.pageIndex);
	});

	it('should update features except sender feature', () => {
		const feat1 = { update: jest.fn() } as unknown as IFeature;
		const feat2 = { update: jest.fn() } as unknown as IFeature;
		const feat3 = { update: jest.fn() } as unknown as IFeature;
		const proxy = new Proxy(carousel, [feat1, feat2, feat3]);
		proxy.update(feat2);

		/* eslint-disable @typescript-eslint/unbound-method */
		expect(feat1.update).toHaveBeenCalledTimes(1);
		expect(feat1.update).toHaveBeenCalledWith({ reason: 'feature' });
		expect(feat2.update).not.toHaveBeenCalled();
		expect(feat3.update).toHaveBeenCalledTimes(1);
		expect(feat3.update).toHaveBeenCalledWith({ reason: 'feature' });
		/* eslint-enable @typescript-eslint/unbound-method */
	});

});
