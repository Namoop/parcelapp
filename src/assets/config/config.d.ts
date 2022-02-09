declare module "*/system.toml" {
	const file: {
		runOptions: {
			gamespeed: number;
			scale: number;
			stop: boolean;
		};
	};
	export default file;
}

declare module "*/maps.toml" {
	const file: {};
	export default file;
}
