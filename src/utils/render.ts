export function render<El = HTMLElement, Data = Record<string, unknown>>(
	template: (data: Data) => string,
	data: Data,
): El | null {
	const el = document.createElement('div');
	el.innerHTML = template(data);

	const ref = el.firstElementChild;
	if (!ref) {
		return null;
	}

	return ref as unknown as El;
}
