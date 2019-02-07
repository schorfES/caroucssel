.PHONY:  validate tests coverage


validate:
	node_modules/.bin/audit-ci  \
		--moderate

	node_modules/.bin/eslint \
		. \
		--ext .js

	./node_modules/.bin/sass-lint \
		--verbose \
		--no-exit \
		"./src/**/*.scss"


tests:
	node_modules/.bin/jest \
		src \
		--coverage \
		--verbose


coverage:
	node_modules/.bin/codecov


build:
	node_modules/.bin/node-sass \
		./src/scrollr.css.scss \
		./dist/scrollr.css \
		--indent-type space \
		--output-style expanded

	node_modules/.bin/node-sass \
		./src/scrollr.css.scss \
		./dist/scrollr.min.css \
		--indent-type space \
		--output-style compressed
