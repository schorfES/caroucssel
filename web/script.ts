import { Carousel } from '../src/caroucssel';
import { Buttons } from '../src/plugins/buttons';
import { Pagination } from '../src/plugins/pagination';

var element = document.querySelector('.caroucssel');
var items = Array.from(document.querySelectorAll('.item'));

if (!element) {
	throw new Error('Missing element for carousel.');
}

new Carousel(element, {
	plugins: [
		new Buttons(),
		new Pagination(),
	],
	onScroll: function(event) {
		items.forEach(function(item, index) {
			item.classList[event.index.includes(index) ? 'add' : 'remove']('is-active');
		});
	}
});
