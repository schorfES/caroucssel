export declare type ScrollbarDimensions = {
    height: number;
};
/**
 * Helper class for scrollbar features.
 */
export declare class Scrollbar {
    /**
     * Creates an instance.
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
