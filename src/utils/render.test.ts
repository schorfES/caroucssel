import { render } from './render';


describe('Renderer util', () => {

	it('should render template to element', () => {
		const template = () => '<p><strong>Rendered</strong><em>Template</em></p>';
		const el = render(template, {});
		expect(el?.tagName).toBe('P');
		expect(el?.children).toHaveLength(2);
		expect(el?.firstElementChild?.tagName.toLocaleLowerCase()).toBe('strong');
		expect(el?.firstElementChild?.textContent).toBe('Rendered');
		expect(el?.lastElementChild?.tagName.toLocaleLowerCase()).toBe('em');
		expect(el?.lastElementChild?.textContent).toBe('Template');
	});

	it('should render template with context', () => {
		type Context = { label: string }
		const template = ({ label }: Context) => `<button>${label}</button>`;
		const el = render(template, { label: 'Click me!' });
		expect(el?.tagName.toLocaleLowerCase()).toBe('button');
		expect(el?.textContent).toBe('Click me!');
	});

	it('should render template as svg', () => {
		type Context = { width: number; height: number }
		const template = ({ width, height }: Context) => `
			<svg>
				<rect x="0" y="0" width="${width}" height="${height}" />
			</svg>
		`;
		const el = render(template, { width: 42, height: 4711 });
		expect(el?.tagName.toLocaleLowerCase()).toBe('svg');
		expect(el?.firstElementChild?.tagName).toBe('rect');
		expect(el?.firstElementChild?.getAttribute('width')).toBe('42');
		expect(el?.firstElementChild?.getAttribute('height')).toBe('4711');
	});

	it('should not render if template is empty', () => {
		const template = () => '';
		const el = render(template, {});
		expect(el).toBeNull();
	});

});
