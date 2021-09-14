declare type Source = (...args: never[]) => unknown;
declare type Debounced<F extends Source> = (...args: Parameters<F>) => void;
/**
 * Creates a debounced version for a given function in a given delay (in ms).
 * @param func the original function
 * @param delay the delay in milliseconds (ms)
 * @returns the debounced function
 */
export declare function debounce<F extends Source>(func: F, delay: number): Debounced<F>;
export {};
