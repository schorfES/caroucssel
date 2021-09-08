// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf

type Source = (...args: never[]) => unknown;
type Debounced<F extends Source> = (...args: Parameters<F>) => void;

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
