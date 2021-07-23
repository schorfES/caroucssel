export {};

declare global {
	interface Element {
		mockedTop?: number;
		mockedLeft?: number;
		mockedClientWidth: number;
		mockedOffsetWidth: number;
		mockedClientHeight: number;
		mockedOffsetHeight: number;
	}
}
