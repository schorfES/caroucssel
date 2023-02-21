import { cacheInstance, clearCache, clearFullCache, fromCache, writeCache } from './cache';


describe('Cache util', () => {

	describe('fromCache', () => {

		it('should access cache entry', () => {
			const ref = {};
			expect(fromCache(ref, 'key')).toBeUndefined();
			expect(fromCache(ref, 'key', () => 42)).toBe(42);
			expect(fromCache(ref, 'key')).toBe(42);
		});

		it('should create cache entry with factory', () => {
			const ref = {};
			fromCache(ref, 'first', () => 42);
			fromCache(ref, 'second', () => true);
			fromCache(ref, 'third', () => [1, 2, 3]);
			fromCache(ref, 'fourth', () => ({ foo: true, bar: false }));

			const storage = cacheInstance?.get(ref);
			expect(storage).toEqual(new Map<string, unknown>([
				['first', 42],
				['second', true],
				['third', [1, 2, 3]],
				['fourth', { foo: true, bar: false }],
			]));
		});

		it('should call factory when empty', () => {
			const ref = {};
			const calculate = jest.fn(() => 42);
			expect(fromCache(ref, 'answer', calculate)).toBe(42);
			expect(calculate).toHaveBeenCalled();
		});

		it('should call factory only once', () => {
			const ref = {};
			const calculate = jest.fn(() => 42);
			const values = [
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
			];
			expect(values).toEqual([42, 42, 42]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call factory only once even if response is null', () => {
			const ref = {};
			const calculate = jest.fn(() => null);
			const values = [
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
			];
			expect(values).toEqual([null, null, null]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call factory only once even if response is undefined', () => {
			const ref = {};
			const calculate = jest.fn(() => undefined);
			const values = [
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
			];
			expect(values).toEqual([undefined, undefined, undefined]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call factory only once even if response is 0', () => {
			const ref = {};
			const calculate = jest.fn(() => 0);
			const values = [
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
			];
			expect(values).toEqual([0, 0, 0]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should call factory only once even if response is false', () => {
			const ref = {};
			const calculate = jest.fn(() => false);
			const values = [
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
				fromCache(ref, 'answer', calculate),
			];
			expect(values).toEqual([false, false, false]);
			expect(calculate).toHaveBeenCalledTimes(1);
		});

		it('should ignore factory reference', () => {
			const ref = {};
			const calculate1 = jest.fn(() => 42);
			const calculate2 = jest.fn(() => 13);
			const values = [
				fromCache(ref, 'answer', calculate1),
				fromCache(ref, 'answer', calculate2),
			];
			expect(values).toEqual([42, 42]);
			expect(calculate1).toHaveBeenCalledTimes(1);
			expect(calculate2).not.toHaveBeenCalled();
		});

		it('should call factory for different keys', () => {
			const ref = {};
			const calculate1 = jest.fn(() => 42);
			const calculate2 = jest.fn(() => 13);
			const values = [
				fromCache(ref, 'first', calculate1),
				fromCache(ref, 'first', calculate1),
				fromCache(ref, 'second', calculate2),
				fromCache(ref, 'second', calculate2),
			];
			expect(values).toEqual([42, 42, 13, 13]);
			expect(calculate1).toHaveBeenCalledTimes(1);
			expect(calculate2).toHaveBeenCalledTimes(1);
		});

	});

	describe('writeCache', () => {

		it('should write to cache', () => {
			const ref = {};
			writeCache(ref, 'answer', 123);

			const calculate = jest.fn(() => 42);
			expect(fromCache(ref, 'answer', calculate)).toBe(123);
			expect(calculate).not.toHaveBeenCalled();

		});

	});

	describe('clearCache', () => {

		it('should clear entry', () => {
			const ref = {};
			const storage = new Map([
				['first', 42],
				['second', 13],
			]);
			cacheInstance?.set(ref, storage);

			clearCache(ref, 'first');
			expect(storage).toEqual(new Map([
				['second', 13],
			]));
		});

		it('should clear entry gracefully that doesn\'t exist', () => {
			const ref = {};
			const storage = new Map([
				['first', 42],
				['second', 13],
			]);
			cacheInstance?.set(ref, storage);

			clearCache(ref, 'third');
			expect(storage).toEqual(new Map([
				['first', 42],
				['second', 13],
			]));
		});

		it('should clear entry gracefully if cache doesn\'t exist', () => {
			const ref = {};
			clearCache(ref, 'fourth');

			const storage = cacheInstance?.get(ref);
			expect(storage).toBeUndefined();
		});

	});

	describe('clearFullCache', () => {

		it('should clear entire cache', () => {
			const ref = {};
			cacheInstance?.set(ref, new Map([
				['first', 42],
				['second', 13],
			]));

			clearFullCache(ref);

			const storage = cacheInstance?.get(ref);
			expect(storage).toBeUndefined();
		});

		it('should clear entire cache gracefully if doesn\'t exist', () => {
			const ref = {};
			clearFullCache(ref);

			const storage = cacheInstance?.get(ref);
			expect(storage).toBeUndefined();
		});

	});

});
