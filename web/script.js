(function () {
	var element = document.querySelector('.caroucssel');

	new window.caroucssel.Carousel(element, {
		hasButtons: true,
		hasPagination: true
	});
})();
