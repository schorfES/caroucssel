declare type Source = (...args: never[]) => unknown;
declare type Debounced<F extends Source> = (...args: Parameters<F>) => void;
export declare function debounce<F extends Source>(func: F, delay: number): Debounced<F>;
export {};
//# sourceMappingURL=debounce.d.ts.map