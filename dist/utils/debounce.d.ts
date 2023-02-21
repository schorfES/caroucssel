/**
 * Generic function
 */
export type Source = (...args: never[]) => unknown;
/**
 * Debounced function
 * @typeParam F is the shape of the original function.
 */
export type Debounced<F extends Source> = (...args: Parameters<F>) => void;
/**
 * Creates a debounced version for a given function in a given delay (in ms).
 * @typeParam F is the shape of the function to debounce.
 * @param func the original function
 * @param delay the delay in milliseconds (ms)
 * @returns the debounced function
 */
export declare function debounce<F extends Source>(func: F, delay: number): Debounced<F>;
