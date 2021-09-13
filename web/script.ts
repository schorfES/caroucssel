import { Carousel } from '../src/caroucssel';

var element = document.querySelector('.caroucssel');
var items = Array.from(document.querySelectorAll('.item'));

if (!element) {
	throw new Error('Missing element for carousel.');
}

new Carousel(element, {
	hasButtons: true,
	hasPagination: true,
	onScroll: function(event) {
		items.forEach(function(item, index) {
			item.classList[event.index.includes(index) ? 'add' : 'remove']('is-active');
		});
	}
});
