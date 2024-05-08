import { Carousel } from '../src/carousel';
import { Buttons } from '../src/features/buttons';
import { Mouse } from '../src/features/mouse';
import { Pagination } from '../src/features/pagination';

var element = document.querySelector('.caroucssel');

if (!element) {
	throw new Error('Missing element for carousel.');
}

new Carousel(element, {
	features: [
		new Buttons(),
		new Mouse(),
		new Pagination(),
	],
});

