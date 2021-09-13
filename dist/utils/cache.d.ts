declare type Reference = object;
declare type Storage = {
    [key: string]: unknown;
};
/**
 * Returns the cache entry by as specific key of a given reference. If the cache
 * is not filled and the key doesn't exisit, the factory function is called to
 * generate a value.
 * @param ref the reference
 * @param key the storage key
 * @param factory the factory function
 * @returns the cached value
 */
export declare function fromCache<T = unknown>(ref: Reference, key: string, factory: () => T): T;
/**
 * Explicitly writes a value into the cache.
 * @param ref the reference
 * @param key the storage key
 * @param value the value
 */
export declare function writeCache<T = unknown>(ref: Reference, key: string, value: T): void;
/**
 * Creates the cache entry by as specific key of a given reference.
 * @param ref the reference
 * @param key the storage key
 */
export declare function clearCache(ref: Reference, key: string): void;
/**
 * Clears the full cache by a given reference.
 * @param ref the reference.
 */
export declare function clearFullCache(ref: Reference): void;
/**
 * This exposes the cache instance for test environments. Otherwise it will be null.
 */
export declare const cacheInstance: WeakMap<object, Storage> | null;
export {};
//# sourceMappingURL=cache.d.ts.map