import { IFeature, IProxy, UpdateData } from '../../types';
/**
 * Feature to enable mouse controls
 * @hidden
 */
export declare class Mouse implements IFeature {
    get name(): string;
    init(proxy: IProxy): void;
    destroy(): void;
    update(data: UpdateData): void;
}
