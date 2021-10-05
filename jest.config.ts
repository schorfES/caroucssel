const config = {
	preset: 'ts-jest',
	setupFiles: [
		'./src/__setup__/element.ts',
	],
	snapshotSerializers: [
		'jest-serializer-html',
	],
	testEnvironment: 'jsdom',
};

export default config;
