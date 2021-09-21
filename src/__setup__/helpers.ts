/* istanbul ignore file */

/**
 * Options of the HTML markup.
 */
export type FixtureOptions = {
	id: string | null;
};

/**
 * Create a fixture of a basic carousel HTML markup with a specific amount of
 * items inside.
 * @internal
 * @param amount the number of items inside this HTML markup
 * @param options options to control the markup
 * @param options.id is the id of the carousel container element
 * @returns the rendered HTML markup
 */
export function fixture(amount: number, options: Partial<FixtureOptions> = {}): string {
	const settings: FixtureOptions = { id: null, ...options };

	return `
		<div class="container">
			<div class="caroucssel"${settings.id ? ` id="${settings.id}"` : ''}>
				${[...Array(amount).keys()].map((index) => `
					<div class="item item-${index}">Item ${index}</div>
				`).join('')}
			</div>
		</div>
	`;
}

/**
 * Triggers a resize event.
 * @internal
 */
export function triggerResize(): void {
	const event = document.createEvent('UIEvents');
	event.initEvent('resize', true, false);
	window.dispatchEvent(event);
	jest.runAllTimers();
}

/**
 * A scroll position.
 */
export type ScrollPosition = {
	left: number;
	top: number;
};

/**
 * Scrolls to a given position and triggers a scroll event on a given element.
 * @internal
 * @param element the element to control.
 * @param position new position of element
 */
export function triggerScroll(element: Element, position: Partial<ScrollPosition>): void {
	element.mockedTop = position.top || 0;
	element.mockedLeft = position.left || 0;

	const event = document.createEvent('Event');
	event.initEvent('scroll');
	element.dispatchEvent(event);
	jest.runAllTimers();
}

/**
 * Triggers a click event on a given element
 * @internal
 * @param element the element to control
 */
export function triggerClick(element: Element): void {
	const event = document.createEvent('Event');
	event.initEvent('click');
	element.dispatchEvent(event);
	jest.runAllTimers();
}

/**
 * Wrapper to ensure the querySelector() returns an element.
 * @internal
 * @param selector the selector passed into querySelector
 * @param root the element root from where to query
 * @returns the found element
 * @throws if no matching element was found
 */
export function querySelector(selector: string, root: Element | Document = document): Element {
	const el = root.querySelector(selector);
	if (!el) {
		throw new Error('Selector not found');
	}

	return el;
}
