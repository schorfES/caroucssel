import path from 'path';

import {
	getBabelOutputPlugin as babel,
	RollupBabelOutputPluginOptions as BabelOutputPluginOptions,
} from '@rollup/plugin-babel';
import replace, { RollupReplaceOptions as ReplaceInputPluginOptions } from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import type * as rollup from 'rollup';
import cleanup, { Options as CleanupInputPluginOptions } from 'rollup-plugin-cleanup';
import { terser, Options as TerserInputPluginOptions } from 'rollup-plugin-terser';


const MODULE_INPUT = path.join(__dirname, 'src/index.ts');
const MODULE_NAME = 'caroucssel';

const PLUGIN_SETTINGS_REPLACE: ReplaceInputPluginOptions = {
	extensions: ['.js', '.ts'],
	preventAssignment: true,
	values: {
		'process.env.NODE_ENV': JSON.stringify('production'),
	},
};

const PLUGIN_SETTINGS_CLEANUP: CleanupInputPluginOptions = {
	extensions: ['.js', '.ts'],
	comments: 'none',
};

const PLUGIN_SETTINGS_BABEL: BabelOutputPluginOptions = {
	allowAllFormats: true,
	moduleId: MODULE_NAME,
	presets: [
		['@babel/preset-env', { modules: false }],
	],
	plugins: ['@babel/plugin-transform-modules-umd'],
};

const PLUGIN_SETTINGS_TERSER: TerserInputPluginOptions = {
	compress: true,
	mangle: true,
};

function createBundle(output: rollup.OutputOptions = {}, plugins: rollup.Plugin[] = []) {
	return {
		input: MODULE_INPUT,
		output: {
			format: 'es',
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
		},
		[
			babel(PLUGIN_SETTINGS_BABEL),
		]
	),
	createBundle(
		{
			file: path.join(__dirname, 'dist/caroucssel.min.js'),
		},
		[
			babel(PLUGIN_SETTINGS_BABEL),
			terser(PLUGIN_SETTINGS_TERSER),
		],
	),
];
