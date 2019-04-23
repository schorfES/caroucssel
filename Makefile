.PHONY:  validate tests coverage build web ghpages release


validate:
	./node_modules/.bin/audit-ci  \
		--moderate \
		--whitelist=tar

	./node_modules/.bin/eslint \
		. \
		--ext .js

	./node_modules/.bin/sass-lint \
		--verbose \
		--no-exit \
		"./src/**/*.scss"


tests:
	./node_modules/.bin/jest \
		src \
		--coverage \
		--verbose


coverage:
	node_modules/.bin/codecov


build:
	rm -rf dist/ && mkdir dist/

	./node_modules/.bin/node-sass \
		./src/caroucssel.css.scss \
		./dist/caroucssel.css \
		--indent-type space \
		--output-style expanded

	./node_modules/.bin/node-sass \
		./src/caroucssel.css.scss \
		./dist/caroucssel.min.css \
		--indent-type space \
		--output-style compressed

	cp ./src/caroucssel.scss ./dist/caroucssel.scss

	node ./scripts/build.js


web:
	cp ./dist/caroucssel.min.css ./web/caroucssel.min.css
	cp ./dist/caroucssel.min.js ./web/caroucssel.min.js

	node_modules/.bin/node-sass \
		./web/styles.scss \
		./web/styles.min.css \
		--indent-type space \
		--output-style compressed


ghpages: web
	gh-pages -d ./web/


release: validate tests build ghpages
	./node_modules/.bin/bump \
		--commit "Release v%s" \
		--tag \
		--all
