import { IFeature, IProxy, UpdateEvent } from '../../types';
declare const FEATURE_NAME = "buildin:pagination";
/**
 * The template function to render a HTML markup of a pagination.
 * @param context the template context containing the required data to render
 * @return the HTML markup
 */
export declare type Template = (params: Context) => string;
/**
 * The template rendering context.
 */
export declare type Context = {
    controls: string;
    className: string;
    label: TextTemplate;
    title: TextTemplate;
    pages: number[][];
};
/**
 * A text template function to render a text node. This will be used for button
 * labels and text-attributes inside the pagination
 */
export declare type TextTemplate = (params: TextContext) => string;
/**
 * The text template rendering context.
 */
export declare type TextContext = {
    index: number;
    page: number[];
    pages: number[][];
};
/**
 * The options for the pagination feature.
 */
export declare type Options = {
    /**
     * Render function for the pagination elemements.
     */
    template?: Template;
    /**
     * The class name the pagination element.
     * @defaultValue `'pagination'`
     */
    className?: string;
    /**
     * Render function for each button label inside the pagination.
     */
    label?: TextTemplate;
    /**
     * Render function for each button title attribute inside the pagination.
     */
    title?: TextTemplate;
};
/**
 * The feature to enable pagination controls.
 */
export declare class Pagination implements IFeature {
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
     * @param event event that triggered the update
     * @param event.type is the update reason (why this was triggered)
     */
    update(event: UpdateEvent): void;
    /**
     * Renders and adds the pagination element. Attaches event handlers to all
     * button elements.
     * @internal
     */
    private _add;
    /**
     * Updates the states of all buttons inside the pagination.
     * @internal
     */
    private _update;
    /**
     * Removes the whole pagination element and removes all attached event handlers.
     * @internal
     */
    private _remove;
    /**
     * Event handler when a button is clicked. Detects the current index of the
     * clicked button inside the pagination and updates the index accordingly of
     * the carousel.
     * @internal
     * @param event the mouse event
     */
    private _onClick;
}
export {};
