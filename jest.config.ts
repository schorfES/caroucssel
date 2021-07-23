const config = {
	preset: 'ts-jest',
  setupFiles: [
    './src/__setup__/element.ts',
  ],
  testEnvironment: 'jsdom',
};

export default config;
