const replace = require('replace');

const pkg = require('../package.json');


replace({
	regex: '__VERSION__',
	replacement: pkg.version,
	paths: ['./dist/'],
	recursive: true,
	silent: false,
});
