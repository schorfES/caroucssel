# CarouCSSel

[![Build Status](https://travis-ci.org/schorfES/caroucssel.svg?branch=master)](https://travis-ci.org/schorfES/caroucssel)
[![Coverage Status on Codecov](https://codecov.io/gh/schorfES/caroucssel/branch/master/graph/badge.svg)](https://codecov.io/gh/schorfES/caroucssel)
[![Known Vulnerabilities](https://snyk.io/test/github/schorfES/caroucssel/badge.svg)](https://snyk.io/test/github/schorfES/caroucssel)
[![Minified gzipped size](https://badgen.net/bundlephobia/minzip/caroucssel)](https://bundlephobia.com/result?p=caroucssel)

A lightweight dependency-free css carousel. _**CSS can scroll, why not use it?**_

* Take a [quick introduction](https://schorfes.github.io/caroucssel/)
* Try some [demo/examples](https://schorfes.github.io/caroucssel/demo/).

## Installation

CarouCSSel is available on [NPM](https://www.npmjs.com/package/caroucssel):

```bash
npm install caroucssel --save
```

or

```bash
yarn add caroucssel
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
@import '~caroucssel/dist/caroucssel';

.my-carousel {
    @include caroucssel();
    @include caroucssel-snap($at: 100%);

    @media screen and (min-width: 700px) {
        @include caroucssel-snap($at: 50%);
    }
}
```

### JS

The JavaScript enhances the feature set of the carousel by adding buttons and/or pagination. Besides that, some browsers show a scrollbar depending on operating system or settings of the operating system. The JavaScripts detects that appearance and enables the styles to hide them (see options). A basic instance of CarouCSSel is created as followed:


```javascript
import {Carousel} from 'caroucssel';

const el = document.querySelector('.carousel');
const carousel = new Carousel(el, { /* options here */ });
```

#### Options

##### Index

Set the initial scroll index. The option format as an array follows API format for possibly multiple visible items ([read more](#index-1)). To set an index you need to pass an array with at least one element. When passing more than one, the rest will be ignored.

```javascript
const carousel = new Carousel(el, {
    index: [42]
});
```

##### Buttons

Buttons allow the user to scroll step by step, forwards and backward between items inside the carousel. Buttons are rendered as `<button>` into the DOM as a direct sibling of the carousel element. By default, the buttons are rendered with required WIA-ARIA attributes. To enable buttons set `hasButtons` to `true` inside the options object:

```javascript
const carousel = new Carousel(el, {
    hasButtons: true
});
```

Buttons are customizable by additional options. The following options are available:

* `buttonClassName` – a string which represents the base class name of both buttons (see other options to change class name for "previous" and "next" button separately) – Default value is: `'button'`.
* `buttonNext` – an object to configure the following options for the next button:
    * `className` – a string of a class name used to identify this button – Default value is: `'is-next'`
    * `label` – a string of the label for this button – Default value is: `'Next'`
    * `title` – a string of the title for this button – Default value is: `'Go to next'`
* `buttonPrevious` – an object to configure the following options for the next button:
    * `className` – a string of a class name used to identify this button – Default value is: `'is-previous'`
    * `label` – a string of the label for this button – Default value is: `'Previous'`
    * `title` – a string of the title for this button – Default value is: `'Go to previous'`
* `buttonTemplate` – is a function which returns a HTML-string for each button. A data object is passed as param into the invoked function, containing information about:
    * `className` – a string of class names for the current button
    *  `controls` – a string reference to the HTML id of the carousel element. this is relevant for an `aria-controls="..."` attribute.
    * `label` – a string of the button label defined by `buttonNext.label` and `buttonPrevious.label`
    * `title` – a string of the button title defined by `buttonNext.title` and `buttonPrevious.title`

A full set of button options could look like this:

```javascript
const carousel = new Carousel(el, {
    hasButtons: true,
    buttonClassName: 'my-button',
    buttonTemplate: ({className, label, title}) =>
        `<button class="${className}" title="${title}">
            ${label}
        </button>`,
    buttonPrevious: {
        className: 'my-previous-button',
        title: 'Click this button to go one step back',
        label: '<'
    },
    buttonNext: {
        className: 'my-next-button',
        title: 'Click this button to go one step forward',
        label: '>'
    }
});
```

##### Pagination

The pagination (or dots) is a list of buttons that allow navigating directly to a specific item/index inside the carousel. By default, the pagination is rendered with required WIA-ARIA attributes. To enable the pagination, set `hasPagination` to `true` inside the options object:

```javascript
const carousel = new Carousel(el, {
    hasPagination: true
});
```

The pagination can be customized by additional options. The following options are available:

* `paginationClassName` – a string which represents the class name for the `<ul>` element of the pagination – Default value is: `'pagination'`
* `paginationLabel` – a function which returns a string for the label of each button inside the pagination. A data object is passed as param into the invoked function, containing information about:
    * `index` – a number of the current item index
    * `pages` – all existing pages, a list of grouped indexes
    * `page` – the current page
* `paginationTitle` – a function which returns a string for the title of each button inside the pagination. A data object is passed as param into the invoked function, containing information about:
    * `index` – a number of the current item index
    * `pages` – all existing pages, a list of grouped indexes
    * `page` – the current page
* `paginationTemplate`– is a function which returns an HTML-string of the complete pagination. The default implementation invokes the `paginationLabel` and `paginationTitle` functions to create the string. A data object is passed as param into the invoked function, containing information about:
    * `className` – a string with the value of the `paginationClassName` option.
    *  `controls` – a string reference to the HTML id of the carousel element. this is relevant for an `aria-controls="..."` attribute.
    * `pages` – all existing pages, a list of grouped indexes
    * `label` – the function reference for `paginationLabel` to create a button label
    * `title` – the function reference for `paginationTitle` to create a button tile

A full set of pagination options could look like this:

```javascript
const carousel = new Carousel(el, {
    hasPagination: true,
    paginationClassName: 'my-pagination',
    paginationLabel: ({index}) => `${index + 1}.`,
    paginationTitle: ({index}) => `Jump to ${index + 1}. item`,
    paginationTemplate: ({className, pages, label, title}) =>
        `<div class="${className}">
            ${pages.map((page, index) =>
                `<button title="${title({index})}">${label({index})}</button>`
            ).join('')}
        </div>`
});
```

##### Scrollbars

To enable the default rendering of the CSS property `overflow: auto`, set the option `hasScrollbars` to `true`.

```javascript
const carousel = new Carousel(el, {
    hasScrollbars: true
});
```

CarouCSSel will wrap a mask element around the passed element that contains the scrollable items. This wrapper is used to hide the scrollbar. This element has a default class name `caroucssel-mask`. To change this class name set the option `scrollbarsMaskClassName`.

```javascript
const carousel = new Carousel(el, {
    hasScrollbars: true,
    scrollbarsMaskClassName: 'my-scroll-mask'
});
```

##### Filters

The carousel will ignore "invisible" html elements as scroll items by default. These elements are: `<link>`, `<meta>`, `<noscript>`, `<script>`, `<style>` and `<title>`. Other elements with a `hidden` attribute are ignored as well: `<div hidden>Hidden item</div>`.

* `filterItem` allows to manually filter elements as items. This function is a regular filter function which receives the current element (and it's index as child element) and returns a boolean that flags if the element is a valid item.

```javascript
const carousel = new Carousel(el, {
    filterItem: (item, index) => (index % 3) === 0
});
```

##### Events

* `onScroll` a function which is invoked when the user scrolls through the carousel. An object containing the current `index` (a list of visible indexes), an event `type`, a reference to the carousel instance (`target`) and the original scroll event (`originalEvent`) is passed to the function.

## API

### SCSS

#### `@include caroucssel()`

Adds the minimal set of styles required to display the carousel.

#### `@include caroucssel-snap()`

Enables CSS-snapping inside the carousel. The following parameters are available:

* `$at` – defines the snap point length. – Default value is: `100%`

### JS

#### `.index`

Returns and/or sets the current index of the carousel. The returned index is a list (array) of indexes that are currently visible (depending on each item width). To set an index you need to pass an array with at least one element. When passing more than one, the rest will be ignored.

#### `.items` (read only)

Returns an array of all child dom elements of the carousel.

#### `.pages` (read only)

Returns an array of all pages. Each page is a group of indexes that matches a page.

#### `.pageIndex` (read only)

Returns the index of the current page.

#### `.id` (read only)

Returns the id-attribute value of the carousel.

#### `.el` (read only)

Returns the dom element reference of the carousel which was passed into the constructor.

#### `.update()`

Enforces an update of all enabled components of the carousel. This is, for example, useful when changing the number of items inside the carousel.

#### `.destroy()`

This completely deconstructs the carousel and returns the dom to its initial state.

## Polyfills

CarouCSSel is using [scroll-`behavior: 'smooth'`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) which is [supported](https://caniuse.com/css-scroll-behavior) in most modern browsers. For non-supporting browsers, there is a [polyfill by Dustan Kasten](https://github.com/iamdustan/smoothscroll).

## License

[LICENSE (MIT)](./LICENSE)
