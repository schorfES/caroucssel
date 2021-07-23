import {clearCache, fromCache} from './cache';

export type ScrollbarDimensions = {
	height: number,
};

export class Scrollbar {

	constructor() {
		window.addEventListener('resize', () => {
			clearCache(this, 'dimensions');
		});
	}

	// Inspired by https://gist.github.com/kflorence/3086552
	get dimensions(): ScrollbarDimensions {
		return fromCache<ScrollbarDimensions>(this, 'dimensions', () => {
			const
				inner = document.createElement('div'),
				outer = document.createElement('div')
			;
			let
				// width, w1, w2,
				height, h1, h2
			;

			document.body.appendChild(outer);
			outer.style.position = 'absolute';
			outer.style.top = '0px';
			outer.style.left = '0px';
			outer.style.visibility = 'hidden';
			outer.appendChild(inner);

			// Disabled, not needed for current feature set.
			//
			// Calculate width:
			// inner.style.width = '100%';
			// inner.style.height = '200px';
			// outer.style.width = '200px';
			// outer.style.height = '150px';
			// outer.style.overflow = 'hidden';
			// w1 = inner.offsetWidth;
			// outer.style.overflow = 'scroll';
			// w2 = inner.offsetWidth;
			// w2 = (w1 === w2) ? outer.clientWidth : w2;
			// width = w1 - w2;

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

			return {
				// width,
				height
			};
		});
	}

}
