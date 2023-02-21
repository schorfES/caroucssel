const __CACHE = new WeakMap();
export function fromCache(ref, key, factory) {
    const storage = __CACHE.get(ref) || new Map();
    if (storage.has(key)) {
        return storage.get(key);
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
export function writeCache(ref, key, value) {
    const storage = __CACHE.get(ref) || new Map();
    storage.set(key, value);
    __CACHE.set(ref, storage);
}
/**
 * Creates the cache entry by as specific key of a given reference.
 * @param ref the reference
 * @param key the storage key
 */
export function clearCache(ref, key) {
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
export function clearFullCache(ref) {
    __CACHE.delete(ref);
}
/**
 * This exposes the cache instance for test environments. Otherwise it will be null.
 * @internal
 */
/* This should not be part of the coverage report: test util */
/* istanbul ignore next */
export const cacheInstance = (process.env.NODE_ENV === 'test') ? __CACHE : null;
