build_clean:
.PHONY:  validate tests build build_clean build_styles build_scripts web_clean web web_docs web_pages ghpages release watch


validate:
	./node_modules/.bin/tsc --noEmit

	./node_modules/.bin/eslint \
		--ext .js \
		--ext .ts \
		.

	./node_modules/.bin/stylelint **/*.scss \
		--config ./stylelint.config.js \
		"./src/**/*.scss"


tests:
	./node_modules/.bin/jest \
		src \
		--coverage \
		--verbose


build: build_clean build_styles build_scripts


build_clean:
	rm -rf dist/ && mkdir dist/


build_styles:
	NODE_ENV=production ./node_modules/.bin/sass \
		./src/styles/caroucssel.css.scss \
		./dist/caroucssel.css \
		--style expanded \
		--no-source-map \
		--trace

	NODE_ENV=production ./node_modules/.bin/sass \
		./src/styles/caroucssel.css.scss \
		./dist/caroucssel.min.css \
		--style compressed \
		--no-source-map \
		--trace

	cp ./src/styles/caroucssel.scss ./dist/caroucssel.scss


build_scripts:
	NODE_ENV=production ./node_modules/.bin/tsc \
		--project tsconfig.build.json \

	NODE_ENV=production ./node_modules/.bin/rollup \
		--config rollup.config.ts \
		--configPlugin typescript


web: web_clean web_pages web_docs


web_clean:
	rm -rf public/


web_docs:
	node_modules/.bin/typedoc \
		./src/caroucssel.ts \
		./src/plugins/**/*.ts \
		./src/utils/**.ts \
		--out public/docs/ \
		--readme none \
		--excludeProtected \
		--excludeInternal


web_pages:
	node_modules/.bin/parcel \
		build \
		./web/index.html \
		./web/demo/index.html \
		--out-dir public \
		--no-cache \
		--no-minify \
		--public-url /caroucssel/


ghpages: web
	gh-pages -d ./public/


release: validate tests build ghpages
	node_modules/.bin/np \
		--no-yarn \
		--no-tests \
		--any-branch \
		--tag


watch:
	node_modules/.bin/parcel \
		serve \
		./web/index.html \
		./web/demo/index.html \
		--out-dir public
