declare module 'replace' {
	type Options = {
		regex: string;
		replacement: string;
		paths: string[];
		recursive: boolean;
		silent: boolean;
	}

	const replace: (options: Options) => void;
	export = replace;
}
