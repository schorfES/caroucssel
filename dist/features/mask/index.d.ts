import { IFeature, IProxy, UpdateEvent } from '../../types';
declare const FEATURE_NAME = "buildin:mask";
/**
 * The options for the mask and scrollbar features.
 */
export declare type Options = {
    /**
     * Enables/disables the rendering of the mask to hide (enabled) or show
     * (disabled) the browsers scrollbars.
     * @defaultValue `true`
     */
    enabled?: boolean;
    /**
     * The class name of the mask element that will wrap the carousel element.
     * @defaultValue `'caroucssel-mask'`
     */
    className?: string;
    /**
     * The tag name of the mask element that will wrap the carousel element.
     * @defaultValue `'div'`
     */
    tagName?: string;
};
/**
 * The feature to enable/disabled mask and scrollbar support. This feature will
 * be added by default to each carousel. Use this feature to customize the
 * default behaviour.
 */
export declare class Mask implements IFeature {
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
     * Returns the rendered element that wraps the carousel. If not enabled, this
     * returns `null`.
     * @return the mask element, otherwise `null` if disabled.
     */
    get el(): Element | null;
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
     * @param event.reason is the update reason (why this was triggered)
     */
    update(event: UpdateEvent): void;
    /**
     * Renders the mask element, wraps the carousel element and crops the
     * height of the browsers scrollbar.
     * @internal
     */
    private _render;
    /**
     * Removes the mask element and unwraps the carousel element.
     * @internal
     */
    private _remove;
}
export {};
