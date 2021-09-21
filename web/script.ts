import { Carousel } from '../src/carousel';
import { Buttons } from '../src/features/buttons';
import { Pagination } from '../src/features/pagination';

var element = document.querySelector('.caroucssel');
var items = Array.from(document.querySelectorAll('.item'));

if (!element) {
	throw new Error('Missing element for carousel.');
}

new Carousel(element, {
	features: [
		new Buttons(),
		new Pagination(),
	],
	onScroll: function(event) {
		items.forEach(function(item, index) {
			item.classList[event.index.includes(index) ? 'add' : 'remove']('is-active');
		});
	}
});
