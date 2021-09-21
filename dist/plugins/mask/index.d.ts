import { Plugin, PluginProxy, UpdateData } from '../../types';
export declare type Configuration = {
    enabled: boolean;
};
/**
 * The plugin to enable/disabled mask and scrollbar features. This plugin will
 * be added by default to each carousel. Use this plugin to customize the default behaviour.
 */
export declare class Mask implements Plugin {
    constructor(options?: Partial<Configuration>);
    get name(): string;
    get el(): Element | null;
    init(proxy: PluginProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
    private _render;
    private _remove;
}
