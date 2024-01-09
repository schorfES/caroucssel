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

		// Specify short or long notation for hex colors.
		// https://stylelint.io/user-guide/rules/list/color-hex-length/
		'color-hex-length': 'long',

		// Limit the depth of nesting.
		// https://stylelint.io/user-guide/rules/list/max-nesting-depth/
		'max-nesting-depth': 3,

		// Disallow qualifying a selector by type. Allow attribute selectors qualified by type.
		// https://stylelint.io/user-guide/rules/selector-no-qualifying-type
		'selector-no-qualifying-type': [true, { ignore: 'attribute' }],
	},
}
