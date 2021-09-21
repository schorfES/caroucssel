import { Plugin, PluginProxy, UpdateData } from '../../types';
export declare type Params = {
    controls: string;
    className: string;
    label: TextTemplate;
    title: TextTemplate;
    pages: number[][];
};
export declare type TextParams = {
    index: number;
    page: number[];
    pages: number[][];
};
export declare type Template = (params: Params) => string;
export declare type TextTemplate = (params: TextParams) => string;
export declare type Configuration = {
    template: Template;
    className: string;
    label: TextTemplate;
    title: TextTemplate;
};
/**
 * The plugin to enable pagination controls.
 */
export declare class Pagination implements Plugin {
    constructor(options?: Partial<Configuration>);
    get name(): string;
    init(proxy: PluginProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
    private _add;
    private _update;
    private _remove;
    private _onClick;
}
