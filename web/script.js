(function () {
	var element = document.querySelector('.caroucssel');
	var pagination = null;

	function update(index) {
		pagination.forEach(function(li, at) {
			li.classList[index === at ? 'add' : 'remove']('is-active');
		});
	}

	new window.caroucssel.Carousel(element, {
		hasButtons: true,
		hasPagination: true,
		onScroll: function(event) {
			update(event.index);
		}
	});

	pagination = document.querySelectorAll('.pagination li');
	update(0);
})();
