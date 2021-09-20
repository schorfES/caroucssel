import { Carousel } from '../../src/caroucssel';
import { Buttons } from '../../src/plugins/buttons';

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
		hasPagination: true,
		plugins: [
			new Buttons(),
		],
		onScroll: function(event) {
			// console.log('INDEX', event.index);
			// console.log('PAGES', event.target.pages);
		}
	});
});
