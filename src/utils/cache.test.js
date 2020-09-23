import { clearCache, clearFullCache, fromCache } from './cache';

describe('Cache util', () => {

	let instance = null;
	beforeEach(() => {
		instance = {};
	});

	afterEach(() => {
		instance = null;
	});

	describe('fromCache', () => {

		it('should create cache entry', () => {
			fromCache(instance, 'first', () => 42);
			fromCache(instance, 'second', () => true);
			fromCache(instance, 'third', () => [1, 2, 3]);
			fromCache(instance, 'fourth', () => ({ foo: true, bar: false }));

			expect(instance).toEqual({
				__cache__: {
					first: 42,
					second: true,
					third: [1, 2, 3],
					fourth: { foo: true, bar: false },
				},
			});
		});

		it('should call calculation function when empty', () => {
			const calculate = jest.fn(() => 42);
			expect(fromCache(instance, 'answer', calculate)).toBe(42);
		});

		it('should call calculation function only once', () => {
			const calculate = jest.fn(() => 42);
			const values = [
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate)
			];
			expect(values).toEqual([42, 42, 42]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call calculation function only once even if response is null', () => {
			const calculate = jest.fn(() => null);
			const values = [
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate)
			];
			expect(values).toEqual([null, null, null]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call calculation function only once even if response is undefined', () => {
			const calculate = jest.fn(() => undefined);
			const values = [
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate)
			];
			expect(values).toEqual([undefined, undefined, undefined]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call calculation function only once even if response is 0', () => {
			const calculate = jest.fn(() => 0);
			const values = [
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate)
			];
			expect(values).toEqual([0, 0, 0]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call calculation function only once even if response is false', () => {
			const calculate = jest.fn(() => false);
			const values = [
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate),
				fromCache(instance, 'answer', calculate)
			];
			expect(values).toEqual([false, false, false]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should ignore calculation function reference', () => {
			const calculate1 = jest.fn(() => 42);
			const calculate2 = jest.fn(() => 13);
			const values = [
				fromCache(instance, 'answer', calculate1),
				fromCache(instance, 'answer', calculate2)
			];
			expect(values).toEqual([42, 42]);
			expect(calculate1).toHaveBeenCalledTimes(1);
			expect(calculate2).not.toHaveBeenCalled();
		});

		it('should call calculation function for different keys', () => {
			const calculate1 = jest.fn(() => 42);
			const calculate2 = jest.fn(() => 13);
			const values = [
				fromCache(instance, 'first', calculate1),
				fromCache(instance, 'first', calculate1),
				fromCache(instance, 'second', calculate2),
				fromCache(instance, 'second', calculate2),
			];
			expect(values).toEqual([42, 42, 13, 13]);
			expect(calculate1).toHaveBeenCalledTimes(1);
			expect(calculate2).toHaveBeenCalledTimes(1);
		});

	});

	describe('clearCache', () => {

		it('should clear entry', () => {
			instance.__cache__ = {};
			instance.__cache__.first = 42;
			instance.__cache__.second = 13;
			clearCache(instance, 'first');
			expect(instance).toEqual({
				__cache__: {
					second: 13,
				},
			});
		});

		it('should clear entry gracefully that doesn\'t exist', () => {
			instance.__cache__ = {};
			instance.__cache__.first = 42;
			instance.__cache__.second = 13;
			clearCache(instance, 'third');
			expect(instance).toEqual({
				__cache__: {
					first: 42,
					second: 13,
				},
			});
		});

		it('should clear entry gracefully if cache doesn\'t exist', () => {
			instance = {};
			clearCache(instance, 'fourth');
			expect(instance).toEqual({});
		});

	});

	describe('clearFullCache', () => {

		it('should clear entire cache', () => {
			instance.__cache__ = {};
			instance.__cache__.first = 42;
			instance.__cache__.second = 13;
			clearFullCache(instance);
			expect(instance).toEqual({});
		});

		it('should clear entire cache gracefully if doesn\'t exist', () => {
			instance = {};
			clearFullCache(instance);
			expect(instance).toEqual({});
		});

	});

});
