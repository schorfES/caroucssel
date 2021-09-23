import { IFeature, IProxy, UpdateEvent } from '../../types';
import { writeCache } from '../../utils/cache';

/**
 * Feature to enable mouse controls
 * @hidden
 */
export class Mouse implements IFeature {

	get name(): string {
		return 'buildin:mouse';
	}

	public init(proxy: IProxy): void {
		writeCache(this, 'proxy', proxy);
	}

	public destroy(): void {
		console.log('Destroy mouse');
	}

	public update(event: UpdateEvent): void {
		console.log('Update mouse:', event.type);
	}

}
