// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
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
