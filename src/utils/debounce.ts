// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf


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
export function debounce<F extends Source>(func: F, delay: number): Debounced<F> {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	const debounced = (...args: Parameters<F>) => {
		if (timeout !== null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => func(...args), delay);
	};

	return debounced;
}
