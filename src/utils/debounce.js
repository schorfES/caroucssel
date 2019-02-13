// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
export function debounce(func, delay) {
	let inDebounce;
	return function(...args) {
		const self = this;
		window.clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(self, args), delay);
	};
}
