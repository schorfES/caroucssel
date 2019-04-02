function __getSiblings(el) {
	return [...el.parentNode.children];
}


HTMLElement.prototype.mockTop = null;
HTMLElement.prototype.mockLeft = null;
HTMLElement.prototype.mockWidth = 120;
HTMLElement.prototype.mockHeight = 50;

HTMLElement.prototype.scrollTo = function({top, left}) {
	this.mockTop = top;
	this.mockLeft = left;
};

HTMLElement.prototype.getBoundingClientRect = function() {
	const siblings = __getSiblings(this);
	const index = siblings.indexOf(this);
	const width = this.mockWidth;
	const height = this.mockHeight;
	const top = this.mockTop;
	const right = 0;
	const bottom = 0;
	let left = this.mockLeft;

	if (left === null) {
		left = index * width;
	}

	return {width, height, top, right, bottom, left};
};

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
	get: function() {
		return this.getBoundingClientRect().width;
	}
});

Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
	get: function() {
		return this.getBoundingClientRect().left;
	}
});
