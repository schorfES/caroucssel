.PHONY: watch validate tests build build_clean build_styles build_scripts build_readme web web_clean web_docs web_pages release prerelease


watch:
	node_modules/.bin/parcel \
		serve \
		./web/index.html \
		./web/demo/index.html \
		--out-dir public


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


build: build_clean build_styles build_scripts build_readme


build_clean:
	rm -rf dist/ && mkdir dist/
	rm -rf styles/ && mkdir styles/


build_styles:
	NODE_ENV=production ./node_modules/.bin/sass \
		./src/styles/caroucssel.css.scss \
		./dist/styles/caroucssel.css \
		--style expanded \
		--no-source-map \
		--trace

	NODE_ENV=production ./node_modules/.bin/sass \
		./src/styles/caroucssel.css.scss \
		./dist/styles/caroucssel.min.css \
		--style compressed \
		--no-source-map \
		--trace

	cp ./src/styles/caroucssel.scss ./dist/styles/caroucssel.scss
	cp -r ./dist/styles/ ./styles


build_scripts:
	NODE_ENV=production ./node_modules/.bin/tsc \
		--project tsconfig.build.json \

	NODE_ENV=production ./node_modules/.bin/rollup \
		--config rollup.config.ts \
		--configPlugin typescript

	node ./scripts/build_post.js


build_readme:
	./node_modules/.bin/doctoc README.md \
		--title '## Docs'


web: web_clean web_pages web_docs


web_clean:
	rm -rf public/


web_docs:
	node_modules/.bin/typedoc \
		./src/carousel.ts \
		./src/proxy.ts \
		./src/types.ts \
		./src/features/**/*.ts \
		./src/utils/*.ts \
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


release: validate tests web
	node_modules/.bin/np \
		--no-yarn \
		--no-tests \
		--any-branch \
		--tag

	gh-pages -d ./public/


prerelease: validate tests
	node_modules/.bin/np \
		--no-yarn \
		--no-tests \
		--any-branch \
		--tag
