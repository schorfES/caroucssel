import {Scrollbar} from './scrollbar';


function __triggerResize() {
	const event = document.createEvent('UIEvents');
	event.initUIEvent('resize', true, false, window, 0);
	window.dispatchEvent(event);
	jest.runAllTimers();
}


describe('Scrollbar util', () => {

	describe('Scrollbar instance', () => {

		let instance: Scrollbar | null = null;
		beforeEach(() => {
			jest.useFakeTimers();
			instance = new Scrollbar();
		});

		afterEach(() => {
			instance = null;
		});

		describe('dimensions', () => {
			it('should return when scrollbar is added to the inner viewport', () => {
				const original = document.createElement.bind(document);
				document.createElement = jest.fn<HTMLElement, [string, ElementCreationOptions | undefined]>(
					function (this: Document, ...args) {
						const callCount = (this.createElement as jest.Mock).mock.calls.length;
						const isInner = callCount === 1;
						const isOuter = callCount === 2;
						if (!isInner && !isOuter) {
							throw new Error('More elements used as expected for this test!');
						}

						const element = original.apply(document, args);
						const mockedClientHeight = jest.fn<number, []>((): number => isInner ? 75 : 50);
						const mockedOffsetHeight = jest.fn<number, []>((): number => isInner ? 75 : 50);

						Object.defineProperty(element, 'clientHeight', {
							get: mockedClientHeight
						});

						Object.defineProperty(element, 'offsetHeight', {
							get: mockedOffsetHeight
						});

						return element;
					}
				);

				expect(instance?.dimensions).toEqual({ height: 25 });
				document.createElement = original;
			});

			it('should return when scrollbar is added to the outer viewport', () => {
				const original = document.createElement.bind(document);
				document.createElement = jest.fn<HTMLElement, [string, ElementCreationOptions | undefined]>(
					function (this: Document, ...args) {
						const callCount = (this.createElement as jest.Mock).mock.calls.length;
						const isInner = callCount === 1;
						const isOuter = callCount === 2;
						if (!isInner && !isOuter) {
							throw new Error('More elements used as expected for this test!');
						}

						const element = original.apply(document, args);
						const mockedClientHeight = jest.fn<number, []>((): number => isInner ? 75 : 50);
						const mockedOffsetHeight = jest.fn<number, []>((): number => {
							const getterCallCount = mockedOffsetHeight.mock.calls.length;
							const isFirstCall = getterCallCount === 1;

							if (isInner) {
								return isFirstCall ? 75 : 25;
							}

							return 50;
						});

						Object.defineProperty(element, 'clientHeight', {
							get: mockedClientHeight
						});

						Object.defineProperty(element, 'offsetHeight', {
							get: mockedOffsetHeight
						});

						return element;
					}
				);

				expect(instance?.dimensions).toEqual({ height: 50 });
				document.createElement = original;
			});

			it('should cache results', () => {
				expect(instance?.dimensions).toBe(instance?.dimensions);
			});

			it('should flush cache results on resize', () => {
				const dimensions = instance?.dimensions;
				__triggerResize();
				expect(dimensions).not.toBe(instance?.dimensions);
			});
		});

	});

});
