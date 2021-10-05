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
})({"gkAU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollBehavior = exports.UpdateType = void 0;

/**
 * Possible types of an update.
 */
var UpdateType;
exports.UpdateType = UpdateType;

(function (UpdateType) {
  UpdateType["SCROLL"] = "scroll";
  UpdateType["RESIZE"] = "resize";
  UpdateType["FORCED"] = "forced";
  UpdateType["FEATURE"] = "feature";
})(UpdateType || (exports.UpdateType = UpdateType = {}));
/**
 * The browsers scroll behavior.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo | scrollTo on MDN}
 */


var ScrollBehavior;
exports.ScrollBehavior = ScrollBehavior;

(function (ScrollBehavior) {
  ScrollBehavior["AUTO"] = "auto";
  ScrollBehavior["SMOOTH"] = "smooth";
})(ScrollBehavior || (exports.ScrollBehavior = ScrollBehavior = {}));
},{}],"HKiW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromCache = fromCache;
exports.writeCache = writeCache;
exports.clearCache = clearCache;
exports.clearFullCache = clearFullCache;
exports.cacheInstance = void 0;

var __CACHE = new WeakMap();

function fromCache(ref, key, factory) {
  var storage = __CACHE.get(ref) || {};

  if (key in storage) {
    return storage[key];
  }

  if (!factory) {
    return undefined;
  }

  var value = factory();
  storage[key] = value;

  __CACHE.set(ref, storage);

  return value;
}
/**
 * Explicitly writes a value into the cache.
 * @typeParam T is the type of the value to cache
 * @param ref the reference
 * @param key the storage key
 * @param value the value
 */


function writeCache(ref, key, value) {
  var storage = __CACHE.get(ref) || {};
  storage[key] = value;

  __CACHE.set(ref, storage);
}
/**
 * Creates the cache entry by as specific key of a given reference.
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
 * @internal
 */

/* This should not be part of the coverage report: test util */

/* istanbul ignore next */


var cacheInstance = "production" === 'test' ? __CACHE : null;
exports.cacheInstance = cacheInstance;
},{}],"j6x1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrollbar = void 0;

var _cache = require("../../utils/cache");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CACHE_KEY_DIMENSIONS = 'dims';
/**
 * Helper class for scrollbar features.
 * @internal
 */

var Scrollbar = /*#__PURE__*/function () {
  /**
   * Creates an instance.
   * @internal
   */
  function Scrollbar() {
    var _this = this;

    _classCallCheck(this, Scrollbar);

    window.addEventListener('resize', function () {
      (0, _cache.clearCache)(_this, CACHE_KEY_DIMENSIONS);
    });
  }
  /**
   * Calculates the dimensions of a scrollbar in the current browser. The result
   * of the computation will be cached for this instance.
   *
   * Inspired by https://gist.github.com/kflorence/3086552
   *
   * @return the dimensions of the scrollar
   */


  _createClass(Scrollbar, [{
    key: "dimensions",
    get: function get() {
      return (0, _cache.fromCache)(this, CACHE_KEY_DIMENSIONS, function () {
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
},{"../../utils/cache":"HKiW"}],"C2Ky":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mask = void 0;

var _types = require("../../types");

var _cache = require("../../utils/cache");

var _scrollbar = require("./scrollbar");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FEATURE_NAME = 'buildin:mask';
var CACHE_KEY_PROXY = 'prxy';
var CACHE_KEY_CONFIGURATION = 'conf';
var CACHE_KEY_MASK = 'mask';
var CACHE_KEY_HEIGHT = 'hght';
/**
 * Singleton of scrollbar util. Is shared across all instances of carousel to
 * reduce redundant calculations.
 * @internal
 */

var __scrollbar;

var DEFAULTS = {
  enabled: true,
  className: 'caroucssel-mask',
  tagName: 'div'
};
/**
 * The feature to enable/disabled mask and scrollbar support. This feature will
 * be added by default to each carousel. Use this feature to customize the
 * default behaviour.
 */

var Mask = /*#__PURE__*/function () {
  /**
   * Creates an instance of this feature.
   * @param options are the options to configure this instance
   */
  function Mask() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Mask);

    (0, _cache.writeCache)(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
  }
  /**
   * Returns the name of this feature.
   */


  _createClass(Mask, [{
    key: "name",
    get: function get() {
      return FEATURE_NAME;
    }
    /**
     * Returns the rendered element that wraps the carousel. If not enabled, this
     * returns `null`.
     * @return the mask element, otherwise `null` if disabled.
     */

  }, {
    key: "el",
    get: function get() {
      var _a;

      return (_a = (0, _cache.fromCache)(this, CACHE_KEY_MASK)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */

  }, {
    key: "init",
    value: function init(proxy) {
      (0, _cache.writeCache)(this, CACHE_KEY_PROXY, proxy); // Create a singleton instance of scrollbar for all carousel instances:

      __scrollbar = __scrollbar !== null && __scrollbar !== void 0 ? __scrollbar : new _scrollbar.Scrollbar();

      this._render();
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._remove();

      (0, _cache.clearFullCache)(this);
    }
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     * @param event event that triggered the update
     * @param event.reason is the update reason (why this was triggered)
     */

  }, {
    key: "update",
    value: function update(event) {
      switch (event.type) {
        case _types.UpdateType.RESIZE:
        case _types.UpdateType.FORCED:
          (0, _cache.clearCache)(this, CACHE_KEY_HEIGHT);

          this._render();

          break;

        default:
          this._render();

          break;
      }
    }
    /**
     * Renders the mask element, wraps the carousel element and crops the
     * height of the browsers scrollbar.
     * @internal
     */

  }, {
    key: "_render",
    value: function _render() {
      var _fromCache = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION),
          enabled = _fromCache.enabled,
          className = _fromCache.className,
          tagName = _fromCache.tagName;

      if (!enabled) {
        return;
      }

      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var element = proxy.el;
      var height = __scrollbar.dimensions.height;

      if (element.scrollWidth <= element.clientWidth) {
        // If the contents are not scrollable because their width are less
        // than the container, there will be no visible scrollbar. In this
        // case, the scrollbar height is 0:
        height = 0;
      } // Use fromCache factory to render mask element only once:


      (0, _cache.fromCache)(this, CACHE_KEY_MASK, function () {
        var _a;

        var mask = document.createElement(tagName);
        mask.className = className;
        mask.style.overflow = 'hidden';
        mask.style.height = '100%';
        (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(mask, element);
        mask.appendChild(element);
        return mask;
      });
      var cachedHeight = (0, _cache.fromCache)(this, CACHE_KEY_HEIGHT);

      if (height === cachedHeight) {
        return;
      }

      (0, _cache.writeCache)(this, CACHE_KEY_HEIGHT, height);
      element.style.height = "calc(100% + ".concat(height, "px)");
      element.style.marginBottom = "".concat(height * -1, "px");
    }
    /**
     * Removes the mask element and unwraps the carousel element.
     * @internal
     */

  }, {
    key: "_remove",
    value: function _remove() {
      var _a, _b;

      var _fromCache2 = (0, _cache.fromCache)(this, CACHE_KEY_PROXY),
          el = _fromCache2.el;

      var mask = (0, _cache.fromCache)(this, CACHE_KEY_MASK);
      (_a = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, mask);
      (_b = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(mask);
      el.removeAttribute('style');
    }
  }]);

  return Mask;
}();

exports.Mask = Mask;
},{"../../types":"gkAU","../../utils/cache":"HKiW","./scrollbar":"j6x1"}],"pmYE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Proxy = void 0;

var _types = require("./types");

var _cache = require("./utils/cache");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CACHE_KEY_INSTANCE = 'inst';
var CACHE_KEY_FEATURES = 'feat';
/**
 * Helper to access the instance cache.
 * @internal
 */

function __getInstance(ref) {
  return (0, _cache.fromCache)(ref, CACHE_KEY_INSTANCE);
}
/**
 * Helper to access the features cache.
 * @internal
 */


function __getFeatures(ref) {
  return (0, _cache.fromCache)(ref, CACHE_KEY_FEATURES);
}
/**
 * A proxy instance between carousel and a feature. Restricts the access for
 * features to the carousel instance.
 */


var Proxy = /*#__PURE__*/function () {
  /**
   * Creates an instance of the proxy.
   * @param instance the carousel instance to proxy the access to.
   * @param features all the features that should access the carousel through this instance.
   */
  function Proxy(instance, features) {
    _classCallCheck(this, Proxy);

    (0, _cache.writeCache)(this, CACHE_KEY_INSTANCE, instance);
    (0, _cache.writeCache)(this, CACHE_KEY_FEATURES, features);
  }
  /**
   * Proxies the {@link Carousel.id | `id`} getter of the carousel.
   */


  _createClass(Proxy, [{
    key: "id",
    get: function get() {
      return __getInstance(this).id;
    }
    /**
     * Proxies the {@link Carousel.el | `el`} getter of the carousel.
     */

  }, {
    key: "el",
    get: function get() {
      return __getInstance(this).el;
    }
    /**
     * Proxies the {@link Carousel.mask | `mask`} getter of the carousel.
     */

  }, {
    key: "mask",
    get: function get() {
      return __getInstance(this).mask;
    }
    /**
     * Proxies the {@link Carousel.index | `index`} getter of the carousel.
     */

  }, {
    key: "index",
    get: function get() {
      return __getInstance(this).index;
    }
    /**
     * Proxies the {@link Carousel.index | `index`} setter of the carousel.
     */
    ,
    set: function set(value) {
      __getInstance(this).index = value;
    }
    /**
     * Proxies the {@link Carousel.items | `items`} getter of the carousel.
     */

  }, {
    key: "items",
    get: function get() {
      return __getInstance(this).items;
    }
    /**
     * Proxies the {@link Carousel.pages | `pages`} getter of the carousel.
     */

  }, {
    key: "pages",
    get: function get() {
      return __getInstance(this).pages;
    }
    /**
     * Proxies the {@link Carousel.pagesIndex | `pagesIndex`} getter of the carousel.
     */

  }, {
    key: "pageIndex",
    get: function get() {
      return __getInstance(this).pageIndex;
    }
    /**
     * Function to trigger an update from a feature. This will send an update to
     * the carousel instance and all other attached features exept the sender.
     * @param sender feature that triggers the update.
     */

  }, {
    key: "update",
    value: function update(sender) {
      __getInstance(this).update(); // Trigger update in all other features except the source feature that
      // triggered the event:


      __getFeatures(this).forEach(function (feature) {
        if (feature === sender) {
          return;
        }

        feature.update({
          type: _types.UpdateType.FEATURE
        });
      });
    }
  }]);

  return Proxy;
}();

exports.Proxy = Proxy;
},{"./types":"gkAU","./utils/cache":"HKiW"}],"GQHl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;

// See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf

/**
 * Creates a debounced version for a given function in a given delay (in ms).
 * @typeParam F is the shape of the function to debounce.
 * @param func the original function
 * @param delay the delay in milliseconds (ms)
 * @returns the debounced function
 */
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
},{}],"NdLT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Mask", {
  enumerable: true,
  get: function () {
    return _mask.Mask;
  }
});
exports.Carousel = void 0;

var _mask = require("./features/mask");

var _proxy = require("./proxy");

var _types = require("./types");

var _cache = require("./utils/cache");

var _debounce = require("./utils/debounce");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ID_NAME = function ID_NAME(count) {
  return "caroucssel-".concat(count);
};

var ID_MATCH = /^caroucssel-[0-9]*$/;
var EVENT_SCROLL = 'scroll';
var EVENT_RESIZE = 'resize';
var CACHE_KEY_ELEMENT = 'element';
var CACHE_KEY_ID = 'id';
var CACHE_KEY_CONFIGURATION = 'config';
var CACHE_KEY_INDEX = 'index';
var CACHE_KEY_ITEMS = 'items';
var CACHE_KEY_PAGES = 'pages';
var CACHE_KEY_PAGE_INDEX = 'page-index';
var CACHE_KEY_MASK = 'mask';
var CACHE_KEY_PROXY = 'proxy';
var CACHE_KEY_FEATURES = 'feautres';
var VISIBILITY_OFFSET = 0.25;
var INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i;
/**
 * Export the mask because it's used by default inside the carousel.
 */

/*
 * Internal counter for created instances. Will be used to create unique IDs.
 */
var __instanceCount = 0;
var DEFAULTS = {
  features: [],
  filterItem: function filterItem() {
    return true;
  },
  onScroll: function onScroll() {
    return undefined;
  }
};
/**
 * The carousel instance.
 */

var Carousel = /*#__PURE__*/function () {
  /**
   * Creates an instance.
   * @param el is the dom element to control. This should be a container element
   * 	that holds child elements that will scroll horizontally.
   * @param options are the options to configure this instance.
   */
  function Carousel(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Carousel);

    /**
     * Current scroll behavior. Possible values are:
     * * `'auto'`
     * * `'smooth'`
     */
    this.behavior = _types.ScrollBehavior.AUTO;

    if (!el || !(el instanceof Element)) {
      throw new Error("Carousel needs a dom element but \"".concat(_typeof(el), "\" was passed."));
    }

    (0, _cache.writeCache)(this, CACHE_KEY_ELEMENT, el); // Count all created instances to create unique id, if given dom element
    // has no id-attribute:

    __instanceCount++;
    el.id = el.id || ID_NAME(__instanceCount);
    (0, _cache.writeCache)(this, CACHE_KEY_ID, el.id); // Extend options and defaults into configuration:

    var configuration = Object.assign(Object.assign({}, DEFAULTS), options);
    (0, _cache.writeCache)(this, CACHE_KEY_CONFIGURATION, configuration); // Detect if there is a "Mask" feature passed as option. Then use this one,
    // otherwise add a mandatory instance by default. Also ensure that only one
    // feature of type "Mask" is in the features list.

    var mask = null;

    var features = _toConsumableArray(configuration.features);

    var index = configuration.features.findIndex(function (feature) {
      return feature instanceof _mask.Mask;
    });

    if (index > -1) {
      // Extract first found instance of "Mask":
      var _features$splice = features.splice(index, 1);

      var _features$splice2 = _slicedToArray(_features$splice, 1);

      mask = _features$splice2[0];
    }

    mask !== null && mask !== void 0 ? mask : mask = new _mask.Mask();
    features = features.filter(function (feature) {
      return !(feature instanceof _mask.Mask);
    });
    features = [mask].concat(_toConsumableArray(features));
    (0, _cache.writeCache)(this, CACHE_KEY_MASK, mask); // Features: Initialize all features with a single proxy instance inbetween.

    var proxy = new _proxy.Proxy(this, features);
    (0, _cache.writeCache)(this, CACHE_KEY_PROXY, proxy);
    (0, _cache.writeCache)(this, CACHE_KEY_FEATURES, features);
    features.forEach(function (feature) {
      return feature.init(proxy);
    }); // Set initial index and finally set smooth scrolling to enabled:

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

    this.behavior = _types.ScrollBehavior.SMOOTH; // Events:
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
  /**
   * This will be used for testing purposes to reset the instance count which is
   * used to create unique id's.
   * @internal
   */


  _createClass(Carousel, [{
    key: "el",
    get:
    /**
     * Returns the dom element reference of the carousel which was passed into the
     * constructor.
     * @public
     * @return the controlled dom element
     */
    function get() {
      return (0, _cache.fromCache)(this, CACHE_KEY_ELEMENT);
    }
    /**
     * Returns the dom element reference of the mask element that wraps the
     * carousel element.
     * @public
     * @return the mask dom element
     */

  }, {
    key: "mask",
    get: function get() {
      var _a;

      var mask = (0, _cache.fromCache)(this, CACHE_KEY_MASK);
      return (_a = mask.el) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Returns the id-attribute value of the carousel.
     * @public
     * @return the id of the controlled dom element
     */

  }, {
    key: "id",
    get: function get() {
      return (0, _cache.fromCache)(this, CACHE_KEY_ID);
    }
    /**
     * Returns the current index of the carousel. The returned index is a list (array)
     * of indexes that are currently visible (depending on each item width).
     * @public
     * @return a list of visible indexes
     */

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
    }
    /**
     * Sets the current index of the carousel. To set an index you need to pass an
     * array with at least one element. When passing more than one, the rest will
     * be ignored.
     * @public
     * @param values are the upcoming indexes
     */
    ,
    set: function set(values) {
      var behavior = this.behavior,
          el = this.el,
          items = this.items;
      var length = items.length;

      if (!Array.isArray(values) || !values.length) {
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
      el.scrollTo(Object.assign(Object.assign({}, to), {
        behavior: behavior
      }));
    }
    /**
     * Returns an array of all child dom elements of the carousel.
     * @public
     * @return a list of elements (child elements of the root element)
     */

  }, {
    key: "items",
    get: function get() {
      var _this2 = this;

      return (0, _cache.fromCache)(this, CACHE_KEY_ITEMS, function () {
        var _fromCache = (0, _cache.fromCache)(_this2, CACHE_KEY_CONFIGURATION),
            filterItem = _fromCache.filterItem;

        var el = _this2.el;
        var children = Array.from(el.children);
        return children.filter(function (item) {
          return !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden;
        }).filter(filterItem);
      });
    }
    /**
     * Returns an array of all pages. Each page is a group of indexes that matches
     * a page.
     * @public
     * @return the list of pages and indexes inside each page
     */

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
          return page.map(function (_ref) {
            var index = _ref.index;
            return index;
          });
        });
      });
    }
    /**
     * Returns the index of the current page.
     * @public
     * @return the index of the current page
     */

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
    /**
     * This completely deconstructs the carousel and returns the dom to its
     * initial state.
     * @public
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var el = this.el; // Remove created id if it was created by carousel:

      ID_MATCH.test(el.id) && el.removeAttribute('id'); // Destroy attached features:

      var features = (0, _cache.fromCache)(this, CACHE_KEY_FEATURES);
      features.forEach(function (feature) {
        return feature.destroy();
      }); // Remove events:
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
    /**
     * Enforces an update of all enabled components of the carousel. This is, for
     * example, useful when changing the number of items inside the carousel. This
     * also forwards an update call to all attached features.
     * @public
     */

  }, {
    key: "update",
    value: function update() {
      (0, _cache.clearCache)(this, CACHE_KEY_INDEX);
      (0, _cache.clearCache)(this, CACHE_KEY_ITEMS);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGES);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGE_INDEX);
      var features = (0, _cache.fromCache)(this, CACHE_KEY_FEATURES);
      features.forEach(function (feature) {
        return feature.update({
          type: _types.UpdateType.FORCED
        });
      });
    }
  }, {
    key: "_onScroll",
    value: function _onScroll(event) {
      (0, _cache.clearCache)(this, CACHE_KEY_INDEX);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGE_INDEX);
      var features = (0, _cache.fromCache)(this, CACHE_KEY_FEATURES);
      features.forEach(function (feature) {
        return feature.update({
          type: _types.UpdateType.SCROLL
        });
      });
      var index = this.index;
      var configuration = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);
      configuration.onScroll({
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
      var features = (0, _cache.fromCache)(this, CACHE_KEY_FEATURES);
      features.forEach(function (feature) {
        return feature.update({
          type: _types.UpdateType.RESIZE
        });
      });
    }
  }], [{
    key: "resetInstanceCount",
    value: function resetInstanceCount() {
      /* This should not be part of the coverage report: test util */

      /* istanbul ignore next */
      if ("production" === 'test') {
        __instanceCount = 0;
      }
    }
  }]);

  return Carousel;
}();

exports.Carousel = Carousel;
},{"./features/mask":"C2Ky","./proxy":"pmYE","./types":"gkAU","./utils/cache":"HKiW","./utils/debounce":"GQHl"}],"D3is":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

/**
 * Renders a template (function) to into an HTML element. The template needs to
 * return a valid HTML string (with a single root element). A context with
 * key/value pairs will be passed into the template to allow dynamic rendering.
 * @typeParam El is the type of the rendered dom element.
 * @typeParam Context is the shape of the context data object
 * @param template a function to render a template
 * @param context context data for the template
 * @returns the rendered htmml element
 */
function render(template, context) {
  var el = document.createElement('div');
  el.innerHTML = template(context);
  var ref = el.firstElementChild;

  if (!ref) {
    return null;
  }

  return ref;
}
},{}],"Ii21":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Buttons = void 0;

var _cache = require("../../utils/cache");

var _render2 = require("../../utils/render");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var FEATURE_NAME = 'buildin:buttons';
var CACHE_KEY_PROXY = 'prxy';
var CACHE_KEY_CONFIGURATION = 'conf';
var CACHE_KEY_BUTTONS = 'btns';
var EVENT_CLICK = 'click';
var DEFAULTS = {
  template: function template(_ref) {
    var className = _ref.className,
        controls = _ref.controls,
        label = _ref.label,
        title = _ref.title;
    return "\n\t\t<button type=\"button\" class=\"".concat(className, "\" aria-label=\"").concat(label, "\" title=\"").concat(title, "\" aria-controls=\"").concat(controls, "\">\n\t\t\t<span>").concat(label, "</span>\n\t\t</button>\n\t");
  },
  className: 'button',
  nextClassName: 'is-next',
  nextLabel: 'Next',
  nextTitle: 'Go to next',
  previousClassName: 'is-previous',
  previousLabel: 'Previous',
  previousTitle: 'Go to previous'
};
/**
 * The feature to enable button controls (next and previous) for a carousel.
 */

var Buttons = /*#__PURE__*/function () {
  /**
   * Creates an instance of this feature.
   * @param options are the options to configure this instance
   */
  function Buttons() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Buttons);

    (0, _cache.writeCache)(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
    this._onPrev = this._onPrev.bind(this);
    this._onNext = this._onNext.bind(this);
  }
  /**
   * Returns the name of this feature.
   */


  _createClass(Buttons, [{
    key: "name",
    get: function get() {
      return FEATURE_NAME;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */

  }, {
    key: "init",
    value: function init(proxy) {
      (0, _cache.writeCache)(this, CACHE_KEY_PROXY, proxy);

      this._render();
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._remove();

      (0, _cache.clearFullCache)(this);
    }
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     */

  }, {
    key: "update",
    value: function update() {
      this._render();
    }
    /**
     * Renders and update the button elements. Buttons will only be rendered once
     * and then loaded from cache. When calling this function twice or more, the
     * button states will be updated based on the scroll position.
     * @internal
     */

  }, {
    key: "_render",
    value: function _render() {
      var _this = this;

      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var config = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);
      var el = proxy.el,
          mask = proxy.mask,
          pages = proxy.pages,
          pageIndex = proxy.pageIndex; // Render buttons only once. Load them from cache if already rendered and
      // attached to the dom:

      var _fromCache = (0, _cache.fromCache)(this, CACHE_KEY_BUTTONS, function () {
        var target = mask !== null && mask !== void 0 ? mask : el;
        var template = config.template,
            className = config.className,
            previousClassName = config.previousClassName,
            previousLabel = config.previousLabel,
            previousTitle = config.previousTitle,
            nextClassName = config.nextClassName,
            nextLabel = config.nextLabel,
            nextTitle = config.nextTitle; // Create button elements:

        // Create button elements:
        var settings = [{
          controls: el.id,
          label: nextLabel,
          title: nextTitle,
          className: [className, nextClassName].join(' '),
          // The onClick listener is already bound in the constructor.
          //
          // eslint-disable-next-line @typescript-eslint/unbound-method
          handler: _this._onNext
        }, {
          controls: el.id,
          label: previousLabel,
          title: previousTitle,
          className: [className, previousClassName].join(' '),
          // The onClick listener is already bound in the constructor.
          //
          // eslint-disable-next-line @typescript-eslint/unbound-method
          handler: _this._onPrev
        }];
        return settings.map(function (_a) {
          var _b;

          var handler = _a.handler,
              params = __rest(_a, ["handler"]);

          var button = (0, _render2.render)(template, params);

          if (!button) {
            return null;
          }

          button.addEventListener(EVENT_CLICK, handler);
          (_b = target.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(button, target.nextSibling);
          return button;
        });
      }),
          _fromCache2 = _slicedToArray(_fromCache, 2),
          next = _fromCache2[0],
          previous = _fromCache2[1];

      if (next) {
        var lastPage = pages[pageIndex + 1];
        var isLastPage = lastPage === undefined;
        next.disabled = isLastPage;
      }

      if (previous) {
        var firstPage = pages[pageIndex - 1];
        var isFirstPage = firstPage === undefined;
        previous.disabled = isFirstPage;
      }
    }
    /**
     * Removes all buttons from the dom and detaches all event handler.
     * @internal
     */

  }, {
    key: "_remove",
    value: function _remove() {
      var _this2 = this;

      var buttons = (0, _cache.fromCache)(this, CACHE_KEY_BUTTONS);
      buttons.forEach(function (button) {
        var _a; // The onClick listener is already bound in the constructor.
        //
        // eslint-disable-next-line @typescript-eslint/unbound-method


        button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, _this2._onPrev); // The onClick listener is already bound in the constructor.
        //
        // eslint-disable-next-line @typescript-eslint/unbound-method

        button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, _this2._onNext);
        (_a = button === null || button === void 0 ? void 0 : button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
      });
    }
    /**
     * Event handler to navigate backwards (to the left).
     * @internal
     */

  }, {
    key: "_onPrev",
    value: function _onPrev() {
      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var pages = proxy.pages,
          pageIndex = proxy.pageIndex;
      var index = pages[pageIndex - 1] || pages[0];
      proxy.index = index;
    }
    /**
     * Event handler to navigate forwards (to the right).
     * @internal
     */

  }, {
    key: "_onNext",
    value: function _onNext() {
      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var pages = proxy.pages,
          pageIndex = proxy.pageIndex;
      var index = pages[pageIndex + 1] || pages[pages.length - 1];
      proxy.index = index;
    }
  }]);

  return Buttons;
}();

exports.Buttons = Buttons;
},{"../../utils/cache":"HKiW","../../utils/render":"D3is"}],"A9j1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mouse = void 0;

var _cache = require("../../utils/cache");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FEATURE_NAME = 'buildin:mouse';
var CACHE_KEY_PROXY = 'prxy';
var CACHE_KEY_CONFIGURATION = 'conf';
var CACHE_KEY_PAGE_INDEX = 'pgidx';
var CACHE_KEY_POSITION_X = 'posx';
var CACHE_KEY_SCROLL_LEFT = 'scrl';
var CACHE_KEY_TIMEOUT = 'time';
var CURSOR_GRAB = 'grab';
var CURSOR_GRABBING = 'grabbing';
var EVENT_START = 'mousedown';
var EVENT_DRAG = 'mousemove';
var EVENT_END = 'mouseup';
var THRESHOLD_MIN = 100;
var THRESHOLD_MAX = 250;
var THRESHOLD_FACTOR = 0.25; // Relative carousel element width
// We are ignoring this due to this whole feature is only here to make TS happy.

/* istanbul ignore next */

/**
 * Extracts the client x position from an event depending on the event type.
 * @internal
 * @param event the event
 * @returns the client x position
 */

function __getPositionX(event) {
  if (event instanceof MouseEvent) {
    return event.clientX;
  }

  return 0;
}

var DEFAULTS = {
  indicator: false
};
/**
 * Feature to enable mouse controls
 * @experimental
 */

var Mouse = /*#__PURE__*/function () {
  /**
   * Creates an instance of this feature.
   * @param options are the options to configure this instance
   */
  function Mouse() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Mouse);

    (0, _cache.writeCache)(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
    this._onStart = this._onStart.bind(this);
    this._onDrag = this._onDrag.bind(this);
    this._onEnd = this._onEnd.bind(this);
  }
  /**
   * Returns the name of this feature.
   */


  _createClass(Mouse, [{
    key: "name",
    get: function get() {
      return FEATURE_NAME;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */

  }, {
    key: "init",
    value: function init(proxy) {
      (0, _cache.writeCache)(this, CACHE_KEY_PROXY, proxy);
      var config = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);
      var el = proxy.el;
      var element = el;
      element.style.cursor = config.indicator ? CURSOR_GRAB : ''; // The handler is already bound in the constructor.
      //
      // eslint-disable-next-line @typescript-eslint/unbound-method

      el.addEventListener(EVENT_START, this._onStart, {
        passive: true
      });
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */

  }, {
    key: "destroy",
    value: function destroy() {
      (0, _cache.clearFullCache)(this);
    }
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     */

  }, {
    key: "update",
    value: function update() {
      /* nothing to update yet */
    }
    /**
     * Handles the drag start event.
     * @internal
     * @param event the event that triggered the drag start
     */

  }, {
    key: "_onStart",
    value: function _onStart(event) {
      var _a;

      var timeout = (0, _cache.fromCache)(this, CACHE_KEY_TIMEOUT);
      clearTimeout(timeout);
      var config = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);
      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var element = proxy.el;
      (0, _cache.fromCache)(this, CACHE_KEY_SCROLL_LEFT, function () {
        return element.scrollLeft;
      });
      (0, _cache.fromCache)(this, CACHE_KEY_POSITION_X, function () {
        return __getPositionX(event);
      });
      (0, _cache.fromCache)(this, CACHE_KEY_PAGE_INDEX, function () {
        return proxy.pageIndex;
      }); // Reset scroll behavior and scroll snapping to emulate regular scrolling.
      // Prevent user selection while the user drags:

      element.style.userSelect = 'none';
      element.style.scrollBehavior = 'auto';
      element.style.scrollSnapType = 'none';
      element.style.cursor = config.indicator ? CURSOR_GRABBING : ''; // The handlers are already bound in the constructor.
      //

      /* eslint-disable @typescript-eslint/unbound-method */

      window.addEventListener(EVENT_DRAG, this._onDrag, {
        passive: true
      });
      window.addEventListener(EVENT_END, this._onEnd, {
        passive: true
      });
      /* eslint-enable @typescript-eslint/unbound-method */
      // Call the hook:

      (_a = config.onStart) === null || _a === void 0 ? void 0 : _a.call(config, {
        originalEvent: event
      });
    }
    /**
     * Handles the drag event. Calculates and updates scroll position.
     * @internal
     * @param event the event that triggered the dragging
     */

  }, {
    key: "_onDrag",
    value: function _onDrag(event) {
      var _a;

      var config = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);

      var _fromCache = (0, _cache.fromCache)(this, CACHE_KEY_PROXY),
          el = _fromCache.el;

      var left = (0, _cache.fromCache)(this, CACHE_KEY_SCROLL_LEFT);
      var x = (0, _cache.fromCache)(this, CACHE_KEY_POSITION_X);

      var currentX = __getPositionX(event);

      var deltaX = x - currentX;
      el.scrollLeft = left + deltaX; // Call the hook:

      (_a = config.onDrag) === null || _a === void 0 ? void 0 : _a.call(config, {
        originalEvent: event
      });
    }
    /**
     * Handles the drag end event.
     * @internal
     * @param event the event that triggered the drag end
     */

  }, {
    key: "_onEnd",
    value: function _onEnd(event) {
      var _a, _b;

      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var config = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);
      var left = (0, _cache.fromCache)(this, CACHE_KEY_SCROLL_LEFT);
      var pageIndex = (0, _cache.fromCache)(this, CACHE_KEY_PAGE_INDEX);
      (0, _cache.clearCache)(this, CACHE_KEY_SCROLL_LEFT);
      (0, _cache.clearCache)(this, CACHE_KEY_POSITION_X);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGE_INDEX);
      var element = proxy.el;
      var threshold = Math.min(Math.max(THRESHOLD_MIN, element.clientWidth * THRESHOLD_FACTOR), THRESHOLD_MAX);
      var currentLeft = element.scrollLeft;
      var distance = currentLeft - left;
      var offset = Math.abs(distance);
      element.style.removeProperty('user-select');
      element.style.removeProperty('scroll-behavior');
      element.style.cursor = config.indicator ? CURSOR_GRAB : ''; // Apply the index. If the scroll offset is higher that the threshold,
      // navigate to the next page depending on the drag direction.

      var index = proxy.index;

      if (offset > threshold) {
        var direction = distance / offset;
        var at = Math.max(pageIndex + direction, 0);
        index = (_a = proxy.pages[at]) !== null && _a !== void 0 ? _a : index;
      } // Apply the index until the styles are rendered to the element. This is
      // required to have a smooth scroll-behaviour which is disabled during the
      // mouse dragging.


      window.requestAnimationFrame(function () {
        proxy.index = index;
      }); // Get around the scroll-snapping. Enable it until the position is already
      // applied. This will take ~1000ms depending on distance and browser
      // behaviour.

      var timeout = window.setTimeout(function () {
        element.style.removeProperty('scroll-snap-type');
      }, 1000);
      (0, _cache.writeCache)(this, CACHE_KEY_TIMEOUT, timeout); // The handlers are already bound in the constructor.
      //

      /* eslint-disable @typescript-eslint/unbound-method */

      window.removeEventListener(EVENT_DRAG, this._onDrag);
      window.removeEventListener(EVENT_END, this._onEnd);
      /* eslint-enable @typescript-eslint/unbound-method */
      // Call the hook:

      (_b = config.onEnd) === null || _b === void 0 ? void 0 : _b.call(config, {
        originalEvent: event
      });
    }
  }]);

  return Mouse;
}();

exports.Mouse = Mouse;
},{"../../utils/cache":"HKiW"}],"q57n":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pagination = void 0;

var _types = require("../../types");

var _cache = require("../../utils/cache");

var _render = require("../../utils/render");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FEATURE_NAME = 'buildin:pagination';
var CACHE_KEY_PROXY = 'prxy';
var CACHE_KEY_CONFIGURATION = 'conf';
var CACHE_KEY_PAGINATION = 'pags';
var CACHE_KEY_BUTTONS = 'btns';
var DEFAULTS = {
  template: function template(_ref) {
    var className = _ref.className,
        controls = _ref.controls,
        pages = _ref.pages,
        label = _ref.label,
        title = _ref.title;
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
  className: 'pagination',
  label: function label(_ref2) {
    var index = _ref2.index;
    return "".concat(index + 1);
  },
  title: function title(_ref3) {
    var index = _ref3.index;
    return "Go to ".concat(index + 1, ". page");
  }
};
/**
 * The feature to enable pagination controls.
 */

var Pagination = /*#__PURE__*/function () {
  /**
   * Creates an instance of this feature.
   * @param options are the options to configure this instance
   */
  function Pagination() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Pagination);

    (0, _cache.writeCache)(this, CACHE_KEY_CONFIGURATION, Object.assign(Object.assign({}, DEFAULTS), options));
    this._onClick = this._onClick.bind(this);
  }
  /**
   * Returns the name of this feature.
   */


  _createClass(Pagination, [{
    key: "name",
    get: function get() {
      return FEATURE_NAME;
    }
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */

  }, {
    key: "init",
    value: function init(proxy) {
      (0, _cache.writeCache)(this, CACHE_KEY_PROXY, proxy);

      this._add();
    }
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this._remove();

      (0, _cache.clearFullCache)(this);
    }
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     * @param event event that triggered the update
     * @param event.type is the update reason (why this was triggered)
     */

  }, {
    key: "update",
    value: function update(event) {
      switch (event.type) {
        case _types.UpdateType.SCROLL:
          this._update();

          break;

        default:
          this._remove();

          this._add();

          break;
      }
    }
    /**
     * Renders and adds the pagination element. Attaches event handlers to all
     * button elements.
     * @internal
     */

  }, {
    key: "_add",
    value: function _add() {
      var _this = this;

      var _a;

      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var config = (0, _cache.fromCache)(this, CACHE_KEY_CONFIGURATION);
      var el = proxy.el,
          mask = proxy.mask,
          pages = proxy.pages;
      var target = mask !== null && mask !== void 0 ? mask : el;

      if (pages.length < 2) {
        return;
      }

      var template = config.template,
          className = config.className,
          label = config.label,
          title = config.title;
      var pagination = (0, _render.render)(template, {
        label: label,
        title: title,
        pages: pages,
        className: className,
        controls: el.id
      });

      if (!pagination) {
        return;
      } // @TODO: Add template for buttons:


      var buttons = Array.from(pagination.querySelectorAll('button')).map(function (button) {
        // The onClick listener is already bound in the constructor.
        //
        // eslint-disable-next-line @typescript-eslint/unbound-method
        button.addEventListener('click', _this._onClick, true);
        return button;
      });
      (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(pagination);
      (0, _cache.writeCache)(this, CACHE_KEY_PAGINATION, pagination);
      (0, _cache.writeCache)(this, CACHE_KEY_BUTTONS, buttons);

      this._update();
    }
    /**
     * Updates the states of all buttons inside the pagination.
     * @internal
     */

  }, {
    key: "_update",
    value: function _update() {
      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var buttons = (0, _cache.fromCache)(this, CACHE_KEY_BUTTONS);
      var pageIndex = proxy.pageIndex;
      buttons.forEach(function (button, at) {
        return button.disabled = at === pageIndex;
      });
    }
    /**
     * Removes the whole pagination element and removes all attached event handlers.
     * @internal
     */

  }, {
    key: "_remove",
    value: function _remove() {
      var _this2 = this;

      var _a;

      var pagination = (0, _cache.fromCache)(this, CACHE_KEY_PAGINATION);
      var buttons = (0, _cache.fromCache)(this, CACHE_KEY_BUTTONS);
      buttons === null || buttons === void 0 ? void 0 : buttons.forEach(function (button) {
        var _a; // The onClick listener is already bound in the constructor.
        //
        // eslint-disable-next-line @typescript-eslint/unbound-method


        button.removeEventListener('click', _this2._onClick);
        (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
      });
      (_a = pagination === null || pagination === void 0 ? void 0 : pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(pagination);
      (0, _cache.clearCache)(this, CACHE_KEY_BUTTONS);
      (0, _cache.clearCache)(this, CACHE_KEY_PAGINATION);
    }
    /**
     * Event handler when a button is clicked. Detects the current index of the
     * clicked button inside the pagination and updates the index accordingly of
     * the carousel.
     * @internal
     * @param event the mouse event
     */

  }, {
    key: "_onClick",
    value: function _onClick(event) {
      var proxy = (0, _cache.fromCache)(this, CACHE_KEY_PROXY);
      var buttons = (0, _cache.fromCache)(this, CACHE_KEY_BUTTONS);
      var target = event.currentTarget;
      var index = buttons.indexOf(target);
      proxy.index = proxy.pages[index];
    }
  }]);

  return Pagination;
}();

exports.Pagination = Pagination;
},{"../../types":"gkAU","../../utils/cache":"HKiW","../../utils/render":"D3is"}],"qcOq":[function(require,module,exports) {
"use strict";

var _carousel = require("../../src/carousel");

var _buttons = require("../../src/features/buttons");

var _mouse = require("../../src/features/mouse");

var _pagination = require("../../src/features/pagination");

var elements = Array.from(document.querySelectorAll('.caroucssel'));
elements.forEach(function (element) {
  var _a, _b;

  var config = ((_b = (_a = element.dataset) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.split(',').map(function (size) {
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
  new _carousel.Carousel(element, {
    features: [new _buttons.Buttons(), new _pagination.Pagination(), new _mouse.Mouse({
      indicator: true
    })],
    onScroll: function onScroll(event) {// console.log('INDEX', event.index);
      // console.log('PAGES', event.target.pages);
    }
  });
});
},{"../../src/carousel":"NdLT","../../src/features/buttons":"Ii21","../../src/features/mouse":"A9j1","../../src/features/pagination":"q57n"}]},{},["qcOq"], null)
//# sourceMappingURL=/caroucssel/script.db04994e.js.map