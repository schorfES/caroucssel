export class Scrollbar {

	constructor() {
		this._d = null;
		window.addEventListener('resize', () => this._d = null);
	}

	get dimensions() {
		this._d = this._d || (() => {
			const
				inner = document.createElement('div'),
				outer = document.createElement('div')
			;
			let
				width, w1, w2,
				height, h1, h2
			;

			document.body.appendChild(outer);
			outer.style.position = 'absolute';
			outer.style.top = '0px';
			outer.style.left = '0px';
			outer.style.visibility = 'hidden';
			outer.appendChild(inner);

			// Calculate width:
			inner.style.width = '100%';
			inner.style.height = '200px';
			outer.style.width = '200px';
			outer.style.height = '150px';
			outer.style.overflow = 'hidden';
			w1 = inner.offsetWidth;
			outer.style.overflow = 'scroll';
			w2 = inner.offsetWidth;
			w2 = (w1 === w2) ? outer.clientWidth : w2;
			width = w1 - w2;

			// Calculate height:
			inner.style.width = '200px';
			inner.style.height = '100%';
			outer.style.width = '150px';
			outer.style.height = '200px';
			outer.style.overflow = 'hidden';
			h1 = inner.offsetHeight;
			outer.style.overflow = 'scroll';
			h2 = inner.offsetHeight;
			h2 = (h1 === h2) ? outer.clientHeight : h2;
			height = h1 - h2;

			document.body.removeChild(outer);
			return {width, height};
		})();

		return this._d;
	}

}
