import path from 'node:path';

import { getBabelOutputPlugin as babel, RollupBabelOutputPluginOptions as BabelOutputPluginOptions } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser, { Options as TerserInputPluginOptions } from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';


const MODULE_NAME = 'caroucssel';
const MODULE_SOURCE = './src/index.ts';

const PLUGIN_OPTIONS_BABEL_UMD: BabelOutputPluginOptions = {
	allowAllFormats: true,
	moduleId: MODULE_NAME,
	presets: [
		['@babel/preset-env', { modules: false }],
	],
	plugins: [
		['@babel/plugin-transform-modules-umd', {
			globals: { [MODULE_NAME]: MODULE_NAME },
			exactGlobals: true,
		}],
	],
};

const PLUGIN_OPTIONS_TERSER: TerserInputPluginOptions = {
	compress: true,
	mangle: true,
};

const TYPES = [
	// CJS Builds:
	// ---------------------------------------------------------------------------
	{
		format: 'cjs',
		dir: './dist/formats/cjs/',
		plugins: [],
		entries: [
			{
				name: 'caroucssel',
				input: MODULE_SOURCE,
				plugins: [],
			},
			{
				name: 'caroucssel.min',
				input: MODULE_SOURCE,
				plugins: [terser(PLUGIN_OPTIONS_TERSER)],
			},
		],
	},

	// UMD Builds:
	// ---------------------------------------------------------------------------
	{
		format: 'es',
		dir: './dist/formats/umd/',
		plugins: [babel(PLUGIN_OPTIONS_BABEL_UMD)],
		entries: [
			{
				name: 'caroucssel',
				input: MODULE_SOURCE,
				plugins: [],
			},
			{
				name: 'caroucssel.min',
				input: MODULE_SOURCE,
				plugins: [terser(PLUGIN_OPTIONS_TERSER)],
			},
		],
	},

	// IIFE Builds:
	// ---------------------------------------------------------------------------
	{
		format: 'iife',
		dir: './dist/formats/iife/',
		plugins: [],
		entries: [
			{
				name: 'caroucssel',
				input: MODULE_SOURCE,
				plugins: [],
			},
			{
				name: 'caroucssel.min',
				input: MODULE_SOURCE,
				plugins: [terser(PLUGIN_OPTIONS_TERSER)],
			},
		],
	},
];


export default TYPES.flatMap((type) => {
	const { format, dir, entries } = type;

	return entries.map((entry) => {
		const { input, name } = entry;
		const file = path.join(dir, `${name}.js`);

		return {
			input,
			output: {
				name: MODULE_NAME,
				file,
				format,
			},
			plugins: [
				// Typescript plugin
				typescript({
					declaration: false,
				}),

				// Replace plugin: update NODE_ENV
				replace({
					extensions: ['.js', '.ts'],
					preventAssignment: true,
					values: {
						'process.env.NODE_ENV': JSON.stringify('production'),
					},
				}),

				// Cleanup plugin: remove all comments
				cleanup({
					extensions: ['.js', '.ts'],
					comments: 'none',
				}),

				...type.plugins,
				...entry.plugins,
			],
		};
	});
});
