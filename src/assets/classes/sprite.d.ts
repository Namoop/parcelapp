declare let nextframe: any;
interface Sprite {
	src: HTMLImageElement;
	x: number;
	y: number;
	direction: number;
	zIndex: bigint;
	width: number;
	height: number;
	alpha: number;
	id: number;
	draggable: boolean;
	move: (x: number, y: number) => Sprite;
	resize: (width: number, height?: number) => Sprite;
	pointTowards: (target: Sprite) => Sprite;
	glide: (x: number, y: number, speed: number) => Promise<void>;

	onhover: () => void;
	onclick: () => void;
}
type SpriteObj = { [key: string]: Sprite };
declare let sprites: SpriteObj;
declare let globals: any[];

declare module "*.png" {
	const file: any;
	export default file;
}
declare module "*.svg" {
	const file: any;
	export default file;
}

