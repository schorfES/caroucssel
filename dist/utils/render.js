/**
 * Renders a template (function) to into an HTML element. The template needs to
 * return a valid HTML string (with a single root element). A context with
 * key/value pairs will be passed into the template to allow dynamic rendering.
 * @param template a function to render a template
 * @param context context data for the template
 * @returns the rendered htmml element
 */
export function render(template, context) {
    const el = document.createElement('div');
    el.innerHTML = template(context);
    const ref = el.firstElementChild;
    if (!ref) {
        return null;
    }
    return ref;
}
