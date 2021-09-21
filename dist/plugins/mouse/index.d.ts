import { Plugin, PluginProxy, UpdateData } from '../../types';
/**
 * Plugin to enable mouse controls
 * @hidden
 */
export declare class Mouse implements Plugin {
    get name(): string;
    init(proxy: PluginProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
}
