const path = require('path');
const babel = require('babel-core');
const fs = require('fs');
const rollup = require('rollup');
const replace = require('rollup-plugin-replace');
const uglifyjs = require('uglify-js');


const MODULE_ID = 'caroucssel';
const MODULE_ENTRY = path.join(__dirname, '../build/index.js');
const TARGETS = [
	{
		file: path.join(__dirname, '../dist/caroucssel.esm.js'),
		rollup: {
			input: MODULE_ENTRY,
			output: {format: 'es'},
			plugins: [
				replace({
					'process.env.NODE_ENV': JSON.stringify('production')
				})
			]
		},
		babel: false,
		uglify: false
	},
	{
		file: path.join(__dirname, '../dist/caroucssel.umd.js'),
		rollup: {
			input: MODULE_ENTRY,
			output: {format: 'es'},
			plugins: [
				replace({
					'process.env.NODE_ENV': JSON.stringify('production')
				})
			]
		},
		babel: {
			filename: MODULE_ENTRY,
			moduleId: MODULE_ID,
			plugins: ['@babel/plugin-transform-modules-umd'],
		},
		uglify: false
	},
	{
		file: path.join(__dirname, '../dist/caroucssel.min.js'),
		rollup: {
			input: MODULE_ENTRY,
			output: {format: 'es'},
			plugins: [
				replace({
					'process.env.NODE_ENV': JSON.stringify('production')
				})
			]
		},
		babel: {
			filename: MODULE_ENTRY,
			moduleId: MODULE_ID,
			plugins: ['@babel/plugin-transform-modules-umd'],
		},
		uglify: {}
	}
]


async function transpile(code, options) {
	if (!(typeof options === 'object')) {
		return code;
	}

	return babel.transform(code, options).code;
}

async function uglify(code, options) {
	if (!(typeof options === 'object')) {
		return code;
	}

	return uglifyjs.minify(code, options).code;
}


TARGETS.forEach(async (target) => {

	const bundler = await rollup.rollup(target.rollup);
	let {output: [{code}]} = await bundler.generate(target.rollup.output);
	code = await transpile(code, target.babel);
	code = await uglify(code, target.uglify);

	fs.writeFileSync(target.file, code);
});
