import { Carousel } from '../../src/carousel';
import { Buttons } from '../../src/features/buttons';
import { Mouse } from '../../src/features/mouse';
import { Pagination } from '../../src/features/pagination';

const elements = Array.from(document.querySelectorAll<HTMLDivElement>('.caroucssel'));

elements.forEach((element) => {
	const config = element.dataset?.config?.split(',').map((size) => size.trim()) || [];
	const orders = (element.dataset.order || '').split(',');
	const offsetsLeft = (element.dataset.offsetLeft || '').split(',');

	config.forEach((width, index) => {
		const item = document.createElement('div');
		item.className = 'item';
		item.textContent = 'Item ' + (index + 1);
		item.style.width = width;
		item.style.order = orders[index] || '';
		item.style.marginLeft = offsetsLeft[index] || '';
		element.appendChild(item);

		const label = document.createElement('small');
		label.className = 'item-label';
		label.textContent = '(index: ' + index + ', width: ' + width + ')';
		item.appendChild(label);
	});

	new Carousel(element, {
		features: [
			new Buttons(),
			new Pagination(),
			new Mouse({ indicator: true }),
		],
		onScroll: function(event) {
			// console.log('INDEX', event.index);
			// console.log('PAGES', event.target.pages);
		}
	});
});
