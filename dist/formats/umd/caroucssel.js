(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("caroucssel", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.caroucssel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.version = _exports.UpdateType = _exports.ScrollBehavior = _exports.Pagination = _exports.Mouse = _exports.Mask = _exports.Carousel = _exports.Buttons = void 0;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function __rest(s, e) {
    var t = {};

    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }

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

  function writeCache(ref, key, value) {
    var storage = __CACHE.get(ref) || {};
    storage[key] = value;

    __CACHE.set(ref, storage);
  }

  function clearCache(ref, key) {
    var storage = __CACHE.get(ref);

    if (!storage) {
      return;
    }

    storage[key] = undefined;
    delete storage[key];
  }

  function clearFullCache(ref) {
    __CACHE.delete(ref);
  }

  function render(template, context) {
    var el = document.createElement('div');
    el.innerHTML = template(context);
    var ref = el.firstElementChild;

    if (!ref) {
      return null;
    }

    return ref;
  }

  var FEATURE_NAME$3 = 'buildin:buttons';
  var CACHE_KEY_PROXY$4 = 'prxy';
  var CACHE_KEY_CONFIGURATION$4 = 'conf';
  var CACHE_KEY_BUTTONS$1 = 'btns';
  var EVENT_CLICK = 'click';
  var DEFAULTS$4 = {
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

  var Buttons = /*#__PURE__*/function () {
    function Buttons() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Buttons);

      writeCache(this, CACHE_KEY_CONFIGURATION$4, Object.assign(Object.assign({}, DEFAULTS$4), options));
      this._onPrev = this._onPrev.bind(this);
      this._onNext = this._onNext.bind(this);
    }

    _createClass(Buttons, [{
      key: "name",
      get: function get() {
        return FEATURE_NAME$3;
      }
    }, {
      key: "init",
      value: function init(proxy) {
        writeCache(this, CACHE_KEY_PROXY$4, proxy);

        this._render();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._remove();

        clearFullCache(this);
      }
    }, {
      key: "update",
      value: function update() {
        this._render();
      }
    }, {
      key: "_render",
      value: function _render() {
        var _this = this;

        var proxy = fromCache(this, CACHE_KEY_PROXY$4);
        var config = fromCache(this, CACHE_KEY_CONFIGURATION$4);
        var el = proxy.el,
            mask = proxy.mask,
            pages = proxy.pages,
            pageIndex = proxy.pageIndex;

        var _fromCache = fromCache(this, CACHE_KEY_BUTTONS$1, function () {
          var target = mask !== null && mask !== void 0 ? mask : el;
          var template = config.template,
              className = config.className,
              previousClassName = config.previousClassName,
              previousLabel = config.previousLabel,
              previousTitle = config.previousTitle,
              nextClassName = config.nextClassName,
              nextLabel = config.nextLabel,
              nextTitle = config.nextTitle;
          var settings = [{
            controls: el.id,
            label: nextLabel,
            title: nextTitle,
            className: [className, nextClassName].join(' '),
            handler: _this._onNext
          }, {
            controls: el.id,
            label: previousLabel,
            title: previousTitle,
            className: [className, previousClassName].join(' '),
            handler: _this._onPrev
          }];
          return settings.map(function (_a) {
            var _b;

            var handler = _a.handler,
                params = __rest(_a, ["handler"]);

            var button = render(template, params);

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
    }, {
      key: "_remove",
      value: function _remove() {
        var _this2 = this;

        var buttons = fromCache(this, CACHE_KEY_BUTTONS$1);
        buttons === null || buttons === void 0 ? void 0 : buttons.forEach(function (button) {
          var _a;

          button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, _this2._onPrev);
          button === null || button === void 0 ? void 0 : button.removeEventListener(EVENT_CLICK, _this2._onNext);
          (_a = button === null || button === void 0 ? void 0 : button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
      }
    }, {
      key: "_onPrev",
      value: function _onPrev() {
        var proxy = fromCache(this, CACHE_KEY_PROXY$4);
        var pages = proxy.pages,
            pageIndex = proxy.pageIndex;
        var index = pages[pageIndex - 1] || pages[0];
        proxy.index = index;
      }
    }, {
      key: "_onNext",
      value: function _onNext() {
        var proxy = fromCache(this, CACHE_KEY_PROXY$4);
        var pages = proxy.pages,
            pageIndex = proxy.pageIndex;
        var index = pages[pageIndex + 1] || pages[pages.length - 1];
        proxy.index = index;
      }
    }]);

    return Buttons;
  }();

  _exports.Buttons = Buttons;
  var FEATURE_NAME$2 = 'buildin:mouse';
  var CACHE_KEY_PROXY$3 = 'prxy';
  var CACHE_KEY_CONFIGURATION$3 = 'conf';
  var CACHE_KEY_PAGE_INDEX$1 = 'pgidx';
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
  var THRESHOLD_FACTOR = 0.25;

  function __getPositionX(event) {
    if (event instanceof MouseEvent) {
      return event.clientX;
    }

    return 0;
  }

  var DEFAULTS$3 = {
    indicator: false
  };

  var Mouse = /*#__PURE__*/function () {
    function Mouse() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Mouse);

      writeCache(this, CACHE_KEY_CONFIGURATION$3, Object.assign(Object.assign({}, DEFAULTS$3), options));
      this._onStart = this._onStart.bind(this);
      this._onDrag = this._onDrag.bind(this);
      this._onEnd = this._onEnd.bind(this);
    }

    _createClass(Mouse, [{
      key: "name",
      get: function get() {
        return FEATURE_NAME$2;
      }
    }, {
      key: "init",
      value: function init(proxy) {
        writeCache(this, CACHE_KEY_PROXY$3, proxy);
        var config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
        var el = proxy.el;
        var element = el;
        element.style.cursor = config.indicator ? CURSOR_GRAB : '';
        el.addEventListener(EVENT_START, this._onStart, {
          passive: true
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        clearFullCache(this);
      }
    }, {
      key: "update",
      value: function update() {}
    }, {
      key: "_onStart",
      value: function _onStart(event) {
        var _a;

        var timeout = fromCache(this, CACHE_KEY_TIMEOUT);
        clearTimeout(timeout);
        var config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
        var proxy = fromCache(this, CACHE_KEY_PROXY$3);
        var element = proxy.el;
        fromCache(this, CACHE_KEY_SCROLL_LEFT, function () {
          return element.scrollLeft;
        });
        fromCache(this, CACHE_KEY_POSITION_X, function () {
          return __getPositionX(event);
        });
        fromCache(this, CACHE_KEY_PAGE_INDEX$1, function () {
          return proxy.pageIndex;
        });
        element.style.userSelect = 'none';
        element.style.scrollBehavior = 'auto';
        element.style.scrollSnapType = 'none';
        element.style.cursor = config.indicator ? CURSOR_GRABBING : '';
        window.addEventListener(EVENT_DRAG, this._onDrag, {
          passive: true
        });
        window.addEventListener(EVENT_END, this._onEnd, {
          passive: true
        });
        (_a = config.onStart) === null || _a === void 0 ? void 0 : _a.call(config, {
          originalEvent: event
        });
      }
    }, {
      key: "_onDrag",
      value: function _onDrag(event) {
        var _a, _b, _c;

        var config = fromCache(this, CACHE_KEY_CONFIGURATION$3);

        var _fromCache3 = fromCache(this, CACHE_KEY_PROXY$3),
            el = _fromCache3.el;

        var left = (_a = fromCache(this, CACHE_KEY_SCROLL_LEFT)) !== null && _a !== void 0 ? _a : 0;
        var x = (_b = fromCache(this, CACHE_KEY_POSITION_X)) !== null && _b !== void 0 ? _b : 0;

        var currentX = __getPositionX(event);

        var deltaX = x - currentX;
        el.scrollLeft = left + deltaX;
        (_c = config.onDrag) === null || _c === void 0 ? void 0 : _c.call(config, {
          originalEvent: event
        });
      }
    }, {
      key: "_onEnd",
      value: function _onEnd(event) {
        var _a, _b, _c, _d;

        var proxy = fromCache(this, CACHE_KEY_PROXY$3);
        var config = fromCache(this, CACHE_KEY_CONFIGURATION$3);
        var left = (_a = fromCache(this, CACHE_KEY_SCROLL_LEFT)) !== null && _a !== void 0 ? _a : 0;
        var pageIndex = (_b = fromCache(this, CACHE_KEY_PAGE_INDEX$1)) !== null && _b !== void 0 ? _b : 0;
        clearCache(this, CACHE_KEY_SCROLL_LEFT);
        clearCache(this, CACHE_KEY_POSITION_X);
        clearCache(this, CACHE_KEY_PAGE_INDEX$1);
        var element = proxy.el;
        var threshold = Math.min(Math.max(THRESHOLD_MIN, element.clientWidth * THRESHOLD_FACTOR), THRESHOLD_MAX);
        var currentLeft = element.scrollLeft;
        var distance = currentLeft - left;
        var offset = Math.abs(distance);
        element.style.removeProperty('user-select');
        element.style.removeProperty('scroll-behavior');
        element.style.cursor = config.indicator ? CURSOR_GRAB : '';
        var index = proxy.index;

        if (offset > threshold) {
          var direction = distance / offset;
          var at = Math.max(pageIndex + direction, 0);
          index = (_c = proxy.pages[at]) !== null && _c !== void 0 ? _c : index;
        }

        window.requestAnimationFrame(function () {
          proxy.index = index;
        });
        var timeout = window.setTimeout(function () {
          element.style.removeProperty('scroll-snap-type');
        }, 1000);
        writeCache(this, CACHE_KEY_TIMEOUT, timeout);
        window.removeEventListener(EVENT_DRAG, this._onDrag);
        window.removeEventListener(EVENT_END, this._onEnd);
        (_d = config.onEnd) === null || _d === void 0 ? void 0 : _d.call(config, {
          originalEvent: event
        });
      }
    }]);

    return Mouse;
  }();

  _exports.Mouse = Mouse;
  var UpdateType;
  _exports.UpdateType = UpdateType;

  (function (UpdateType) {
    UpdateType["SCROLL"] = "scroll";
    UpdateType["RESIZE"] = "resize";
    UpdateType["FORCED"] = "forced";
    UpdateType["FEATURE"] = "feature";
  })(UpdateType || (_exports.UpdateType = UpdateType = {}));

  var ScrollBehavior;
  _exports.ScrollBehavior = ScrollBehavior;

  (function (ScrollBehavior) {
    ScrollBehavior["AUTO"] = "auto";
    ScrollBehavior["SMOOTH"] = "smooth";
  })(ScrollBehavior || (_exports.ScrollBehavior = ScrollBehavior = {}));

  var FEATURE_NAME$1 = 'buildin:pagination';
  var CACHE_KEY_PROXY$2 = 'prxy';
  var CACHE_KEY_CONFIGURATION$2 = 'conf';
  var CACHE_KEY_PAGINATION = 'pags';
  var CACHE_KEY_BUTTONS = 'btns';
  var DEFAULTS$2 = {
    template: function template(_ref2) {
      var className = _ref2.className,
          controls = _ref2.controls,
          pages = _ref2.pages,
          label = _ref2.label,
          title = _ref2.title;
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
    label: function label(_ref3) {
      var index = _ref3.index;
      return "".concat(index + 1);
    },
    title: function title(_ref4) {
      var index = _ref4.index;
      return "Go to ".concat(index + 1, ". page");
    }
  };

  var Pagination = /*#__PURE__*/function () {
    function Pagination() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Pagination);

      writeCache(this, CACHE_KEY_CONFIGURATION$2, Object.assign(Object.assign({}, DEFAULTS$2), options));
      this._onClick = this._onClick.bind(this);
    }

    _createClass(Pagination, [{
      key: "name",
      get: function get() {
        return FEATURE_NAME$1;
      }
    }, {
      key: "init",
      value: function init(proxy) {
        writeCache(this, CACHE_KEY_PROXY$2, proxy);

        this._add();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._remove();

        clearFullCache(this);
      }
    }, {
      key: "update",
      value: function update(event) {
        switch (event.type) {
          case UpdateType.SCROLL:
            this._update();

            break;

          default:
            this._remove();

            this._add();

            break;
        }
      }
    }, {
      key: "_add",
      value: function _add() {
        var _this3 = this;

        var _a;

        var proxy = fromCache(this, CACHE_KEY_PROXY$2);
        var config = fromCache(this, CACHE_KEY_CONFIGURATION$2);
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
        var pagination = render(template, {
          label: label,
          title: title,
          pages: pages,
          className: className,
          controls: el.id
        });

        if (!pagination) {
          return;
        }

        var buttons = Array.from(pagination.querySelectorAll('button')).map(function (button) {
          button.addEventListener('click', _this3._onClick, true);
          return button;
        });
        (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(pagination);
        writeCache(this, CACHE_KEY_PAGINATION, pagination);
        writeCache(this, CACHE_KEY_BUTTONS, buttons);

        this._update();
      }
    }, {
      key: "_update",
      value: function _update() {
        var proxy = fromCache(this, CACHE_KEY_PROXY$2);
        var buttons = fromCache(this, CACHE_KEY_BUTTONS);
        var pageIndex = proxy.pageIndex;
        buttons === null || buttons === void 0 ? void 0 : buttons.forEach(function (button, at) {
          return button.disabled = at === pageIndex;
        });
      }
    }, {
      key: "_remove",
      value: function _remove() {
        var _this4 = this;

        var _a;

        var pagination = fromCache(this, CACHE_KEY_PAGINATION);
        var buttons = fromCache(this, CACHE_KEY_BUTTONS);
        buttons === null || buttons === void 0 ? void 0 : buttons.forEach(function (button) {
          var _a;

          button.removeEventListener('click', _this4._onClick);
          (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
        (_a = pagination === null || pagination === void 0 ? void 0 : pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(pagination);
        clearCache(this, CACHE_KEY_BUTTONS);
        clearCache(this, CACHE_KEY_PAGINATION);
      }
    }, {
      key: "_onClick",
      value: function _onClick(event) {
        var proxy = fromCache(this, CACHE_KEY_PROXY$2);
        var buttons = fromCache(this, CACHE_KEY_BUTTONS);

        if (!buttons) {
          return;
        }

        var target = event.currentTarget;
        var index = buttons.indexOf(target);
        proxy.index = proxy.pages[index];
      }
    }]);

    return Pagination;
  }();

  _exports.Pagination = Pagination;
  var CACHE_KEY_DIMENSIONS = 'dims';

  var Scrollbar = /*#__PURE__*/function () {
    function Scrollbar() {
      var _this5 = this;

      _classCallCheck(this, Scrollbar);

      window.addEventListener('resize', function () {
        clearCache(_this5, CACHE_KEY_DIMENSIONS);
      });
    }

    _createClass(Scrollbar, [{
      key: "dimensions",
      get: function get() {
        return fromCache(this, CACHE_KEY_DIMENSIONS, function () {
          var inner = document.createElement('div');
          var outer = document.createElement('div');
          document.body.appendChild(outer);
          outer.style.position = 'absolute';
          outer.style.top = '0px';
          outer.style.left = '0px';
          outer.style.visibility = 'hidden';
          outer.appendChild(inner);
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
            height: height
          };
        });
      }
    }]);

    return Scrollbar;
  }();

  var FEATURE_NAME = 'buildin:mask';
  var CACHE_KEY_PROXY$1 = 'prxy';
  var CACHE_KEY_CONFIGURATION$1 = 'conf';
  var CACHE_KEY_MASK$1 = 'mask';
  var CACHE_KEY_HEIGHT = 'hght';

  var __scrollbar;

  var DEFAULTS$1 = {
    enabled: true,
    className: 'caroucssel-mask',
    tagName: 'div'
  };

  var Mask = /*#__PURE__*/function () {
    function Mask() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Mask);

      writeCache(this, CACHE_KEY_CONFIGURATION$1, Object.assign(Object.assign({}, DEFAULTS$1), options));
    }

    _createClass(Mask, [{
      key: "name",
      get: function get() {
        return FEATURE_NAME;
      }
    }, {
      key: "el",
      get: function get() {
        var _a;

        return (_a = fromCache(this, CACHE_KEY_MASK$1)) !== null && _a !== void 0 ? _a : null;
      }
    }, {
      key: "init",
      value: function init(proxy) {
        writeCache(this, CACHE_KEY_PROXY$1, proxy);
        __scrollbar = __scrollbar !== null && __scrollbar !== void 0 ? __scrollbar : new Scrollbar();

        this._render();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._remove();

        clearFullCache(this);
      }
    }, {
      key: "update",
      value: function update(event) {
        switch (event.type) {
          case UpdateType.RESIZE:
          case UpdateType.FORCED:
            clearCache(this, CACHE_KEY_HEIGHT);

            this._render();

            break;

          default:
            this._render();

            break;
        }
      }
    }, {
      key: "_render",
      value: function _render() {
        var _fromCache4 = fromCache(this, CACHE_KEY_CONFIGURATION$1),
            enabled = _fromCache4.enabled,
            className = _fromCache4.className,
            tagName = _fromCache4.tagName;

        if (!enabled) {
          return;
        }

        var proxy = fromCache(this, CACHE_KEY_PROXY$1);
        var element = proxy.el;
        var height = __scrollbar.dimensions.height;

        if (element.scrollWidth <= element.clientWidth) {
          height = 0;
        }

        fromCache(this, CACHE_KEY_MASK$1, function () {
          var _a;

          var mask = document.createElement(tagName);
          mask.className = className;
          mask.style.overflow = 'hidden';
          mask.style.height = '100%';
          (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(mask, element);
          mask.appendChild(element);
          return mask;
        });
        var cachedHeight = fromCache(this, CACHE_KEY_HEIGHT);

        if (height === cachedHeight) {
          return;
        }

        writeCache(this, CACHE_KEY_HEIGHT, height);
        element.style.height = "calc(100% + ".concat(height, "px)");
        element.style.marginBottom = "".concat(height * -1, "px");
      }
    }, {
      key: "_remove",
      value: function _remove() {
        var _a, _b;

        var _fromCache5 = fromCache(this, CACHE_KEY_PROXY$1),
            el = _fromCache5.el;

        var mask = fromCache(this, CACHE_KEY_MASK$1);
        (_a = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, mask);
        (_b = mask === null || mask === void 0 ? void 0 : mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(mask);
        el.removeAttribute('style');
      }
    }]);

    return Mask;
  }();

  _exports.Mask = Mask;
  var CACHE_KEY_INSTANCE = 'inst';
  var CACHE_KEY_FEATURES$1 = 'feat';

  function __getInstance(ref) {
    return fromCache(ref, CACHE_KEY_INSTANCE);
  }

  function __getFeatures(ref) {
    return fromCache(ref, CACHE_KEY_FEATURES$1);
  }

  var Proxy = /*#__PURE__*/function () {
    function Proxy(instance, features) {
      _classCallCheck(this, Proxy);

      writeCache(this, CACHE_KEY_INSTANCE, instance);
      writeCache(this, CACHE_KEY_FEATURES$1, features);
    }

    _createClass(Proxy, [{
      key: "id",
      get: function get() {
        return __getInstance(this).id;
      }
    }, {
      key: "el",
      get: function get() {
        return __getInstance(this).el;
      }
    }, {
      key: "mask",
      get: function get() {
        return __getInstance(this).mask;
      }
    }, {
      key: "index",
      get: function get() {
        return __getInstance(this).index;
      },
      set: function set(value) {
        __getInstance(this).index = value;
      }
    }, {
      key: "items",
      get: function get() {
        return __getInstance(this).items;
      }
    }, {
      key: "pages",
      get: function get() {
        return __getInstance(this).pages;
      }
    }, {
      key: "pageIndex",
      get: function get() {
        return __getInstance(this).pageIndex;
      }
    }, {
      key: "update",
      value: function update(sender) {
        __getInstance(this).update();

        __getFeatures(this).forEach(function (feature) {
          if (feature === sender) {
            return;
          }

          feature.update({
            type: UpdateType.FEATURE
          });
        });
      }
    }]);

    return Proxy;
  }();

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

  var Carousel = /*#__PURE__*/function () {
    function Carousel(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Carousel);

      this.behavior = ScrollBehavior.AUTO;

      if (!el || !(el instanceof Element)) {
        throw new Error("Carousel needs a dom element but \"".concat(_typeof(el), "\" was passed."));
      }

      writeCache(this, CACHE_KEY_ELEMENT, el);
      __instanceCount++;
      el.id = el.id || ID_NAME(__instanceCount);
      writeCache(this, CACHE_KEY_ID, el.id);
      var configuration = Object.assign(Object.assign({}, DEFAULTS), options);
      writeCache(this, CACHE_KEY_CONFIGURATION, configuration);
      var mask = null;

      var features = _toConsumableArray(configuration.features);

      var index = configuration.features.findIndex(function (feature) {
        return feature instanceof Mask;
      });

      if (index > -1) {
        var _features$splice = features.splice(index, 1);

        var _features$splice2 = _slicedToArray(_features$splice, 1);

        mask = _features$splice2[0];
      }

      mask !== null && mask !== void 0 ? mask : mask = new Mask();
      features = features.filter(function (feature) {
        return !(feature instanceof Mask);
      });
      features = [mask].concat(_toConsumableArray(features));
      writeCache(this, CACHE_KEY_MASK, mask);
      var proxy = new Proxy(this, features);
      writeCache(this, CACHE_KEY_PROXY, proxy);
      writeCache(this, CACHE_KEY_FEATURES, features);
      features.forEach(function (feature) {
        return feature.init(proxy);
      });

      switch (true) {
        case Array.isArray(options.index):
          this.index = options.index;
          break;

        case !isNaN(options.index):
          this.index = [options.index];
          break;
      }

      this.behavior = ScrollBehavior.SMOOTH;
      this._onScroll = debounce(this._onScroll.bind(this), 25);
      this._onResize = debounce(this._onResize.bind(this), 25);
      el.addEventListener(EVENT_SCROLL, this._onScroll);
      window.addEventListener(EVENT_RESIZE, this._onResize);
    }

    _createClass(Carousel, [{
      key: "el",
      get: function get() {
        return fromCache(this, CACHE_KEY_ELEMENT);
      }
    }, {
      key: "mask",
      get: function get() {
        var _a;

        var mask = fromCache(this, CACHE_KEY_MASK);
        return (_a = mask.el) !== null && _a !== void 0 ? _a : null;
      }
    }, {
      key: "id",
      get: function get() {
        return fromCache(this, CACHE_KEY_ID);
      }
    }, {
      key: "index",
      get: function get() {
        var _this6 = this;

        return fromCache(this, CACHE_KEY_INDEX, function () {
          var el = _this6.el,
              items = _this6.items;
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
            return [0];
          }

          return index;
        });
      },
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
        };

        if (value === this.pages[0][0]) {
          to.left = 0;
        }

        if (from.left === to.left) {
          return;
        }

        clearCache(this, CACHE_KEY_INDEX);
        el.scrollTo(Object.assign(Object.assign({}, to), {
          behavior: behavior
        }));
      }
    }, {
      key: "items",
      get: function get() {
        var _this7 = this;

        return fromCache(this, CACHE_KEY_ITEMS, function () {
          var _fromCache6 = fromCache(_this7, CACHE_KEY_CONFIGURATION),
              filterItem = _fromCache6.filterItem;

          var el = _this7.el;
          var children = Array.from(el.children);
          return children.filter(function (item) {
            return !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden;
          }).filter(filterItem);
        });
      }
    }, {
      key: "pages",
      get: function get() {
        var _this8 = this;

        return fromCache(this, CACHE_KEY_PAGES, function () {
          var el = _this8.el,
              items = _this8.items;
          var viewport = el.clientWidth;

          if (viewport === 0) {
            return items.map(function (item, index) {
              return [index];
            });
          }

          var pages = [[]];
          items.map(function (item, index) {
            var left = item.offsetLeft,
                width = item.clientWidth;
            return {
              left: left,
              width: width,
              item: item,
              index: index
            };
          }).sort(function (a, b) {
            return a.left - b.left;
          }).forEach(function (item) {
            var left = item.left,
                width = item.width;
            var prevPage = pages[pages.length - 1];
            var firstItem = prevPage[0];
            var start = (firstItem === null || firstItem === void 0 ? void 0 : firstItem.left) || 0;

            if (prevPage === pages[0]) {
              start = 0;
            }

            var add = Math.floor((left - start + width * (1 - VISIBILITY_OFFSET)) / viewport);

            while (add > 0) {
              pages.push([]);
              add--;
            }

            var page = pages[pages.length - 1];
            page.push(item);
          });
          pages = pages.filter(function (page) {
            return page.length !== 0;
          });
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
        var _this9 = this;

        return fromCache(this, CACHE_KEY_PAGE_INDEX, function () {
          var el = _this9.el,
              items = _this9.items,
              index = _this9.index,
              pages = _this9.pages;
          var outerLeft = el.getBoundingClientRect().left;
          var clientWidth = el.clientWidth;
          var visibles = index.reduce(function (acc, at) {
            if (!items[at]) {
              return acc;
            }

            var _items$at$getBounding = items[at].getBoundingClientRect(),
                left = _items$at$getBounding.left,
                right = _items$at$getBounding.right;

            left = Math.round(left - outerLeft);
            right = Math.round(right - outerLeft);

            if (left < 0 || clientWidth < right) {
              return acc;
            }

            return acc.concat([at]);
          }, []);

          if (visibles.length === 0) {
            visibles = [index[0]];
          }

          var at = visibles.sort(function (a, b) {
            var rightA = items[a].getBoundingClientRect().right;
            var rightB = items[b].getBoundingClientRect().right;
            return rightB - rightA;
          })[0];
          return pages.findIndex(function (page) {
            return page.includes(at);
          });
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var el = this.el;
        ID_MATCH.test(el.id) && el.removeAttribute('id');
        var features = fromCache(this, CACHE_KEY_FEATURES);
        features.forEach(function (feature) {
          return feature.destroy();
        });
        el.removeEventListener(EVENT_SCROLL, this._onScroll);
        window.removeEventListener(EVENT_RESIZE, this._onResize);
        clearFullCache(this);
      }
    }, {
      key: "update",
      value: function update() {
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_ITEMS);
        clearCache(this, CACHE_KEY_PAGES);
        clearCache(this, CACHE_KEY_PAGE_INDEX);
        var features = fromCache(this, CACHE_KEY_FEATURES);
        features.forEach(function (feature) {
          return feature.update({
            type: UpdateType.FORCED
          });
        });
      }
    }, {
      key: "_onScroll",
      value: function _onScroll(event) {
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_PAGE_INDEX);
        var features = fromCache(this, CACHE_KEY_FEATURES);
        features.forEach(function (feature) {
          return feature.update({
            type: UpdateType.SCROLL
          });
        });
        var index = this.index;
        var configuration = fromCache(this, CACHE_KEY_CONFIGURATION);
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
        clearCache(this, CACHE_KEY_PAGES);
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_PAGE_INDEX);
        var features = fromCache(this, CACHE_KEY_FEATURES);
        features.forEach(function (feature) {
          return feature.update({
            type: UpdateType.RESIZE
          });
        });
      }
    }], [{
      key: "resetInstanceCount",
      value: function resetInstanceCount() {}
    }]);

    return Carousel;
  }();

  _exports.Carousel = Carousel;
  var version = '1.0.1';
  _exports.version = version;
});
