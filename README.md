# CarouCSSel

[![CI Status](https://github.com/schorfES/caroucssel/actions/workflows/ci.yml/badge.svg)](https://github.com/schorfES/caroucssel/actions)
[![Coverage Status on Codecov](https://codecov.io/gh/schorfES/caroucssel/branch/master/graph/badge.svg)](https://codecov.io/gh/schorfES/caroucssel)
[![Known Vulnerabilities](https://snyk.io/test/github/schorfES/caroucssel/badge.svg)](https://snyk.io/test/github/schorfES/caroucssel)
[![Tree Shaking](https://badgen.net/bundlephobia/tree-shaking/caroucssel)](https://bundlephobia.com/result?p=caroucssel)
[![Minified gzipped size](https://badgen.net/bundlephobia/minzip/caroucssel)](https://bundlephobia.com/result?p=caroucssel)
![Types included](https://badgen.net/npm/types/tslib)
[![License MIT](https://badgen.net/npm/license/caroucssel)](https://github.com/schorfES/caroucssel/blob/main/LICENSE)

A lightweight dependency-free css carousel. _**CSS can scroll, why not use it?**_

* Take a [quick tour](https://schorfes.github.io/caroucssel/)
* Try the [examples](https://schorfes.github.io/caroucssel/demo/)
* Read the [docs](https://schorfes.github.io/caroucssel/docs/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Docs

- [Installation](#installation)
- [Usage](#usage)
  - [CSS](#css)
  - [SCSS](#scss)
  - [JavaScript / TypeScript](#javascript--typescript)
- [Features](#features)
  - [Buttons](#buttons)
  - [Pagination](#pagination)
  - [Mask (Scrollbars)](#mask-scrollbars)
  - [Mouse (experimental)](#mouse-experimental)
- [Options](#options)
  - [Index](#index)
  - [Filters](#filters)
  - [Event hooks](#event-hooks)
- [Properties](#properties)
  - [`.behavior`](#behavior)
  - [`.index`](#index)
  - [`.items` (read only)](#items-read-only)
  - [`.pages` (read only)](#pages-read-only)
  - [`.pageIndex` (read only)](#pageindex-read-only)
  - [`.id` (read only)](#id-read-only)
  - [`.el` (read only)](#el-read-only)
  - [`.mask` (read only)](#mask-read-only)
- [Methods](#methods)
  - [`.update()`](#update)
  - [`.destroy()`](#destroy)
- [SCSS Mixins](#scss-mixins)
  - [`@include caroucssel()`](#include-caroucssel)
  - [`@include caroucssel-snap()`](#include-caroucssel-snap)
- [Build a custom feature](#build-a-custom-feature)
- [Polyfills](#polyfills)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

CarouCSSel is available on [NPM](https://www.npmjs.com/package/caroucssel):

```bash
npm install caroucssel --save
```

or

```bash
yarn add caroucssel
```

or in the browser

```html
<link rel="stylesheet" href="https://unpkg.com/caroucssel@latest/dist/styles/caroucssel.min.css" />
<script src="https://unpkg.com/caroucssel@latest"></script>
```

## Usage

The carousel is based on two elements. The most important part is the styling. CarouCSSel is shipped with a prebuild CSS-file (for basic usage) and an SCSS-file which contains mixins to set up the carousel. On the other hand, there is a  JavaScript class which enhances the carousel by adding controls.

### CSS

The prebuild CSS-file only contains selectors for basic usage. It's recommended to use the SCSS-mixins for better customizability. The CSS comes with two class selectors. `.caroucssel` creates a scrolling area where the child elements are horizontally arranged. The second, optional `.use-snap` enables basic scroll-snap support at 100% size, aligned to the left.

```html
<link rel="stylesheet" href="caroucssel.min.css">

<div class="caroucssel use-snap">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

### SCSS

The SCSS gives the freedom to choose your own selectors, which should have a carousel feature. It also allows you to easily customize the behavior depending on media queries.

```scss
@import '~caroucssel/styles';

.my-carousel {
  @include caroucssel();
  @include caroucssel-snap($at: 100%);

  @media screen and (min-width: 700px) {
    @include caroucssel-snap($at: 50%);
  }
}
```

### JavaScript / TypeScript

Some browsers show a horizontal scrollbar depending on operating system or settings of the operating system. The JavaScripts detects that appearance and attaches some styles to hide them (See Mask feature). On top of that, any other features like buttons or pagination can added as an option. A basic instance of CarouCSSel is created as followed:

```javascript
import {Carousel} from 'caroucssel';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, { /* options here */ });
```

[typedocs](https://schorfes.github.io/caroucssel/docs/classes/carousel.Carousel.html)

## Features

CarouCSSel provides a plugin mechanism called "features". Each behavior can be added with a custom feature implementation that is passed as a `features` list into an instance of the carousel. CarouCSSel comes with a set of predefined features like _Buttons_ and _Pagination_. All features are tree-shakeable to keep your bundle as small as possible.

### Buttons

[typedocs](https://schorfes.github.io/caroucssel/docs/modules/features_buttons.html)

_Buttons_ allow the user to scroll step by step, forwards and backward between items inside the carousel. Buttons are rendered as `<button>` into the DOM as a direct sibling of the carousel element. By default, the buttons are rendered with required WIA-ARIA attributes. To enable buttons, pass an instance of the feature to the `features` list:

```javascript
import {Carousel} from 'caroucssel';
import {Buttons} from 'caroucssel/features/buttons';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Buttons(),
  ],
});
```

Buttons are customizable by additional options. The following options are available:

* `className` – a string which represents the base class name of both buttons (see other options to change class name for "previous" and "next" button separately) – Default value is: `'button'`.
* `nextClassName` – a string of a class name used to identify this button – Default value is: `'is-next'`
* `nextLabel` – a string of the label for this button – Default value is: `'Next'`
* `nextTitle` – a string of the title for this button – Default value is: `'Go to next'`
* `previousClassName` – a string of a class name used to identify this button – Default value is: `'is-previous'`
* `previousLabel` – a string of the label for this button – Default value is: `'Previous'`
* `previousTitle` – a string of the title for this button – Default value is: `'Go to previous'`
* `template` – is a function which returns a HTML-string for each button. A context object is passed, containing information about:
  * `className` – a string of class names for the current button
  * `controls` – a string reference to the HTML id of the carousel element. this is relevant for an `aria-controls="..."` attribute.
  * `label` – a string of the button label defined by `nextLabel` and `previousLabel`
  * `title` – a string of the button title defined by `nextTitle` and `previousTitle`

A full set of button options could look like this:

```javascript
import {Carousel} from 'caroucssel';
import {Buttons} from 'caroucssel/features/buttons';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Buttons({
      className: 'my-button',
      nextClassName: 'my-next-button',
      nextTitle: 'Click this button to go one step forward',
      nextLabel: '>'
      previousClassName: 'my-previous-button',
      previousTitle: 'Click this button to go one step back',
      previousLabel: '<'
      template: ({className, label, title}) =>
        `<button class="${className}" title="${title}">
          ${label}
        </button>`,
    }),
  ],
});
```

### Pagination

[typedocs](https://schorfes.github.io/caroucssel/docs/modules/features_pagination.html)

The _Pagination_ (or dots) is a list of buttons that allow navigating directly to a specific item/index inside the carousel. By default, the pagination is rendered with required WIA-ARIA attributes. To enable the pagination, pass an instance of the feature to the `features` list:

```javascript
import {Carousel} from 'caroucssel';
import {Pagination} from 'caroucssel/features/pagination';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Pagination(),
  ],
});
```

The pagination can be customized by additional options. The following options are available:

* `className` – a string which represents the class name for the `<ul>` element of the pagination – Default value is: `'pagination'`
* `label` – a function which returns a string for the label of each button inside the pagination. A data object is passed as param into the invoked function, containing information about:
  * `index` – a number of the current item index
  * `pages` – all existing pages, a list of grouped indexes
  * `page` – the current page
* `title` – a function which returns a string for the title of each button inside the pagination. A data object is passed as param into the invoked function, containing information about:
  * `index` – a number of the current item index
  * `pages` – all existing pages, a list of grouped indexes
  * `page` – the current page
* `template`– is a function which returns an HTML-string of the complete pagination. The default implementation invokes the `label` and `title` functions to create the string. A data object is passed as param into the invoked function, containing information about:
  * `className` – a string with the value of the `className` option.
  * `controls` – a string reference to the HTML id of the carousel element. this is relevant for an `aria-controls="..."` attribute.
  * `pages` – all existing pages, a list of grouped indexes
  * `label` – the function reference for `label` to create a button label
  * `title` – the function reference for `title` to create a button title

A full set of pagination options could look like this:

```javascript
import {Carousel} from 'caroucssel';
import {Pagination} from 'caroucssel/features/pagination';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Pagination({
      className: 'my-pagination',
      label: ({index}) => `${index + 1}.`,
      title: ({index}) => `Jump to ${index + 1}. item`,
      template: ({className, pages, label, title}) =>
        `<div class="${className}">
          ${pages.map((page, index) =>
            `<button title="${title({index})}">${label({index})}</button>`
          ).join('')}
        </div>`
    }),
  ],
});
```

### Mask (Scrollbars)

[typedocs](https://schorfes.github.io/caroucssel/docs/modules/features_mask.html)

There is a _Mask_ feature that is used by the Carousel instance by default. In most cases, there is no need to import and apply this feature directly. It's used to calculate and hide the scrollbars. If you would like to opt out of this feature, you need to set the `enabled` option to `false`.

```javascript
import {Carousel, Mask} from 'caroucssel';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Mask({
      enabled: false,
    }),
  ],
});
```

This feature will wrap an element (mask) around the passed element that contains the scrollable items. This mask is used to hide the scrollbar. It is a `div` element that has a default class name `caroucssel-mask`. To change this class name or the tag, use the options `className` and `tagName`:

```javascript
import {Carousel, Mask} from 'caroucssel';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Mask({
      className: `my-mask`,
      tagName: `section`,
    }),
  ],
});
```

### Mouse (experimental)

**Attention, this is an _experimental feature_ and will be officially released in the future. Behavior, options, and interfaces might change.**

[typedocs](https://schorfes.github.io/caroucssel/docs/modules/features_mouse.html)

This will add mouse controls to the carousel by enabling drag and drop scrolling using the mouse.

```javascript
import {Carousel} from 'caroucssel';
import {Mouse} from 'caroucssel/features/mouse';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new Mouse(),
  ],
});
```

The bahvior can be customized by additional options. The following options are available:

* `indicator` – a boolean to enable a mouse cursor to visualize that the user can drag the items.
* `onStart` – a function that is called when the user stats to drag.
* `onDrag` – a function that is called when the user is dragging.
* `onEnd` – a function that is called when the user stops to drag.

## Options

[typedocs](https://schorfes.github.io/caroucssel/docs/modules/carousel.html#Options)

### Index

Set the initial scroll index. The option format as an array follows API format for possibly multiple visible items ([read more](#index-1)). To set an index you need to pass an array with at least one element. When passing more than one, the rest will be ignored.

```javascript
const carousel = new Carousel(el, {
  index: [42],
});
```

### Filters

The carousel will ignore "invisible" html elements as scroll items by default. These elements are: `<link>`, `<meta>`, `<noscript>`, `<script>`, `<style>` and `<title>`. Other elements with a `hidden` attribute are ignored as well: `<div hidden>Hidden item</div>`.

* `filterItem` allows to manually filter elements as items. This function is a regular filter function which receives the current element (and it's index as child element) and returns a boolean that flags if the element is a valid item.

```javascript
const carousel = new Carousel(el, {
  filterItem: (item, index) => (index % 3 === 0),
});
```

### Event hooks

* `onScroll` a function which is invoked when the user scrolls through the carousel. An object containing the current `index` (a list of visible indexes), an event `type`, a reference to the carousel instance (`target`) and the original scroll event (`originalEvent`) is passed to the function.

## Properties

[typedocs](https://schorfes.github.io/caroucssel/docs/classes/carousel.Carousel.html)

### `.behavior`

The current scroll-behavior of the carousel. It refers to the css property [scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) using the values `auto` and `smooth`. The default value is `smooth`.

### `.index`

Returns and/or sets the current index of the carousel. The returned index is a list (array) of indexes that are currently visible (depending on each item width). To set an index you need to pass an array with at least one element. When passing more than one, the rest will be ignored.

### `.items` (read only)

Returns an array of all child dom elements of the carousel.

### `.pages` (read only)

Returns an array of all pages. Each page is a group of indexes that matches a page.

### `.pageIndex` (read only)

Returns the index of the current page.

### `.id` (read only)

Returns the id-attribute value of the carousel.

### `.el` (read only)

Returns the dom element reference of the carousel which was passed into the constructor.

### `.mask` (read only)

Returns the dom element reference of the mask element that wraps the carousel element. If the mask is not enabled, the return value is `null`.

## Methods

[typedocs](https://schorfes.github.io/caroucssel/docs/classes/carousel.Carousel.html)

### `.update()`

Enforces an update of all enabled features of the carousel. This is, for example, useful when changing the number of items inside the carousel.

### `.destroy()`

This completely deconstructs the carousel and applied features and returns the dom to its initial state.

## SCSS Mixins

### `@include caroucssel()`

Adds the minimal set of styles required to display the carousel.

### `@include caroucssel-snap()`

Enables CSS-snapping inside the carousel. The following parameters are available:

* `$at` – defines the snap point length. – Default value is: `100%`

## Build a custom feature

A feature is a plugin that implements some required functions and properties to match a specified API. If you're writing a feature in typescript, you can implement the interface [`IFeature`](https://schorfes.github.io/caroucssel/docs/interfaces/types.IFeature.html). If you're using plain javascript, follow the [typedocs](https://schorfes.github.io/caroucssel/docs/interfaces/types.IFeature.html) as guideline.

```javascript
export class CustomFeature {

  get name() {
    // Return your unique feature name here. Prevent to use a too generic name here.
    // You could use a combination of your github and repo name for example.
    return 'github-username:custom-feature';
  }

  init(carousel) {
    // This function will be called when the carousel initializes all features.
    // An (proxied) instance of the carousel will be passed as parameter. Store
    // this reference to access it later on for your feature implementation....
    this.carousel = carousel;

    // Initialize your feature...
    this.doSomething();
  }

  update(event) {
    // This function will be called when the carousel fires an internal update.
    // The passed event object contains a reason (event.reason) to describe
    // why this was triggered:
    //
    // * 'scroll' (the carousel scrolled)
    // * 'resize' (the carousel resized)
    // * 'forced' (the carousel.update() function was called from external code)
    // * 'feature' (the carousel.update() function was called from an other feature)
    console.log(event.reason);

    // React on the update: take care of the event.reason value, maybe a partial
    // update is already enough...
    this.doSomething();
  }

  destroy() {
    // This function will be called when the carousel is destroyed. Ensure
    // to fully detach all instances and event listeners. Also, roll back all
    // changes to the DOM to restore the initial state...
    this.carousel = null;
  }

  doSomething() {
    // This is just an example function. Implement the feature the way you want...
    // If you need to trigger an update to the caroucel and attached other
    // features, call the update() function of the carousel and pass your
    // feature - Only do this if it's needed to update any of the instances!
    this.carousel.update(this);
  }

}
```

then use it...

```javascript
import {Carousel} from 'caroucssel';
import {CustomFeature} from './features';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, {
  features: [
    new CustomFeature(),
  ],
});
```

## Polyfills

CarouCSSel is using [`scroll-behavior: 'smooth'`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) which is [supported](https://caniuse.com/css-scroll-behavior) in most modern browsers. For non-supporting browsers, there is a [polyfill by Dustan Kasten](https://github.com/iamdustan/smoothscroll).

## License

[LICENSE (MIT)](./LICENSE)
