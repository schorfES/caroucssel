(function () {
	var element = document.querySelector('.caroucssel');
	var items = document.querySelectorAll('.item');

	new window.caroucssel.Carousel(element, {
		hasButtons: true,
		hasPagination: true,
		onScroll: function(event) {
			items.forEach(function(item, index) {
				item.classList[event.index.includes(index) ? 'add' : 'remove']('is-active');
			});
		}
	});
})();
