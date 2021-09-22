import { IFeature, IProxy } from '../../types';
export declare type Params = {
    controls: string;
    className: string;
    label: string;
    title: string;
};
export declare type Template = (params: Params) => string;
export declare type Configuration = {
    template: Template;
    className: string;
    nextClassName: string;
    nextLabel: string;
    nextTitle: string;
    previousClassName: string;
    previousLabel: string;
    previousTitle: string;
};
/**
 * The feature to enable button controls.
 */
export declare class Buttons implements IFeature {
    constructor(options?: Partial<Configuration>);
    get name(): string;
    init(proxy: IProxy): void;
    destroy(): void;
    update(): void;
    private _render;
    private _remove;
    private _onPrevious;
    private _onNext;
}
