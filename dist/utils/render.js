export function render(template, data) {
    const el = document.createElement('div');
    el.innerHTML = template(data);
    const ref = el.firstElementChild;
    if (!ref) {
        return null;
    }
    return ref;
}
//# sourceMappingURL=render.js.map