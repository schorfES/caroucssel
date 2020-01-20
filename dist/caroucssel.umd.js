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

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Scrollbar =
  /*#__PURE__*/
  function () {
    function Scrollbar() {
      var _this = this;

      _classCallCheck(this, Scrollbar);

      this._d = null;
      window.addEventListener('resize', function () {
        return _this._d = null;
      });
    }

    _createClass(Scrollbar, [{
      key: "dimensions",
      get: function get() {
        this._d = this._d || function () {
          var inner = document.createElement('div'),
              outer = document.createElement('div');
          var width, w1, w2, height, h1, h2;
          document.body.appendChild(outer);
          outer.style.position = 'absolute';
          outer.style.top = '0px';
          outer.style.left = '0px';
          outer.style.visibility = 'hidden';
          outer.appendChild(inner); // Calculate width:

          inner.style.width = '100%';
          inner.style.height = '200px';
          outer.style.width = '200px';
          outer.style.height = '150px';
          outer.style.overflow = 'hidden';
          w1 = inner.offsetWidth;
          outer.style.overflow = 'scroll';
          w2 = inner.offsetWidth;
          w2 = w1 === w2 ? outer.clientWidth : w2;
          width = w1 - w2; // Calculate height:

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
            width: width,
            height: height
          };
        }();

        return this._d;
      }
    }]);

    return Scrollbar;
  }(); // See: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf


  function debounce(func, delay) {
    var inDebounce;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = this;
      window.clearTimeout(inDebounce);
      inDebounce = setTimeout(function () {
        return func.apply(self, args);
      }, delay);
    };
  }

  function __render(template, data) {
    var el = document.createElement('div');
    el.innerHTML = template(data);
    return el.firstChild;
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
        items = _ref2.items,
        label = _ref2.label,
        title = _ref2.title;
    return "<ul class=\"".concat(className, "\">\n\t\t").concat(items.map(function (item, index) {
      var data = {
        index: index,
        item: item,
        items: items
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
      CLASS_VISIBLE_SCROLLBAR = 'has-visible-scrollbar',
      CLASS_INVISIBLE_SCROLLBAR = 'has-invisible-scrollbar',
      EVENT_SCROLL = 'scroll',
      EVENT_RESIZE = 'resize',
      DEFAULTS = {
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
      return "Go to ".concat(index + 1, ". item");
    },
    paginationTemplate: __templatePagination,
    // Scrollbars, set to true when use default scrolling behaviour
    hasScrollbars: false,
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

  var Carousel =
  /*#__PURE__*/
  function () {
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

      this._options = _objectSpread({}, DEFAULTS, {}, options);
      this._options.buttonPrevious = _objectSpread({}, DEFAULTS_BUTTON_PREVIOUS, {}, options.buttonPrevious);
      this._options.buttonNext = _objectSpread({}, DEFAULTS_BUTTON_NEXT, {}, options.buttonNext);
      this._items = _toConsumableArray(this.el.children); // Render:

      this._addButtons();

      this._addPagination();

      this._updateScrollbars(); // Set index:


      this._isSmooth = false;
      this.index = this._options.index || [0];
      this._isSmooth = true; // Events:

      this._onScroll = debounce(this._onScroll.bind(this), 25);
      this._onResize = debounce(this._onResize.bind(this), 25);
      el.addEventListener(EVENT_SCROLL, this._onScroll);
      window.addEventListener(EVENT_RESIZE, this._onResize);
    }

    _createClass(Carousel, [{
      key: "destroy",
      value: function destroy() {
        var el = this.el;
        var classList = el.classList; // Remove created id if it was created by carousel:

        ID_MATCH.test(el.id) && el.removeAttribute('id'); // Remove scrollbar classes:

        classList.remove(CLASS_VISIBLE_SCROLLBAR);
        classList.remove(CLASS_INVISIBLE_SCROLLBAR); // Remove buttons:

        this._removeButtons(); // Remove pagination:


        this._removePagination(); // Remove events:


        el.removeEventListener(EVENT_SCROLL, this._onScroll);
        window.removeEventListener(EVENT_RESIZE, this._onResize);
      }
    }, {
      key: "update",
      value: function update() {
        var index = this.index;
        this._items = _toConsumableArray(this.el.children);

        this._updateButtons(index);

        this._updatePagination(index);

        this._updateScrollbars();
      }
    }, {
      key: "_updateScrollbars",
      value: function _updateScrollbars() {
        var hasScrollbars = this._options.hasScrollbars;

        if (hasScrollbars) {
          return;
        }

        var height = scrollbar.dimensions.height;
        var hasInvisbleScrollbar = height === 0;

        if (hasInvisbleScrollbar === this._hasInvisbleScrollbar) {
          return;
        }

        var classList = this.el.classList;
        classList.add(hasInvisbleScrollbar ? CLASS_INVISIBLE_SCROLLBAR : CLASS_VISIBLE_SCROLLBAR);
        classList.remove(hasInvisbleScrollbar ? CLASS_VISIBLE_SCROLLBAR : CLASS_INVISIBLE_SCROLLBAR);
        this._hasInvisbleScrollbar = hasInvisbleScrollbar;
      }
    }, {
      key: "_addButtons",
      value: function _addButtons() {
        var _this2 = this;

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
          return __render(buttonTemplate, _objectSpread({}, data, {
            controls: id,
            className: "".concat(buttonClassName, " ").concat(data.className)
          }));
        }),
            _map2 = _slicedToArray(_map, 2),
            previous = _map2[0],
            next = _map2[1];

        previous.onclick = function () {
          return _this2.index = [_this2.index[0] - 1];
        };

        el.parentNode.appendChild(previous);
        this._previous = previous;

        next.onclick = function () {
          return _this2.index = [_this2.index[0] + 1];
        };

        el.parentNode.appendChild(next);
        this._next = next;

        this._updateButtons();
      }
    }, {
      key: "_updateButtons",
      value: function _updateButtons() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.index;
        var _options = this._options;

        if (!_options.hasButtons) {
          return;
        }

        var items = this.items,
            _previous = this._previous,
            _next = this._next;
        _previous.disabled = index[0] === 0;
        _next.disabled = index[index.length - 1] === items.length - 1;
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
        var _this3 = this;

        var el = this.el,
            id = this.id,
            items = this.items,
            _options = this._options;

        if (!_options.hasPagination) {
          return;
        }

        var paginationTemplate = _options.paginationTemplate,
            paginationClassName = _options.paginationClassName,
            paginationLabel = _options.paginationLabel,
            paginationTitle = _options.paginationTitle;

        var pagination = __render(paginationTemplate, {
          items: items,
          controls: id,
          className: paginationClassName,
          label: paginationLabel,
          title: paginationTitle
        }); // @TODO: Add template for buttons:


        var buttons = _toConsumableArray(pagination.querySelectorAll('button')).map(function (button, index) {
          button.onclick = function () {
            return _this3.index = [index];
          };

          return button;
        });

        el.parentNode.appendChild(pagination);
        this._pagination = pagination;
        this._paginationButtons = buttons;

        this._updatePagination();
      }
    }, {
      key: "_updatePagination",
      value: function _updatePagination() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.index;
        var _options = this._options;

        if (!_options.hasPagination) {
          return;
        }

        var _paginationButtons = this._paginationButtons;

        _paginationButtons.forEach(function (button, at) {
          return button.disabled = index.includes(at);
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

        _pagination && _pagination.parentNode.removeChild(_pagination);
      }
    }, {
      key: "_onScroll",
      value: function _onScroll(event) {
        var index = this.index,
            _options = this._options;

        this._updateButtons(index);

        this._updatePagination(index);

        var onScroll = _options.onScroll;
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
        var index = this.index;

        this._updateButtons(index);

        this._updatePagination(index);

        this._updateScrollbars();
      }
    }, {
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
        var el = this.el,
            items = this.items;
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

          left = left - outerLeft; // @TODO: This may not work properly when the item is larger than
          // the clientWidth

          if (left + width / 2 >= 0 && left < clientWidth - width / 2) {
            values.push(index);
          } // else if (values.length > 0) {
          // 	If we already pushed an item trough this loop, we can break this
          // 	loop, because all other items will be out of visibility.
          //
          // 	NOTE: Do not implement this, because if a flexbox ordering is
          // 	attached to one of the items, this rule won't apply!
          //
          // 	break;
          // }

        }

        if (values.length === 0) {
          return [0];
        }

        return values;
      },
      set: function set(values) {
        var el = this.el,
            items = this.items;
        var length = items.length;

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

        if (from.left === to.left) {
          return;
        }

        var behavior = this._isSmooth ? 'smooth' : 'auto';
        el.scrollTo(_objectSpread({}, to, {
          behavior: behavior
        }));
      }
    }, {
      key: "items",
      get: function get() {
        return this._items;
      }
    }]);

    return Carousel;
  }();
  /**
   * This can be used for testing purposes to reset the instance count which is
   * used to create unique id's.
   */


  _exports.Carousel = Carousel;

  Carousel.resetInstanceCount = function () {
    return instanceCount = 0;
  };
});