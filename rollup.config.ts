import { OutputOptions , Plugin } from 'rollup';

import cleanup from 'rollup-plugin-cleanup';
import path from 'path';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const MODULE_INPUT = path.join(__dirname, 'src/index.ts');
const MODULE_NAME = 'caroucssel';

const PLUGIN_SETTINGS_REPLACE = {
	values: { 'process.env.NODE_ENV': JSON.stringify('production') },
};
const PLUGIN_SETTINGS_CLEANUP = {
	comments: 'none',
	extensions: ['ts'],
};

function createBundle(output: OutputOptions = {}, plugins: Plugin[] = []) {
	return {
		input: MODULE_INPUT,
		output: {
			format: 'es',
			sourcemap: true,
			name: MODULE_NAME,
			...output,
		},
		plugins: [
			typescript(),
			replace(PLUGIN_SETTINGS_REPLACE),
			cleanup(PLUGIN_SETTINGS_CLEANUP),
			...plugins,
		],
	};
}

export default [
	createBundle(
		{
			file: path.join(__dirname, 'dist/caroucssel.cjs.js'),
			format: 'cjs',
		},
	),
	createBundle(
		{
			file: path.join(__dirname, 'dist/caroucssel.umd.js'),
			format: 'umd',
		},
	),
	createBundle(
		{
			file: path.join(__dirname, 'dist/caroucssel.min.js'),
			format: 'iife',
			sourcemap: false,
		},
		[terser()],
	),
];
