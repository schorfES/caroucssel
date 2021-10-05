import './element.d';


Object.defineProperties(Element.prototype, {
	mockedTop: {
		writable: true,
		value: undefined,
	},

	mockedLeft: {
		writable: true,
		value: undefined,
	},

	mockedClientWidth: {
		writable: true,
		value: 120,
	},

	mockedOffsetWidth: {
		writable: true,
		value: 120,
	},

	mockedClientHeight: {
		writable: true,
		value: 50,
	},

	mockedOffsetHeight: {
		writable: true,
		value: 50,
	},

	scrollTo: {
		writable: true,
		value: function(this: Element, { top, left }: { top: number, left: number }): void {
			this.mockedTop = top;
			this.mockedLeft = left;

			const event = document.createEvent('Event');
			event.initEvent('scroll');
			this.dispatchEvent(event);
			jest.runAllTimers();
		},
	},

	scrollTop: {
		get: function(this: Element) {
			return this.mockedTop;
		},
	},

	scrollLeft: {
		get: function(this: Element) {
			return this.mockedLeft;
		},
		set: function(this: Element, value: number) {
			this.mockedLeft = value;
		},
	},

	clientWidth: {
		get: function(this: Element) {
			return this.mockedClientWidth;
		},
	},

	clientHeight: {
		get: function(this: Element) {
			return this.mockedClientHeight;
		},
	},

	getBoundingClientRect: {
		writable: true,
		value: function(this: Element) {
			const siblings = [...this.parentNode?.children || []];
			const index = siblings.indexOf(this);

			return {
				x: 0,
				y: 0,
				width: this.mockedClientWidth,
				height: this.mockedClientHeight,
				top: this.mockedTop,
				right: 0,
				bottom: 0,
				left: this.mockedLeft ?? index * this.mockedClientWidth,
			};
		},
	},
});

Object.defineProperties(HTMLElement.prototype, {
	offsetWidth: {
		get: function(this: HTMLElement) {
			return this.mockedOffsetWidth;
		},
	},

	offsetHeight: {
		get: function(this: HTMLElement) {
			return this.mockedOffsetHeight;
		},
	},

	offsetTop: {
		get: function(this: HTMLElement) {
			return this.getBoundingClientRect().top;
		},
	},

	offsetLeft: {
		get: function(this: HTMLElement) {
			return this.getBoundingClientRect().left;
		},
	},
});
