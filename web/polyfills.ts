(function run(): void {

	async function importSmoothScrollPolyfill(): Promise<void> {
		const module = await import('smoothscroll-polyfill');
		module.polyfill();
	}

	function supportsSmoothScroll(): boolean {
		if ('scrollTo' in window && typeof window.scrollTo === 'function') {
			try {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			} catch (error: unknown) {
				return false;
			}
		} else {
			return false;
		}

		return true;
	}

	if (!supportsSmoothScroll()) {
		void importSmoothScrollPolyfill();
	}
})();
