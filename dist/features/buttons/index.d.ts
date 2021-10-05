import { IFeature, IProxy } from '../../types';
declare const FEATURE_NAME = "buildin:buttons";
/**
 * The template function to render a HTML markup of a button.
 * @param context the template context containing the required data to render
 * @return the HTML markup
 */
export declare type Template = (context: Context) => string;
/**
 * The template rendering context.
 */
export declare type Context = {
    controls: string;
    className: string;
    label: string;
    title: string;
};
/**
 * The options for the buttons feature.
 */
export declare type Options = {
    /**
     * Render function for a single button.
     */
    template?: Template;
    /**
     * The shared class name for both buttons (next and previous).
     * @defaultValue `'button'`
     */
    className?: string;
    /**
     * The class name of the next button.
     * @defaultValue `'is-next'`
     */
    nextClassName?: string;
    /**
     * The text label of the next button.
     * @defaultValue `'Next'`
     */
    nextLabel?: string;
    /**
     * The title attribute value of the next button.
     * @defaultValue `'Go to next'`
     */
    nextTitle?: string;
    /**
     * The class name of the previous button.
     * @defaultValue `'is-previous'`
     */
    previousClassName?: string;
    /**
     * The text label of the previous button.
     * @defaultValue `'Previous'`
     */
    previousLabel?: string;
    /**
     * The title attribute value of the previous button.
     * @defaultValue `'Go to previous'`
     */
    previousTitle?: string;
};
/**
 * The feature to enable button controls (next and previous) for a carousel.
 */
export declare class Buttons implements IFeature {
    /**
     * Creates an instance of this feature.
     * @param options are the options to configure this instance
     */
    constructor(options?: Options);
    /**
     * Returns the name of this feature.
     */
    get name(): typeof FEATURE_NAME;
    /**
     * Initializes this feature. This function will be called by the carousel
     * instance and should not be called manually.
     * @internal
     * @param proxy the proxy instance between carousel and feature
     */
    init(proxy: IProxy): void;
    /**
     * Destroys this feature. This function will be called by the carousel instance
     * and should not be called manually.
     * @internal
     */
    destroy(): void;
    /**
     * This triggers the feature to update its inner state. This function will be
     * called by the carousel instance and should not be called manually. The
     * carousel passes a event object that includes the update reason. This can be
     * used to selectively/partially update sections of the feature.
     * @internal
     */
    update(): void;
    /**
     * Renders and update the button elements. Buttons will only be rendered once
     * and then loaded from cache. When calling this function twice or more, the
     * button states will be updated based on the scroll position.
     * @internal
     */
    private _render;
    /**
     * Removes all buttons from the dom and detaches all event handler.
     * @internal
     */
    private _remove;
    /**
     * Event handler to navigate backwards (to the left).
     * @internal
     */
    private _onPrev;
    /**
     * Event handler to navigate forwards (to the right).
     * @internal
     */
    private _onNext;
}
export {};
