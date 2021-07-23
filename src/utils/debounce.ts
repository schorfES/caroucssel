// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: any, ...args: Parameters<T>): void {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), delay);
	};
}
