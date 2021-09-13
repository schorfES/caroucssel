// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"HKiW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromCache = fromCache;
exports.clearCache = clearCache;
exports.clearFullCache = clearFullCache;
exports.cacheInstance = void 0;

var __CACHE = new WeakMap();
/**
 * Returns the cache entry by as specific key of a given reference. If the cache
 * is not filled and the key doesn't exisit, the factory function is called to
 * generate a value.
 * @param ref the reference
 * @param key the storage key
 * @param factory the factory function
 * @returns the cached value
 */


function fromCache(ref, key, factory) {
  var storage = __CACHE.get(ref) || {};

  if (key in storage) {
    return storage[key];
  }

  var value = factory();
  storage[key] = value;

  __CACHE.set(ref, storage);

  return value;
}
/**
 * Cleats the cache entry by as specific key of a given reference.
 * @param ref the reference
 * @param key the storage key
 */


function clearCache(ref, key) {
  var storage = __CACHE.get(ref);

  if (!storage) {
    return;
  }

  storage[key] = undefined;
  delete storage[key];
}
/**
 * Clears the full cache by a given reference.
 * @param ref the reference.
 */


function clearFullCache(ref) {
  __CACHE.delete(ref);
}
/**
 * This exposes the cache instance for test environments. Otherwise it will be null.
 */


var cacheInstance = "production" === 'test' ? __CACHE : null;
exports.cacheInstance = cacheInstance;
},{}],"GQHl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;

// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
function debounce(func, delay) {
  var timeout = null;

  var debounced = function debounced() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      return func.apply(void 0, args);
    }, delay);
  };

  return debounced;
}
},{}],"D3is":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

function render(template, data) {
  var el = document.createElement('div');
  el.innerHTML = template(data);
  var ref = el.firstElementChild;

  if (!ref) {
    return null;
  }

  return ref;
}
},{}],"QbP4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrollbar = void 0;

var _cache = require("./cache");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Scrollbar = /*#__PURE__*/function () {
  function Scrollbar() {
    var _this = this;

    _classCallCheck(this, Scrollbar);

    window.addEventListener('resize', function () {
      (0, _cache.clearCache)(_this, 'dimensions');
    });
  } // Inspired by https://gist.github.com/kflorence/3086552


  _createClass(Scrollbar, [{
    key: "dimensions",
    get: function get() {
      return (0, _cache.fromCache)(this, 'dimensions', function () {
        var inner = document.createElement('div');
        var outer = document.createElement('div');
        document.body.appendChild(outer);
        outer.style.position = 'absolute';
        outer.style.top = '0px';
        outer.style.left = '0px';
        outer.style.visibility = 'hidden';
        outer.appendChild(inner); // Disabled, not needed for current feature set.
        //
        // Calculate width:
        // inner.style.width = '100%';
        // inner.style.height = '200px';
        // outer.style.width = '200px';
        // outer.style.height = '150px';
        // outer.style.overflow = 'hidden';
        // w1 = inner.offsetWidth;
        // outer.style.overflow = 'scroll';
        // w2 = inner.offsetWidth;
        // w2 = (w1 === w2) ? outer.clientWidth : w2;
        // width = w1 - w2;
        // Calculate height:

        inner.style.width = '200px';
        inner.style.height = '100%';
        outer.style.width = '150px';
        outer.style.height = '200px';
        outer.style.overflow = 'hidden';
        var h1 = inner.offsetHeight;
        outer.style.overflow = 'scroll';
        var h2 = inner.offsetHeight;
        h2 = h1 === h2 ? outer.clientHeight : h2;
        var height = h1 - h2;
        document.body.removeChild(outer);
        return {
          // width,
          height: height
        };
      });
    }
  }]);

  return Scrollbar;
}();

exports.Scrollbar = Scrollbar;
},{"./cache":"HKiW"}],"FueT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"oYt0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Carousel: true
};
exports.Carousel = void 0;

var _cache = require("./utils/cache");

var _debounce = require("./utils/debounce");

var _render = require("./utils/render");

var _scrollbar = require("./utils/scrollbar");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ID_NAME = function ID_NAME(count) {
  return "caroucssel-".concat(count);
};

var ID_MATCH = /^caroucssel-[0-9]*$/;
var CACHE_KEY_INDEX = 'index';
var CACHE_KEY_ITEMS = 'items';
var CACHE_KEY_PAGES = 'pages';
var CACHE_KEY_PAGE_INDEX = 'page-index';
var VISIBILITY_OFFSET = 0.25;
var INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i;
var EVENT_SCROLL = 'scroll';
var EVENT_RESIZE = 'resize';
var DEFAULTS_BUTTON_PREVIOUS = {
  className: 'is-previous',
  label: 'Previous',
  title: 'Go to previous'
};
var DEFAULTS_BUTTON_NEXT = {
  className: 'is-next',
  label: 'Next',
  title: 'Go to next'
};
var DEFAULTS = {
  // Buttons:
  hasButtons: false,
  buttonClassName: 'button',
  buttonTemplate: function buttonTemplate(_ref) {
    var className = _ref.className,
        controls = _ref.controls,
        label = _ref.label,
        title = _ref.title;
    return "\n\t\t<button type=\"button\" class=\"".concat(className, "\" aria-label=\"").concat(label, "\" title=\"").concat(title, "\" aria-controls=\"").concat(controls, "\">\n\t\t\t<span>").concat(label, "</span>\n\t\t</button>\n\t");
  },
  buttonPrevious: DEFAULTS_BUTTON_PREVIOUS,
  buttonNext: DEFAULTS_BUTTON_NEXT,
  // Pagination:
  hasPagination: false,
  paginationClassName: 'pagination',
  paginationLabel: function paginationLabel(_ref2) {
    var index = _ref2.index;
    return "".concat(index + 1);
  },
  paginationTitle: function paginationTitle(_ref3) {
    var index = _ref3.index;
    return "Go to ".concat(index + 1, ". page");
  },
  paginationTemplate: function paginationTemplate(_ref4) {
    var className = _ref4.className,
        controls = _ref4.controls,
        pages = _ref4.pages,
        label = _ref4.label,
        title = _ref4.title;
    return "\n\t\t<ul class=\"".concat(className, "\">\n\t\t\t").concat(pages.map(function (page, index) {
      var data = {
        index: index,
        page: page,
        pages: pages
      };
      var labelStr = label(data);
      var titleStr = title(data);
      return "<li>\n\t\t\t\t\t<button type=\"button\" aria-controls=\"".concat(controls, "\" aria-label=\"").concat(titleStr, "\" title=\"").concat(titleStr, "\">\n\t\t\t\t\t\t<span>").concat(labelStr, "</span>\n\t\t\t\t\t</button>\n\t\t\t\t</li>");
    }).join(''), "\n\t\t</ul>\n\t");
  },
  // Scrollbars, set to true when use default scrolling behaviour
  hasScrollbars: false,
  scrollbarsMaskClassName: 'caroucssel-mask',
  // filter
  filterItem: function filterItem() {
    return true;
  },
  // Hooks:
  onScroll: function onScroll() {
    return undefined;
  }
};
var __instanceCount = 0;

var __scrollbar;

var Carousel = /*#__PURE__*/function () {
  function Carousel(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Carousel);

    _defineProperty(this, "_el", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_options", void 0);

    _defineProperty(this, "_mask", null);

    _defineProperty(this, "_isSmooth", false);

    _defineProperty(this, "_scrollbarHeight", undefined);

    _defineProperty(this, "_previous", null);

    _defineProperty(this, "_next", null);

    _defineProperty(this, "_pagination", null);

    _defineProperty(this, "_paginationButtons", null);

    if (!el || !(el instanceof Element)) {
      throw new Error("Carousel needs a dom element but \"".concat(_typeof(el), "\" was passed."));
    }

    this._el = el; // Create a singleton instance of scrollbar for all carousel instances:

    __scrollbar = __scrollbar || new _scrollbar.Scrollbar(); // Count all created instances to create unique id, if given dom element
    // has no id-attribute:

    __instanceCount++;
    el.id = el.id || ID_NAME(__instanceCount);
    this._id = el.id; // Mask will be rendered after scrollbar detection.

    this._mask = null; // extend options and defaults:

    var opts = _objectSpread(_objectSpread({}, DEFAULTS), options);

    this._options = opts; // Render:

    this._addButtons();

    this._addPagination();

    this._updateScrollbars(); // Set initial index and set smooth scrolling:


    switch (true) {
      // When index is a list:
      case Array.isArray(options.index):
        this.index = options.index;
        break;
      // When index is a number, transfrom to list:

      case !isNaN(options.index):
        this.index = [options.index];
        break;
    }

    this._isSmooth = true; // Events:
    //
    // We disable @typescript-eslint/unbound-method here because we already bound
    // the functions while creating a debounced version. This would also cause
    // reference errors when tying to access these function references when used
    // with removeEventListeners() (see: destroy())
    //

    /* eslint-disable @typescript-eslint/unbound-method */

    this._onScroll = (0, _debounce.debounce)(this._onScroll.bind(this), 25);
    this._onResize = (0, _debounce.debounce)(this._onResize.bind(this), 25);
    el.addEventListener(EVENT_SCROLL, this._onScroll);
    window.addEventListener(EVENT_RESIZE, this._onResize);
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  _createClass(Carousel, [{
    key: "el",
    get: function get() {
      return this._el;
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "index",
    get: function get() {
      var _this = this;

      return (0, _cache.fromCache)(this, CACHE_KEY_INDEX, function () {
        var el = _this.el,
            items = _this.items;
        var length = items.length;
        var clientWidth = el.clientWidth;
        var outerLeft = el.getBoundingClientRect().left;
        var index = [];
        var at = 0;

        for (; at < length; at++) {
          var item = items[at];
          var rect = item.getBoundingClientRect();
          var width = rect.width;
          var left = rect.left;
          left = left - outerLeft;

          if (left + width * VISIBILITY_OFFSET >= 0 && left + width * (1 - VISIBILITY_OFFSET) <= clientWidth) {
            index.push(at);
          }
        }

        if (index.length === 0) {
          // If no index found, we return a [0] as default. This possibly happens
          // when the carousel is not attached to the DOM or is visually hidden (display: none).
          return [0];
        }

        return index;
      });
    },
    set: function set(values) {
      var el = this.el,
          items = this.items;
      var length = items.length;

      if (!Array.isArray(values) || !values.length) {
        return;
      }

      if (length === 0) {
        return;
      }

      var value = values[0] || 0;
      value = Math.max(Math.min(value, length - 1), 0);
      var scrollLeft = el.scrollLeft;
      var from = {
        left: scrollLeft
      };
      var to = {
        left: items[value].offsetLeft
      }; // If the target item is the first visible element in the list, ignore
      // the possible offset to the left and scroll to the beginning of the list:

      if (value === this.pages[0][0]) {
        to.left = 0;
      }

      if (from.left === to.left) {
        return;
      }

      (0, _cache.clearCache)(this, CACHE_KEY_INDEX);
      var behavior = this._isSmooth ? 'smooth' : 'auto';
      el.scrollTo(_objectSpread(_objectSpread({}, to), {}, {
        behavior: behavior
      }));
    }
  }, {
    key: "items",
    get: function get() {
      var _this2 = this;

      return (0, _cache.fromCache)(this, CACHE_KEY_ITEMS, function () {
        var el = _this2.el,
            filterItem = _this2._options.filterItem;
        var children = Array.from(el.children);
        return children.filter(function (item) {
          return !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden;
        }).filter(filterItem);
      });
    }
  }, {
    key: "pages",
    get: function get() {
      var _this3 = this;

      return (0, _cache.fromCache)(this, CACHE_KEY_PAGES, function () {
        var el = _this3.el,
            items = _this3.items;
        var viewport = el.clientWidth;

        if (viewport === 0) {
          // if the width of the carousel element is zero, we can not calculate
          // the pages properly and the carousel seems to be not visible. If
          // this is the case, we assume that each item is placed on a
          // separate page.
          return items.map(function (item, index) {
            return [index];
          });
        }

        var pages = [[]];
        items.map(function (item, index) {
          // Create a re-usable dataset for each item:
          var left = item.offsetLeft,
              width = item.clientWidth;
          return {
            left: left,
            width: width,
            item: item,
            index: index
          };
        }).sort(function (a, b) {
          // Create ordered list of items based on their visual ordering.
          // This may differ from the DOM ordering unsing css properties
          // like `order` in  flexbox or grid:
          return a.left - b.left;
        }).forEach(function (item) {
          // Calculate pages / page indexes for each item:
          //
          // The idea behind the calculation of the pages is to separate
          // the items by fitting them into the viewport of the carousel.
          // To behave correctly, we cannot divide the total length of the
          // carousel by the viewport to get the page indexes (naive approach).
          // However, since there may be items that are partially visible
          // on a page, but mathematically create a new page. The calculation
          // must start from this item again. This means that always the
          // first item on a page sets the basis for the calculation of
          // the following item and its belonging to the current or next
          // page:
          var left = item.left,
              width = item.width;
          var prevPage = pages[pages.length - 1];
          var firstItem = prevPage[0];
          var start = (firstItem === null || firstItem === void 0 ? void 0 : firstItem.left) || 0; // This is required for the first page. The first page always
          // needs to start from the left=0. Any offset from the
          // left of the first visual item needs to be ignored, otherwise
          // the calculation of visual pages is incorrect:

          if (prevPage === pages[0]) {
            start = 0;
          } // At least 75% of the items needs to be in the page. Calculate
          // the amount of new pages to add. If value is 0, the current
          // item fits into the previous page:


          var add = Math.floor((left - start + width * (1 - VISIBILITY_OFFSET)) / viewport);

          while (add > 0) {
            pages.push([]);
            add--;
          }

          var page = pages[pages.length - 1];
          page.push(item);
        }); // Remove empty pages: this might happen if items are wider than the
        // carousel viewport:

        pages = pages.filter(function (page) {
          return page.length !== 0;
        }); // Restructure pages to only contain the index of each item:

        return pages.map(function (page) {
          return page.map(function (_ref5) {
            var index = _ref5.index;
            return index;
          });
        });
      });
    }
  }, {
    key: "pageIndex",
    get: function get() {
      var _this4 = this;

      return (0, _cache.fromCache)(this, CACHE_KEY_PAGE_INDEX, function () {
        var el = _this4.el,
            items = _this4.items,
            index = _this4.index,
            pages = _this4.pages;
        var outerLeft = el.getBoundingClientRect().left;
        var clientWidth = el.clientWidth;
        var visibles = index.reduce(function (acc, at) {
          if (!items[at]) {
            return acc;
          }

          var _items$at$getBounding = items[at].getBoundingClientRect(),
              left = _items$at$getBounding.left,
              right = _items$at$getBounding.right; // "getBoundingClientRect()" can return float numbers which
          // lead to an unwanted behavior when in the calculation with
          // "clientWidth" (not using floats). We use round here to
          // normalize those values...


          left = Math.round(left - outerLeft);
          right = Math.round(right - outerLeft); // Remove items that partially hidden to the left or right:

          if (left < 0 || clientWidth < right) {
            return acc;
          }

          return acc.concat([at]);
        }, []); // There might be no possible candidates. This is the case when items
        // are wider than the element viewport. In this case we take the first
        // item which is currently visible in general (might be the only one):

        if (visibles.length === 0) {
          visibles = [index[0]];
        } // Search for the visible item that is most aligned to the right. The
        // found item marks the current page...


        var at = visibles.sort(function (a, b) {
          var rightA = items[a].getBoundingClientRect().right;
          var rightB = items[b].getBoundingClientRect().right;
          return rightB - rightA;
        })[0]; // Find the page index where the current item index is located...

        return pages.findIndex(function (page) {
          return page.includes(at);
        });
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var el = this.el; // Remove created id if it was created by carousel:

      ID_MATCH.test(el.id) && el.removeAttribute('id'); // Remove buttons:

      this._removeButtons(); // Remove pagination:


      this._removePagination(); // Remove scrollbars:


      this._removeScrollbars(); // Remove events:
      //
      // We need to work the the function reference. Using .bind() would create a
      // new referenced instance of the callback function. We already created a
      // bound version of these function within the constructor.
      //

      /* eslint-disable @typescript-eslint/unbound-method */


      el.removeEventListener(EVENT_SCROLL, this._onScroll);
      window.removeEventListener(EVENT_RESIZE, this._onResize);
      /* eslint-enable @typescript-eslint/unbound-method */
      // Clear cache:

      (0, _cache.clearFullCache)(this);
    }
  }, {
    key: "update",
    value: function update() {
      (0, _cache.clearFullCache)(this);

      this._updateButtons();

      this._updatePagination();

      this._updateScrollbars();
    }
  }, {
    key: "_updateScrollbars",
    value: function _updateScrollbars() {
      var _this5 = this;

      var el = this.el,
          _options = this._options;
      var hasScrollbars = _options.hasScrollbars,
          scrollbarsMaskClassName = _options.scrollbarsMaskClassName;

      if (hasScrollbars) {
        return;
      }

      var height = __scrollbar.dimensions.height;

      if (el.scrollWidth <= el.clientWidth) {
        // If the contents are not scrollable because their width are less
        // than the container, there will be no visible scrollbar. In this
        // case, the scrollbar height is 0:
        height = 0;
      }

      this._mask = this._mask || function () {
        var _el$parentNode;

        var mask = document.createElement('div');
        mask.className = scrollbarsMaskClassName;
        mask.style.overflow = 'hidden';
        mask.style.height = '100%';
        (_el$parentNode = el.parentNode) === null || _el$parentNode === void 0 ? void 0 : _el$parentNode.insertBefore(mask, _this5.el);
        mask.appendChild(el);
        return mask;
      }();

      if (height === this._scrollbarHeight) {
        return;
      }

      var element = el;
      element.style.height = "calc(100% + ".concat(height, "px)");
      element.style.marginBottom = "".concat(height * -1, "px");
      this._scrollbarHeight = height;
    }
  }, {
    key: "_removeScrollbars",
    value: function _removeScrollbars() {
      var _mask$parentNode, _mask$parentNode2;

      var _mask = this._mask,
          el = this.el;

      if (!_mask) {
        return;
      }

      (_mask$parentNode = _mask.parentNode) === null || _mask$parentNode === void 0 ? void 0 : _mask$parentNode.insertBefore(el, _mask);
      (_mask$parentNode2 = _mask.parentNode) === null || _mask$parentNode2 === void 0 ? void 0 : _mask$parentNode2.removeChild(_mask);
      el.removeAttribute('style');
      this._mask = null;
    }
  }, {
    key: "_addButtons",
    value: function _addButtons() {
      var _this6 = this;

      var el = this.el,
          id = this.id,
          _options = this._options;

      if (!_options.hasButtons) {
        return;
      }

      var buttonTemplate = _options.buttonTemplate,
          buttonClassName = _options.buttonClassName,
          buttonPrevious = _options.buttonPrevious,
          buttonNext = _options.buttonNext;
      var controls = id; // Create button elements:

      var _map = [_objectSpread(_objectSpread(_objectSpread({}, DEFAULTS_BUTTON_PREVIOUS), buttonPrevious), {}, {
        controls: controls,
        className: [buttonClassName, buttonPrevious.className].join(' ')
      }), _objectSpread(_objectSpread(_objectSpread({}, DEFAULTS_BUTTON_NEXT), buttonNext), {}, {
        controls: controls,
        className: [buttonClassName, buttonNext.className].join(' ')
      })].map(function (params) {
        return (0, _render.render)(buttonTemplate, params);
      }),
          _map2 = _slicedToArray(_map, 2),
          previous = _map2[0],
          next = _map2[1];

      if (previous) {
        var _el$parentNode2;

        var onPrevious = function onPrevious() {
          var pages = _this6.pages,
              pageIndex = _this6.pageIndex;
          var index = pages[pageIndex - 1] || pages[0];
          _this6.index = index;
        };

        previous.onclick = onPrevious;
        (_el$parentNode2 = el.parentNode) === null || _el$parentNode2 === void 0 ? void 0 : _el$parentNode2.appendChild(previous);
      }

      this._previous = previous;

      if (next) {
        var _el$parentNode3;

        var onNext = function onNext() {
          var pages = _this6.pages,
              pageIndex = _this6.pageIndex;
          var index = pages[pageIndex + 1] || pages[pages.length - 1];
          _this6.index = index;
        };

        next.onclick = onNext;
        (_el$parentNode3 = el.parentNode) === null || _el$parentNode3 === void 0 ? void 0 : _el$parentNode3.appendChild(next);
      }

      this._next = next;

      this._updateButtons();
    }
  }, {
    key: "_updateButtons",
    value: function _updateButtons() {
      var _options = this._options;

      if (!_options.hasButtons) {
        return;
      }

      var pages = this.pages,
          pageIndex = this.pageIndex,
          _previous = this._previous,
          _next = this._next;

      if (_previous) {
        var firstPage = pages[pageIndex - 1];
        var isFirstPage = firstPage === undefined;
        _previous.disabled = isFirstPage;
      }

      if (_next) {
        var lastPage = pages[pageIndex + 1];
        var isLastPage = lastPage === undefined;
        _next.disabled = isLastPage;
      }
    }
  }, {
    key: "_removeButtons",
    value: function _removeButtons() {
      var _previous = this._previous,
          _next = this._next;
      [_previous, _next].forEach(function (button) {
        var _button$parentNode;

        if (!button) {
          return;
        }

        button.onclick = null;
        (_button$parentNode = button.parentNode) === null || _button$parentNode === void 0 ? void 0 : _button$parentNode.removeChild(button);
      });
    }
  }, {
    key: "_addPagination",
    value: function _addPagination() {
      var _this7 = this;

      var _options = this._options;

      if (!_options.hasPagination) {
        return;
      }

      var _mask = this._mask,
          el = this.el,
          id = this.id,
          pages = this.pages;

      if (pages.length < 2) {
        return;
      }

      var paginationTemplate = _options.paginationTemplate,
          paginationClassName = _options.paginationClassName,
          paginationLabel = _options.paginationLabel,
          paginationTitle = _options.paginationTitle;
      var pagination = (0, _render.render)(paginationTemplate, {
        pages: pages,
        controls: id,
        className: paginationClassName,
        label: paginationLabel,
        title: paginationTitle
      });

      if (!pagination) {
        return;
      } // @TODO: Add template for buttons:


      var buttons = Array.from(pagination.querySelectorAll('button')).map(function (button, index) {
        button.onclick = function () {
          return _this7.index = pages[index];
        };

        return button;
      });
      var target = (_mask || el).parentNode;
      target === null || target === void 0 ? void 0 : target.appendChild(pagination);
      this._pagination = pagination;
      this._paginationButtons = buttons;

      this._updatePagination();
    }
  }, {
    key: "_updatePagination",
    value: function _updatePagination() {
      var _options = this._options;

      if (!_options.hasPagination) {
        return;
      }

      var pageIndex = this.pageIndex,
          _paginationButtons = this._paginationButtons;

      if (!_paginationButtons) {
        return;
      }

      _paginationButtons.forEach(function (button, at) {
        return button.disabled = at === pageIndex;
      });
    }
  }, {
    key: "_removePagination",
    value: function _removePagination() {
      var _pagination$parentNod;

      var _pagination = this._pagination,
          _paginationButtons = this._paginationButtons;

      (_paginationButtons || []).forEach(function (button) {
        var _button$parentNode2;

        button.onclick = null;
        (_button$parentNode2 = button.parentNode) === null || _button$parentNode2 === void 0 ? void 0 : _button$parentNode2.removeChild(button);
      });

      this._paginationButtons = null;
      _pagination && ((_pagination$parentNod = _pagination.parentNode) === null || _pagination$parentNod === void 0 ? void 0 : _pagination$parentNod.removeChild(_pagination));
      this._pagination = null;
    }
  }, {
    key: "_onScroll",
    value: function _onScroll(event) {
      (0, _cache.clearCache)(this, CACHE_KEY_INDEX);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGE_INDEX);

      this._updateButtons();

      this._updatePagination();

      var index = this.index,
          onScroll = this._options.onScroll;
      onScroll && onScroll({
        index: index,
        type: EVENT_SCROLL,
        target: this,
        originalEvent: event
      });
    }
  }, {
    key: "_onResize",
    value: function _onResize() {
      (0, _cache.clearCache)(this, CACHE_KEY_PAGES);
      (0, _cache.clearCache)(this, CACHE_KEY_INDEX);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGE_INDEX);

      this._updateButtons();

      this._removePagination();

      this._addPagination();

      this._updateScrollbars();
    }
  }], [{
    key: "resetInstanceCount",
    value: function resetInstanceCount() {
      // This can be used for testing purposes to reset the instance count which is
      // used to create unique id's.
      if ("production" === 'test') {
        __instanceCount = 0;
      }
    }
  }]);

  return Carousel;
}();

exports.Carousel = Carousel;
},{"./utils/cache":"HKiW","./utils/debounce":"GQHl","./utils/render":"D3is","./utils/scrollbar":"QbP4","./types":"FueT"}],"qcOq":[function(require,module,exports) {
"use strict";

var _caroucssel = require("../../src/caroucssel");

var elements = Array.from(document.querySelectorAll('.caroucssel'));
elements.forEach(function (element) {
  var _element$dataset, _element$dataset$conf;

  var config = ((_element$dataset = element.dataset) === null || _element$dataset === void 0 ? void 0 : (_element$dataset$conf = _element$dataset.config) === null || _element$dataset$conf === void 0 ? void 0 : _element$dataset$conf.split(',').map(function (size) {
    return size.trim();
  })) || [];
  var orders = (element.dataset.order || '').split(',');
  var offsetsLeft = (element.dataset.offsetLeft || '').split(',');
  config.forEach(function (width, index) {
    var item = document.createElement('div');
    item.className = 'item';
    item.textContent = 'Item ' + (index + 1);
    item.style.width = width;
    item.style.order = orders[index] || '';
    item.style.marginLeft = offsetsLeft[index] || '';
    element.appendChild(item);
    var label = document.createElement('small');
    label.className = 'item-label';
    label.textContent = '(index: ' + index + ', width: ' + width + ')';
    item.appendChild(label);
  });
  new _caroucssel.Carousel(element, {
    hasButtons: true,
    hasPagination: true,
    onScroll: function onScroll(event) {// console.log('INDEX', event.index);
      // console.log('PAGES', event.target.pages);
    }
  });
});
},{"../../src/caroucssel":"oYt0"}]},{},["qcOq"], null)
//# sourceMappingURL=/caroucssel/script.f674eb1c.js.map