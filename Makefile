.PHONY: watch validate tests build build_clean build_styles build_scripts build_readme build_files web web_clean web_docs web_pages release prerelease


watch:
	node_modules/.bin/parcel \
		serve \
		./web/index.html \
		./web/demo/index.html \
		--public-url /caroucssel \
		--dist-dir ./public/


validate:
	./node_modules/.bin/tsc --noEmit

	./node_modules/.bin/eslint \
		--ext .js \
		--ext .ts \
		.

	./node_modules/.bin/stylelint **/*.scss \
		--config ./stylelint.config.js


tests:
	./node_modules/.bin/jest \
		src \
		--coverage \
		--verbose


build: build_clean build_styles build_scripts build_readme build_files


build_clean:
	rm -rf dist/ && mkdir dist/


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
	cp ./src/styles/index.scss ./dist/styles/index.scss
	cp ./src/index.scss ./dist/index.scss


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


build_files:
	cp package.json dist/package.json
	cp LICENSE dist/LICENSE
	cp README.md dist/README.md


web: web_clean web_pages web_docs


web_clean:
	rm -rf public/


web_docs:
	node_modules/.bin/typedoc \
		./src/carousel.ts \
		./src/proxy.ts \
		./src/types.ts \
		./src/features/**/index.ts \
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
		--dist-dir public \
		--no-cache \
		--no-scope-hoist \
		--public-url /caroucssel/

	node ./scripts/web_post.js


release: validate tests
	node_modules/.bin/np \
		--no-yarn \
		--no-tests \
		--branch main \
		--contents ./dist \
		--tag

	gh-pages -d ./public/


prerelease: validate tests
	node_modules/.bin/np \
		--no-yarn \
		--no-tests \
		--any-branch \
		--contents ./dist \
		--tag
