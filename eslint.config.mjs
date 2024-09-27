// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		// Javascript specific config
		files: ['**/*.js'],
		rules: {
			// Disallow invocation of require().
			// https://typescript-eslint.io/rules/no-require-imports/
			//
			// Disable this rule to use and validate Node.js source files using the
			// CommonJS format.
			'@typescript-eslint/no-require-imports': ['off'],
		},
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
			ecmaVersion: 6,
		},
	},
	{
		// Typescript specific config
		files: ['**/*.ts'],
		rules: {
			// Enforce type definitions to consistently use either interface or type.
			// https://typescript-eslint.io/rules/consistent-type-definitions/
			//
			// Disable this rule to ensure consistent API types.
			'@typescript-eslint/consistent-type-definitions': ['off'],
		},
	},
	{
		// Test specific config
		files: ['**/*.test.ts'],
		rules: {},
	},
	{
		ignores: [
			'.cache/',
			'.parcel-cache/',
			'coverage/',
			'node_modules/',
			'public/',
			'dist/',
			'web/',
		],
	}
);
