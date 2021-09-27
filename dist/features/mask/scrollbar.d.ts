/**
 * Dataset of scrollbar dimensions
 * @internal.
 */
export declare type ScrollbarDimensions = {
    /**
     * Vertical size of a scrollbar.
     */
    height: number;
};
/**
 * Helper class for scrollbar features.
 * @internal
 */
export declare class Scrollbar {
    /**
     * Creates an instance.
     * @internal
     */
    constructor();
    /**
     * Calculates the dimensions of a scrollbar in the current browser. The result
     * of the computation will be cached for this instance.
     *
     * Inspired by https://gist.github.com/kflorence/3086552
     *
     * @return the dimensions of the scrollar
     */
    get dimensions(): ScrollbarDimensions;
}
