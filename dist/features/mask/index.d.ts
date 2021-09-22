import { IFeature, IProxy, UpdateData } from '../../types';
export declare type Configuration = {
    enabled: boolean;
    className: string;
    tagName: string;
};
/**
 * The feature to enable/disabled mask and scrollbar features. This feature will
 * be added by default to each carousel. Use this feature to customize the default behaviour.
 */
export declare class Mask implements IFeature {
    constructor(options?: Partial<Configuration>);
    get name(): string;
    get el(): Element | null;
    init(proxy: IProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
    private _render;
    private _remove;
}
