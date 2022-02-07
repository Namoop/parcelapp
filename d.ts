declare let nextframe: any;
interface Sprite {
	x: number;
	y: number;
	alpha: number;
	direction: number;
	width: number;
	height: number;
	src: HTMLImageElement;
	//move: (x: number, y: number) => void;
}
type SpriteObj = { [key: string]: Sprite };
declare let sprites: SpriteObj;

declare module "*.png" {
	const Content: any;
	export default Content;
}

declare module "*.toml" {
	const Content: any;
	export default Content;
}
