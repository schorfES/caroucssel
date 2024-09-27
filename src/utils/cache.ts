type Reference = object;

type Storage = Map<string, unknown>;

const __CACHE = new WeakMap<Reference, Storage>();

/**
 * Returns the cache entry by a specific key of a given reference. If the cache
 * is not filled and the key doesn't exisit this will retrun undefined.
 * @typeParam T is the type of the cached value
 * @param ref the reference
 * @param key the storage key
 * @returns the cached value or undefined
 */
export function fromCache<T = unknown>(ref: Reference, key: string): T | undefined;

/**
 * Returns the cache entry by a specific key of a given reference. If the cache
 * is not filled and the key doesn't exisit, the factory function is called to
 * generate a value. This value will be cached and returned.
 * @typeParam T is the type of the cached value
 * @param ref the reference
 * @param key the storage key
 * @param factory the factory function
 * @returns the cached value
 */
export function fromCache<T = unknown>(ref: Reference, key: string, factory: () => T): T;

export function fromCache<T = unknown>(ref: Reference, key: string, factory?: () => T): T | undefined {
	const storage = __CACHE.get(ref) || new Map<string, T>();
	if (storage.has(key)) {
		return storage.get(key) as T;
	}

	if (!factory) {
		return undefined;
	}

	const value = factory();
	storage.set(key, value);
	__CACHE.set(ref, storage);
	return value;
}

/**
 * Explicitly writes a value into the cache.
 * @typeParam T is the type of the value to cache
 * @param ref the reference
 * @param key the storage key
 * @param value the value
 */
export function writeCache<T = unknown>(ref: Reference, key: string, value: T): void {
	const storage = __CACHE.get(ref) || new Map<string, T>();
	storage.set(key, value);
	__CACHE.set(ref, storage);
}

/**
 * Creates the cache entry by as specific key of a given reference.
 * @param ref the reference
 * @param key the storage key
 */
export function clearCache(ref: Reference, key: string): void {
	const storage = __CACHE.get(ref);
	if (!storage || !storage.has(key)) {
		return;
	}

	storage.delete(key);
}

/**
 * Clears the full cache by a given reference.
 * @param ref the reference.
 */
export function clearFullCache(ref: Reference): void {
	__CACHE.delete(ref);
}

/**
 * This exposes the cache instance for test environments. Otherwise it will be null.
 * @internal
 */
/* This should not be part of the coverage report: test util */
/* istanbul ignore next */
export const cacheInstance = (process.env.NODE_ENV === 'test') ? __CACHE : null;
