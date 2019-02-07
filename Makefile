.PHONY:  validate tests coverage


validate:
	node_modules/.bin/audit-ci  \
		--moderate

	node_modules/.bin/eslint \
		. \
		--ext .js


tests:
	node_modules/.bin/jest \
		src \
		--coverage \
		--verbose


coverage:
	node_modules/.bin/codecov
