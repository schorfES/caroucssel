module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-sass-guidelines',
		'stylelint-config-rational-order',
	],
	plugins: [
		'stylelint-scss',
		'stylelint-order',
		'stylelint-config-rational-order/plugin',
	],
	rules: {
		// Specify the alphabetical order of properties within declaration blocks.
    // https://github.com/hudochenkov/stylelint-order/tree/master/rules/properties-alphabetical-order
    'order/properties-alphabetical-order': null,

		// Specify the order of properties within declaration blocks.
    // https://github.com/hudochenkov/stylelint-order/tree/master/rules/properties-order
    'order/properties-order': [],

		// Stylelint config that sorts related property declarations by grouping together.
    // https://www.npmjs.com/package/stylelint-config-rational-order
    'plugin/rational-order': true,

		// Specify lowercase or uppercase for hex colors.
		// https://stylelint.io/user-guide/rules/list/color-hex-case/
		'color-hex-case': 'upper',

		// Specify short or long notation for hex colors.
		// https://stylelint.io/user-guide/rules/list/color-hex-length/
		'color-hex-length': 'long',

		// Specify indentation.
		// https://stylelint.io/user-guide/rules/list/indentation/
		'indentation': 'tab',

		// Limit the depth of nesting.
		// https://stylelint.io/user-guide/rules/list/max-nesting-depth/
		'max-nesting-depth': 3,

		// Disallow trailing zeros in numbers.
    // https://stylelint.io/user-guide/rules/number-no-trailing-zeros
    'number-no-trailing-zeros': true,

    // Require or disallow a leading zero for fractional numbers less than 1.
    // https://stylelint.io/user-guide/rules/number-leading-zero
    'number-leading-zero': 'always',

		// Disallow qualifying a selector by type. Allow attribute selectors qualified by type.
    // https://stylelint.io/user-guide/rules/selector-no-qualifying-type
    'selector-no-qualifying-type': [true, { ignore: 'attribute' }],

		// Strings must always be wrapped with single quotes.
    // https://stylelint.io/user-guide/rules/string-quotes
    'string-quotes': 'single',
	},
}
