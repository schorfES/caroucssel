import { Carousel } from '../src/caroucssel';
import { Buttons } from '../src/plugins/buttons';

var element = document.querySelector('.caroucssel');
var items = Array.from(document.querySelectorAll('.item'));

if (!element) {
	throw new Error('Missing element for carousel.');
}

new Carousel(element, {
	hasPagination: true,
	plugins: [
		new Buttons(),
	],
	onScroll: function(event) {
		items.forEach(function(item, index) {
			item.classList[event.index.includes(index) ? 'add' : 'remove']('is-active');
		});
	}
});
