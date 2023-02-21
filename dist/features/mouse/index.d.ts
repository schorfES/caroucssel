import { IFeature, IProxy } from '../../types';
declare const FEATURE_NAME = "buildin:mouse";
/**
 * The options for the pagination feature.
 */
export type Options = {
    /**
     * Show a drag indicator using css cursor properties (grab and grabbing).
     */
    indicator?: boolean;
    /**
     * A hook function that is called when the user stats to drag.
     */
    onStart?: ((event: HookEvent) => void);
    /**
     * A hook function that is called when the user is dragging.
     */
    onDrag?: ((event: HookEvent) => void);
    /**
     * A hook function that is called when the user stops to drag.
     */
    onEnd?: ((event: HookEvent) => void);
};
/**
 * The event object that is passed for each hook.
 */
export type HookEvent = {
    originalEvent: Event;
};
/**
 * Feature to enable mouse controls
 */
export declare class Mouse implements IFeature {
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
     * Handles the drag start event.
     * @internal
     * @param event the event that triggered the drag start
     */
    private _onStart;
    /**
     * Handles the drag event. Calculates and updates scroll position.
     * @internal
     * @param event the event that triggered the dragging
     */
    private _onDrag;
    /**
     * Handles the drag end event.
     * @internal
     * @param event the event that triggered the drag end
     */
    private _onEnd;
}
export {};
