import { Plugin, PluginProxy, UpdateData } from '../../types';
import { writeCache } from '../../utils/cache';

/**
 * Plugin to enable mouse controls
 * @hidden
 */
export class Mouse implements Plugin {

	get name(): string {
		return 'buildin:mouse';
	}

	public init(proxy: PluginProxy): void {
		writeCache(this, 'proxy', proxy);
	}

	public destroy(): void {
		console.log('Destroy mouse');
	}

	public update(data: UpdateData): void {
		console.log('Update mouse:', data.reason);
	}

}
