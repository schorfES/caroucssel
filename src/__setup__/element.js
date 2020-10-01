function __getSiblings(el) {
	return [...el.parentNode.children];
}


HTMLElement.prototype.mockTop = null;
HTMLElement.prototype.mockLeft = null;
HTMLElement.prototype.mockClientWidth = 120;
HTMLElement.prototype.mockOffsetWidth = 120;
HTMLElement.prototype.mockClientHeight = 50;
HTMLElement.prototype.mockOffsetHeight = 50;

HTMLElement.prototype.scrollTo = function({top, left}) {
	this.mockTop = top;
	this.mockLeft = left;

	const event = document.createEvent('Event');
	event.initEvent('scroll');
	this.dispatchEvent(event);
	jest.runAllTimers();
};

HTMLElement.prototype.getBoundingClientRect = function() {
	const siblings = __getSiblings(this);
	const index = siblings.indexOf(this);
	const width = this.mockClientWidth;
	const height = this.mockClientHeight;
	const top = this.mockTop;
	const right = 0;
	const bottom = 0;
	let left = this.mockLeft;

	if (left === null) {
		left = index * width;
	}

	return {width, height, top, right, bottom, left};
};

Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
	get: function() {
		return this.mockTop;
	}
});

Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
	get: function() {
		return this.mockLeft;
	}
});

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
	get: function() {
		return this.mockClientWidth;
	}
});

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
	get: function() {
		return this.mockOffsetWidth;
	}
});

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
	get: function() {
		return this.mockClientHeight;
	}
});

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
	get: function() {
		return this.mockOffsetHeight;
	}
});

Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
	get: function() {
		return this.getBoundingClientRect().top;
	}
});

Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
	get: function() {
		return this.getBoundingClientRect().left;
	}
});
