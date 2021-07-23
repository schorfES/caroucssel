const NAMESPACE = '__cache__';

export function fromCache<T>(instance: any, key: string, calculate: () => T): T {
	instance[NAMESPACE] = instance[NAMESPACE] || {};
	if (key in instance[NAMESPACE]) {
		return instance[NAMESPACE][key];
	}

	const value = calculate();
	instance[NAMESPACE][key] = value;
	return value;
}

export function clearCache(instance: any, key: string): void {
	const cache = instance[NAMESPACE];
	if (!cache) {
		return;
	}

	delete(cache[key]);
}

export function clearFullCache(instance: any): void {
	delete(instance[NAMESPACE]);
}
