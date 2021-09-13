const __CACHE = new WeakMap();
/**
 * Returns the cache entry by as specific key of a given reference. If the cache
 * is not filled and the key doesn't exisit, the factory function is called to
 * generate a value.
 * @param ref the reference
 * @param key the storage key
 * @param factory the factory function
 * @returns the cached value
 */
export function fromCache(ref, key, factory) {
    const storage = __CACHE.get(ref) || {};
    if (key in storage) {
        return storage[key];
    }
    const value = factory();
    storage[key] = value;
    __CACHE.set(ref, storage);
    return value;
}
/**
 * Explicitly writes a value into the cache.
 * @param ref the reference
 * @param key the storage key
 * @param value the value
 */
export function writeCache(ref, key, value) {
    const storage = __CACHE.get(ref) || {};
    storage[key] = value;
    __CACHE.set(ref, storage);
}
/**
 * Creates the cache entry by as specific key of a given reference.
 * @param ref the reference
 * @param key the storage key
 */
export function clearCache(ref, key) {
    const storage = __CACHE.get(ref);
    if (!storage) {
        return;
    }
    storage[key] = undefined;
    delete (storage[key]);
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
 */
export const cacheInstance = (process.env.NODE_ENV === 'test') ? __CACHE : null;
//# sourceMappingURL=cache.js.map