/**
 * Possible types of an update.
 */
export var UpdateType;
(function (UpdateType) {
    UpdateType["SCROLL"] = "scroll";
    UpdateType["RESIZE"] = "resize";
    UpdateType["FORCED"] = "forced";
    UpdateType["FEATURE"] = "feature";
})(UpdateType || (UpdateType = {}));
/**
 * The browsers scroll behavior.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo | scrollTo on MDN}
 */
export var ScrollBehavior;
(function (ScrollBehavior) {
    ScrollBehavior["AUTO"] = "auto";
    ScrollBehavior["SMOOTH"] = "smooth";
})(ScrollBehavior || (ScrollBehavior = {}));
