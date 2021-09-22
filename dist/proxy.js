import { UpdateReason } from "./types";
import { fromCache, writeCache } from './utils/cache';
const CACHE_KEY_INSTANCE = 'instance';
const CACHE_KEY_FEATURES = 'features';
function __getInstance(ref) {
    return fromCache(ref, CACHE_KEY_INSTANCE);
}
function __getFeatures(ref) {
    return fromCache(ref, CACHE_KEY_FEATURES);
}
/**
 * A proxy instance between carousel and each feature.
 * @internal
 */
export class Proxy {
    constructor(instance, features) {
        writeCache(this, CACHE_KEY_INSTANCE, instance);
        writeCache(this, CACHE_KEY_FEATURES, features);
    }
    get id() {
        return __getInstance(this).id;
    }
    get el() {
        return __getInstance(this).el;
    }
    get mask() {
        return __getInstance(this).mask;
    }
    get index() {
        return __getInstance(this).index;
    }
    set index(value) {
        __getInstance(this).index = value;
    }
    get items() {
        return __getInstance(this).items;
    }
    get pages() {
        return __getInstance(this).pages;
    }
    get pageIndex() {
        return __getInstance(this).pageIndex;
    }
    update(sender) {
        __getInstance(this).update();
        // Trigger update in all other features except the source feature that
        // triggered the event:
        __getFeatures(this).forEach((feature) => {
            if (feature === sender) {
                return;
            }
            feature.update({ reason: UpdateReason.FEATURE });
        });
    }
}
