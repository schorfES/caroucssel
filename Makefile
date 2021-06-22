.PHONY:  validate tests coverage build web ghpages release watch


validate:
	# 1666: ignoring sass-lint>merge (https://github.com/sasstools/sass-lint/pull/1321)
	# 1751: is caused by live-server, is out of maintainance and should be replaced in the future
	# 1755: is caused by np, no relevant dependency for build
	./node_modules/.bin/audit-ci  \
		--moderate \
		--allowlist 1666 1751 1755

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

	./node_modules/.bin/sass \
		./src/caroucssel.css.scss \
		./dist/caroucssel.css \
		--style expanded \
		--no-source-map \
		--trace

	./node_modules/.bin/sass \
		./src/caroucssel.css.scss \
		./dist/caroucssel.min.css \
		--style compressed \
		--no-source-map \
		--trace

	cp ./src/caroucssel.scss ./dist/caroucssel.scss

	cp ./src/index.d.ts ./dist/caroucssel.d.ts

	node ./scripts/build.js


web:
	cp ./dist/caroucssel.min.css ./web/caroucssel.min.css
	cp ./dist/caroucssel.min.js ./web/caroucssel.min.js

	node_modules/.bin/sass \
		./web/styles.scss \
		./web/styles.min.css \
		--style compressed \
		--no-source-map \
		--trace

	node_modules/.bin/sass \
		./web/demo/styles.scss \
		./web/demo/styles.min.css \
		--style compressed \
		--no-source-map \
		--trace


ghpages: web
	gh-pages -d ./web/


release: validate tests build ghpages
	node_modules/.bin/np \
		--no-yarn \
		--no-tests \
		--any-branch \
		--tag


watch: build web
	# run em' all in parallel:
	node_modules/.bin/live-server & \
	node_modules/.bin/npm-watch web & \
	node_modules/.bin/npm-watch build
