const NAMESPACE = '__cache__';

export const fromCache = (instance, key, calculate) => {
	instance[NAMESPACE] = instance[NAMESPACE] || {};
	if (key in instance[NAMESPACE]) {
		return instance[NAMESPACE][key];
	}

	const value = calculate();
	instance[NAMESPACE][key] = value;
	return value;
};

export const clearCache = (instance, key) => {
	const cache = instance[NAMESPACE];
	if (!cache) {
		return;
	}

	delete(cache[key]);
};

export const clearFullCache = (instance) => delete(instance[NAMESPACE]);
