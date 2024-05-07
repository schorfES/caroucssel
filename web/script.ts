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

// Load polyfill for scroll-timeline that is not supported by polyfill.io (yet)
if (!window.CSS?.supports?.('animation-timeline: scroll()')) {
	const script = document.createElement('script');
	script.src = 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js';
	document.body.appendChild(script);
}
