// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
/**
 * Creates a debounced version for a given function in a given delay (in ms).
 * @param func the original function
 * @param delay the delay in milliseconds (ms)
 * @returns the debounced function
 */
export function debounce(func, delay) {
    let timeout = null;
    const debounced = (...args) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), delay);
    };
    return debounced;
}
