import { writeCache } from '../../utils/cache';
/**
 * Plugin to enable mouse controls
 * @hidden
 */
export class Mouse {
    get name() {
        return 'buildin:mouse';
    }
    init(proxy) {
        writeCache(this, 'proxy', proxy);
    }
    destroy() {
        console.log('Destroy mouse');
    }
    update(data) {
        console.log('Update mouse:', data.reason);
    }
}
