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

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var NAMESPACE = '__cache__';

  var fromCache = function fromCache(instance, key, calculate) {
    instance[NAMESPACE] = instance[NAMESPACE] || {};

    if (key in instance[NAMESPACE]) {
      return instance[NAMESPACE][key];
    }

    var value = calculate();
    instance[NAMESPACE][key] = value;
    return value;
  };

  var clearCache = function clearCache(instance, key) {
    var cache = instance[NAMESPACE];

    if (!cache) {
      return;
    }

    delete cache[key];
  };

  var clearFullCache = function clearFullCache(instance) {
    return delete instance[NAMESPACE];
  };

  var Scrollbar = /*#__PURE__*/function () {
    function Scrollbar() {
      var _this = this;

      _classCallCheck(this, Scrollbar);

      window.addEventListener('resize', function () {
        clearCache(_this, 'dimensions');
      });
    } // Inspired by https://gist.github.com/kflorence/3086552


    _createClass(Scrollbar, [{
      key: "dimensions",
      get: function get() {
        return fromCache(this, 'dimensions', function () {
          var inner = document.createElement('div'),
              outer = document.createElement('div');
          var // width, w1, w2,
          height, h1, h2;
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
          h1 = inner.offsetHeight;
          outer.style.overflow = 'scroll';
          h2 = inner.offsetHeight;
          h2 = h1 === h2 ? outer.clientHeight : h2;
          height = h1 - h2;
          document.body.removeChild(outer);
          return {
            height: height
          };
        });
      }
    }]);

    return Scrollbar;
  }(); // See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf


  function debounce(func, delay) {
    var timeout;
    return function () {
      var _this2 = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        return func.apply(_this2, args);
      }, delay);
    };
  }

  function __render(template, data) {
    var el = document.createElement('div');
    el.innerHTML = template(data);
    var ref = el.firstChild;

    if (!(ref instanceof HTMLElement)) {
      return null;
    }

    return ref;
  }

  function __templateButton(_ref) {
    var className = _ref.className,
        controls = _ref.controls,
        label = _ref.label,
        title = _ref.title;
    return "<button type=\"button\" class=\"".concat(className, "\" aria-label=\"").concat(label, "\" title=\"").concat(title, "\" aria-controls=\"").concat(controls, "\">\n\t\t<span>").concat(label, "</span>\n\t</button>");
  }

  function __templatePagination(_ref2) {
    var className = _ref2.className,
        controls = _ref2.controls,
        pages = _ref2.pages,
        label = _ref2.label,
        title = _ref2.title;
    return "<ul class=\"".concat(className, "\">\n\t\t").concat(pages.map(function (page, index) {
      var data = {
        index: index,
        page: page,
        pages: pages
      };
      var labelStr = label(data);
      var titleStr = title(data);
      return "<li>\n\t\t\t\t<button type=\"button\" aria-controls=\"".concat(controls, "\" aria-label=\"").concat(titleStr, "\" title=\"").concat(titleStr, "\">\n\t\t\t\t\t<span>").concat(labelStr, "</span>\n\t\t\t\t</button>\n\t\t\t</li>");
    }).join(''), "\n\t</ul>");
  }

  var ID_NAME = function ID_NAME(count) {
    return "caroucssel-".concat(count);
  },
      ID_MATCH = /^caroucssel-[0-9]*$/,
      CACHE_KEY_INDEX = 'index',
      CACHE_KEY_ITEMS = 'items',
      CACHE_KEY_PAGES = 'pages',
      CACHE_KEY_PAGE_INDEX = 'page-index',
      VISIBILITY_OFFSET = 0.25,
      INVISIBLE_ELEMENTS = /^(link|meta|noscript|script|style|title)$/i,
      EVENT_SCROLL = 'scroll',
      EVENT_RESIZE = 'resize',
      DEFAULTS = {
    index: undefined,
    // Buttons:
    hasButtons: false,
    buttonClassName: 'button',
    buttonTemplate: __templateButton,
    buttonPrevious: null,
    buttonNext: null,
    // Pagination:
    hasPagination: false,
    paginationClassName: 'pagination',
    paginationLabel: function paginationLabel(_ref3) {
      var index = _ref3.index;
      return "".concat(index + 1);
    },
    paginationTitle: function paginationTitle(_ref4) {
      var index = _ref4.index;
      return "Go to ".concat(index + 1, ". page");
    },
    paginationTemplate: __templatePagination,
    // Scrollbars, set to true when use default scrolling behaviour
    hasScrollbars: false,
    scrollbarsMaskClassName: 'caroucssel-mask',
    // filter
    filterItem: function filterItem() {
      return true;
    },
    // Hooks:
    onScroll: null
  },
      DEFAULTS_BUTTON_PREVIOUS = {
    className: 'is-previous',
    label: 'Previous',
    title: 'Go to previous'
  },
      DEFAULTS_BUTTON_NEXT = {
    className: 'is-next',
    label: 'Next',
    title: 'Go to next'
  };

  var instanceCount = 0,
      scrollbar = null;

  var Carousel = /*#__PURE__*/function () {
    function Carousel(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Carousel);

      if (!el || !(el instanceof HTMLElement)) {
        throw new Error("Carousel needs a dom element but \"".concat(_typeof(el), "\" was passed."));
      }

      this._el = el; // Create a singleton instance of scrollbar for all carousel instances:

      scrollbar = scrollbar || new Scrollbar(); // Count all created instances to create unique id, if given dom element
      // has no id-attribute:

      instanceCount++;
      el.id = el.id || ID_NAME(instanceCount);
      this._id = el.id; // "deep" extend options and defaults:

      var opts = _objectSpread(_objectSpread({}, DEFAULTS), options);

      opts.buttonPrevious = _objectSpread(_objectSpread({}, DEFAULTS_BUTTON_PREVIOUS), options.buttonPrevious);
      opts.buttonNext = _objectSpread(_objectSpread({}, DEFAULTS_BUTTON_NEXT), options.buttonNext);
      this._options = opts; // Render:

      this._addButtons();

      this._addPagination();

      this._updateScrollbars(); // Set initial index and set smooth scrolling:


      this._isSmooth = false;
      this.index = options.index;
      this._isSmooth = true; // Events:

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
        var _this3 = this;

        return fromCache(this, CACHE_KEY_INDEX, function () {
          var el = _this3.el,
              items = _this3.items;
          var length = items.length;
          var clientWidth = el.clientWidth;
          var outerLeft = el.getBoundingClientRect().left;
          var values = [];
          var index = 0;

          for (; index < length; index++) {
            var item = items[index];

            var _item$getBoundingClie = item.getBoundingClientRect(),
                left = _item$getBoundingClie.left,
                width = _item$getBoundingClie.width;

            left = left - outerLeft;

            if (left + width * VISIBILITY_OFFSET >= 0 && left + width * (1 - VISIBILITY_OFFSET) <= clientWidth) {
              values.push(index);
            }
          }

          if (values.length === 0) {
            return [0];
          }

          return values;
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

        clearCache(this, CACHE_KEY_INDEX);
        var behavior = this._isSmooth ? 'smooth' : 'auto';
        el.scrollTo(_objectSpread(_objectSpread({}, to), {}, {
          behavior: behavior
        }));
      }
    }, {
      key: "items",
      get: function get() {
        var _this4 = this;

        return fromCache(this, CACHE_KEY_ITEMS, function () {
          var el = _this4.el,
              filterItem = _this4._options.filterItem;
          return Array.from(el.children).filter(function (item) {
            return !INVISIBLE_ELEMENTS.test(item.tagName) && !item.hidden;
          }).filter(filterItem);
        });
      }
    }, {
      key: "pages",
      get: function get() {
        var _this5 = this;

        return fromCache(this, CACHE_KEY_PAGES, function () {
          var el = _this5.el,
              items = _this5.items;
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
            var firstItem = prevPage[0] ? prevPage[0] : {
              left: 0
            };
            var start = firstItem.left; // This is required for the first page. The first page always
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
        var _this6 = this;

        return fromCache(this, CACHE_KEY_PAGE_INDEX, function () {
          var el = _this6.el,
              items = _this6.items,
              index = _this6.index,
              pages = _this6.pages;
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


        el.removeEventListener(EVENT_SCROLL, this._onScroll);
        window.removeEventListener(EVENT_RESIZE, this._onResize); // Clear cache:

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
        var _this7 = this;

        var el = this.el,
            _options = this._options;
        var hasScrollbars = _options.hasScrollbars,
            scrollbarsMaskClassName = _options.scrollbarsMaskClassName;

        if (hasScrollbars) {
          return;
        }

        var height = scrollbar.dimensions.height;

        if (el.scrollWidth <= el.clientWidth) {
          // If the contents are not scrollable because their width are less
          // than the container, there will be no visible scrollbar. In this
          // case, the scrollbar height is 0:
          height = 0;
        }

        this._mask = this._mask || function () {
          var mask = document.createElement('div');
          mask.className = scrollbarsMaskClassName;
          mask.style.overflow = 'hidden';
          mask.style.height = '100%';

          _this7.el.parentNode.insertBefore(mask, _this7.el);

          mask.appendChild(_this7.el);
          return mask;
        }();

        if (height === this._scrollbarHeight) {
          return;
        }

        this.el.style.height = "calc(100% + ".concat(height, "px)");
        this.el.style.marginBottom = "".concat(height * -1, "px");
        this._scrollbarHeight = height;
      }
    }, {
      key: "_removeScrollbars",
      value: function _removeScrollbars() {
        var _mask = this._mask,
            el = this.el;

        if (!this._mask) {
          return;
        }

        _mask.parentNode.insertBefore(el, _mask);

        _mask.parentNode.removeChild(_mask);

        el.removeAttribute('style');
      }
    }, {
      key: "_addButtons",
      value: function _addButtons() {
        var _this8 = this;

        var el = this.el,
            id = this.id,
            _options = this._options;

        if (!_options.hasButtons) {
          return;
        }

        var buttonTemplate = _options.buttonTemplate,
            buttonClassName = _options.buttonClassName,
            buttonPrevious = _options.buttonPrevious,
            buttonNext = _options.buttonNext; // Create previous buttons:

        var _map = [buttonPrevious, buttonNext].map(function (data) {
          return __render(buttonTemplate, _objectSpread(_objectSpread({}, data), {}, {
            controls: id,
            className: "".concat(buttonClassName, " ").concat(data.className)
          }));
        }),
            _map2 = _slicedToArray(_map, 2),
            previous = _map2[0],
            next = _map2[1];

        if (previous) {
          var onPrevious = function onPrevious() {
            var pages = _this8.pages,
                pageIndex = _this8.pageIndex;
            var page = pages[pageIndex - 1] || pages[0];
            _this8.index = page;
          };

          previous.onclick = onPrevious;
          el.parentNode.appendChild(previous);
        }

        this._previous = previous;

        if (next) {
          var onNext = function onNext() {
            var pages = _this8.pages,
                pageIndex = _this8.pageIndex;
            var page = pages[pageIndex + 1] || pages[pages.length - 1];
            _this8.index = page;
          };

          next.onclick = onNext;
          el.parentNode.appendChild(next);
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
          if (!button) {
            return;
          }

          button.onclick = null;
          button.parentNode.removeChild(button);
        });
      }
    }, {
      key: "_addPagination",
      value: function _addPagination() {
        var _this9 = this;

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

        var pagination = __render(paginationTemplate, {
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
            return _this9.index = pages[index];
          };

          return button;
        });
        var target = (_mask || el).parentNode;
        target.appendChild(pagination);
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
        var _pagination = this._pagination,
            _paginationButtons = this._paginationButtons;

        (_paginationButtons || []).forEach(function (button) {
          button.onclick = null;
          button.parentNode.removeChild(button);
        });

        this._paginationButtons = null;
        _pagination && _pagination.parentNode.removeChild(_pagination);
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
        clearCache(this, CACHE_KEY_PAGES);
        clearCache(this, CACHE_KEY_INDEX);
        clearCache(this, CACHE_KEY_PAGE_INDEX);

        this._updateButtons();

        this._removePagination();

        this._addPagination();

        this._updateScrollbars();
      }
    }]);

    return Carousel;
  }();

  _exports.Carousel = Carousel;
});