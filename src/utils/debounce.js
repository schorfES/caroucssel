// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
export function debounce(func, delay) {
	let timeout;
	return function(...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), delay);
	};
}
