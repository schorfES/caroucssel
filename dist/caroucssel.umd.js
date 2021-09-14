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
  _exports.Carousel = void 0;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var __CACHE = new WeakMap();

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

  function render(template, data) {
    var el = document.createElement('div');
    el.innerHTML = template(data);
    var ref = el.firstElementChild;

    if (!ref) {
      return null;
    }

    return ref;
  }

  var Scrollbar = /*#__PURE__*/function () {
    function Scrollbar() {
      var _this = this;

      _classCallCheck(this, Scrollbar);

      window.addEventListener('resize', function () {
        clearCache(_this, 'dimensions');
      });
    }

    _createClass(Scrollbar, [{
      key: "dimensions",
      get: function get() {
        return fromCache(this, 'dimensions', function () {
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

  var ID_NAME = function ID_NAME(count) {
    return "caroucssel-".concat(count);
  };

  var ID_MATCH = /^caroucssel-[0-9]*$/;
  var CACHE_KEY_INDEX = 'index';
  var CACHE_KEY_ITEMS = 'items';
  var CACHE_KEY_PAGES = 'pages';
  var CACHE_KEY_PAGE_INDEX = 'page-index';
  var CACHE_KEY_SCROLLBAR = 'scrollbar';
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
    hasScrollbars: false,
    scrollbarsMaskClassName: 'caroucssel-mask',
    filterItem: function filterItem() {
      return true;
    },
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

      this._mask = null;
      this._isSmooth = false;
      this._previous = null;
      this._next = null;
      this._pagination = null;
      this._paginationButtons = null;

      if (!el || !(el instanceof Element)) {
        throw new Error("Carousel needs a dom element but \"".concat(_typeof(el), "\" was passed."));
      }

      this._el = el;
      __scrollbar = __scrollbar || new Scrollbar();
      __instanceCount++;
      el.id = el.id || ID_NAME(__instanceCount);
      this._id = el.id;
      this._mask = null;
      var opts = Object.assign(Object.assign({}, DEFAULTS), options);
      this._conf = opts;

      this._addButtons();

      this._addPagination();

      this._updateScrollbars();

      switch (true) {
        case Array.isArray(options.index):
          this.index = options.index;
          break;

        case !isNaN(options.index):
          this.index = [options.index];
          break;
      }

      this._isSmooth = true;
      this._onScroll = debounce(this._onScroll.bind(this), 25);
      this._onResize = debounce(this._onResize.bind(this), 25);
      el.addEventListener(EVENT_SCROLL, this._onScroll);
      window.addEventListener(EVENT_RESIZE, this._onResize);
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
        var _this2 = this;

        return fromCache(this, CACHE_KEY_INDEX, function () {
          var el = _this2.el,
              items = _this2.items;
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
        };

        if (value === this.pages[0][0]) {
          to.left = 0;
        }

        if (from.left === to.left) {
          return;
        }

        clearCache(this, CACHE_KEY_INDEX);
        var behavior = this._isSmooth ? 'smooth' : 'auto';
        el.scrollTo(Object.assign(Object.assign({}, to), {
          behavior: behavior
        }));
      }
    }, {
      key: "items",
      get: function get() {
        var _this3 = this;

        return fromCache(this, CACHE_KEY_ITEMS, function () {
          var el = _this3.el,
              filterItem = _this3._conf.filterItem;
          var children = Array.from(el.children);
          return children.filter(function (item) {
            return !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden;
          }).filter(filterItem);
        });
      }
    }, {
      key: "pages",
      get: function get() {
        var _this4 = this;

        return fromCache(this, CACHE_KEY_PAGES, function () {
          var el = _this4.el,
              items = _this4.items;
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
        var _this5 = this;

        return fromCache(this, CACHE_KEY_PAGE_INDEX, function () {
          var el = _this5.el,
              items = _this5.items,
              index = _this5.index,
              pages = _this5.pages;
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

        this._removeButtons();

        this._removePagination();

        this._removeScrollbars();

        el.removeEventListener(EVENT_SCROLL, this._onScroll);
        window.removeEventListener(EVENT_RESIZE, this._onResize);
        clearFullCache(this);
      }
    }, {
      key: "update",
      value: function update() {
        clearFullCache(this);

        this._updateButtons();

        this._updatePagination();

        this._updateScrollbars();
      }
    }, {
      key: "_updateScrollbars",
      value: function _updateScrollbars() {
        var _this6 = this;

        var el = this.el,
            _options = this._conf;
        var hasScrollbars = _options.hasScrollbars,
            scrollbarsMaskClassName = _options.scrollbarsMaskClassName;

        if (hasScrollbars) {
          return;
        }

        var height = __scrollbar.dimensions.height;

        if (el.scrollWidth <= el.clientWidth) {
          height = 0;
        }

        this._mask = this._mask || function () {
          var _a;

          var mask = document.createElement('div');
          mask.className = scrollbarsMaskClassName;
          mask.style.overflow = 'hidden';
          mask.style.height = '100%';
          (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(mask, _this6.el);
          mask.appendChild(el);
          return mask;
        }();

        var cachedHeight = fromCache(this, CACHE_KEY_SCROLLBAR, function () {
          return undefined;
        });

        if (height === cachedHeight) {
          return;
        }

        writeCache(this, CACHE_KEY_SCROLLBAR, height);
        var element = el;
        element.style.height = "calc(100% + ".concat(height, "px)");
        element.style.marginBottom = "".concat(height * -1, "px");
      }
    }, {
      key: "_removeScrollbars",
      value: function _removeScrollbars() {
        var _a, _b;

        var _mask = this._mask,
            el = this.el;

        if (!_mask) {
          return;
        }

        (_a = _mask.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, _mask);
        (_b = _mask.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(_mask);
        el.removeAttribute('style');
        this._mask = null;
      }
    }, {
      key: "_addButtons",
      value: function _addButtons() {
        var _this7 = this;

        var _a, _b;

        var el = this.el,
            id = this.id,
            _options = this._conf;

        if (!_options.hasButtons) {
          return;
        }

        var buttonTemplate = _options.buttonTemplate,
            buttonClassName = _options.buttonClassName,
            buttonPrevious = _options.buttonPrevious,
            buttonNext = _options.buttonNext;
        var controls = id;

        var _map = [Object.assign(Object.assign(Object.assign({}, DEFAULTS_BUTTON_PREVIOUS), buttonPrevious), {
          controls: controls,
          className: [buttonClassName, buttonPrevious.className].join(' ')
        }), Object.assign(Object.assign(Object.assign({}, DEFAULTS_BUTTON_NEXT), buttonNext), {
          controls: controls,
          className: [buttonClassName, buttonNext.className].join(' ')
        })].map(function (params) {
          return render(buttonTemplate, params);
        }),
            _map2 = _slicedToArray(_map, 2),
            previous = _map2[0],
            next = _map2[1];

        if (previous) {
          var onPrevious = function onPrevious() {
            var pages = _this7.pages,
                pageIndex = _this7.pageIndex;
            var index = pages[pageIndex - 1] || pages[0];
            _this7.index = index;
          };

          previous.onclick = onPrevious;
          (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(previous);
        }

        this._previous = previous;

        if (next) {
          var onNext = function onNext() {
            var pages = _this7.pages,
                pageIndex = _this7.pageIndex;
            var index = pages[pageIndex + 1] || pages[pages.length - 1];
            _this7.index = index;
          };

          next.onclick = onNext;
          (_b = el.parentNode) === null || _b === void 0 ? void 0 : _b.appendChild(next);
        }

        this._next = next;

        this._updateButtons();
      }
    }, {
      key: "_updateButtons",
      value: function _updateButtons() {
        var _options = this._conf;

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
          var _a;

          if (!button) {
            return;
          }

          button.onclick = null;
          (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });
      }
    }, {
      key: "_addPagination",
      value: function _addPagination() {
        var _this8 = this;

        var _options = this._conf;

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
        var pagination = render(paginationTemplate, {
          pages: pages,
          controls: id,
          className: paginationClassName,
          label: paginationLabel,
          title: paginationTitle
        });

        if (!pagination) {
          return;
        }

        var buttons = Array.from(pagination.querySelectorAll('button')).map(function (button, index) {
          button.onclick = function () {
            return _this8.index = pages[index];
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
        var _options = this._conf;

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
        var _a;

        var _pagination = this._pagination,
            _paginationButtons = this._paginationButtons;

        (_paginationButtons || []).forEach(function (button) {
          var _a;

          button.onclick = null;
          (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(button);
        });

        this._paginationButtons = null;
        _pagination && ((_a = _pagination.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(_pagination));
        this._pagination = null;
      }
    }, {
      key: "_onScroll",
      value: function _onScroll(event) {
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_PAGE_INDEX);

        this._updateButtons();

        this._updatePagination();

        var index = this.index,
            onScroll = this._conf.onScroll;
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
        clearCache(this, CACHE_KEY_PAGES);
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_PAGE_INDEX);

        this._updateButtons();

        this._removePagination();

        this._addPagination();

        this._updateScrollbars();
      }
    }], [{
      key: "resetInstanceCount",
      value: function resetInstanceCount() {}
    }]);

    return Carousel;
  }();

  _exports.Carousel = Carousel;
});
