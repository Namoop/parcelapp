import "../../types";
export class Sprite {
	src: any;
	x = 0;
	y = 0;
	direction = 0;
	zIndex: bigint = 0n;
	width = 100;
	height = 100;
	alpha = 100;
	id = Date.now();
	draggable = false;
	constructor(src: CanvasImageSource) {
		this.src = src;

		sprites[this.id] = this;
	}
	/** Move the position of the sprite
	 * @param {number} x Target position
	 * @param {number} y
	 */
	move(x: number, y: number): Sprite {
		this.x = x;
		this.y = y;
		return this;
	}
	/** Change the size (percentage) of the sprite
	 * @param {number} width
	 * @param {number} height | Optional - If left blank will set to same as height
	 */
	resize(width: number, height?: number): Sprite {
		if (typeof height == "undefined") this.height = this.width = width;
		else [this.width, this.height] = [width, height];
		return this;
	}

	/** Asynchronously glide to a location
	 * @param {number} x Target position
	 * @param {number} y
	 */
	async glide(x: number, y: number, speed: number) {
		while (Math.hypot(x - this.x, y - this.y) > 1) {
			this.x += (x - this.x) / (speed * 10);
			this.y += (y - this.y) / (speed * 10);
			await nextframe;
		}
		[this.x, this.y] = [x, y];
	}

	//touching() {} //colliding with
	//touchingAll() {} //colliding with type | sprite.touchingAll(Dot) -> [dot1, dot2]
	onclick() {} //
	onhover() {} //

	//pointTowards(obj: Sprite) {} //set direction towards param
}

interface buttonOptions {
	width?: number;
	height?: number;
	roundedx?: number;
	roundedy?: number;
	fill?: string;
	stroke?: string;
	strokewidth?: number;
	font?: string;
}

import btsvg from "images/button.svg";
export class Button extends Sprite {
	constructor(text: string, op: buttonOptions = {}) {
		const w = op.width ?? 70;
		const h = op.height ?? (op.width ?? 70) / 3.5;
		const sw = op.strokewidth ?? 2;
		const rect = document.createElementNS(svgURL, "rect");
		setatts(rect, {
			x: sw / 2,
			y: sw / 2,
			width: w,
			height: h,
			rx: op.roundedx ?? 15,
			ry: op.roundedy ?? 15,
			fill: op.fill ?? "gray",
			stroke: op.stroke ?? "black",
			"stroke-width": sw,
		});
		const txt = document.createElementNS(svgURL, "text");
		txt.innerHTML = text;
		setatts(txt, {
			fill: "white",
			x: w / 2,
			y: h / 2,
			"font-family": op.font ?? "Arial",
			"text-anchor": "middle",
			"dominant-baseline": "central",
		});

		//create svg wrapper for shape
		const svg = document.createElementNS(svgURL, "svg");
		setatts(svg, {
			xmlns: svgURL,
			width: w + sw,
			height: h + sw,
		});
		svg.appendChild(rect);
		svg.appendChild(txt);
		console.log(svg);
		const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const image = new Image();
		image.src = url;
		image.addEventListener("load", () => URL.revokeObjectURL(url), {
			once: true,
		});

		console.log(btsvg);
		image.src = btsvg;
		super(image);
		this.onhover = () => 0;
	}
}

const svgURL = "http://www.w3.org/2000/svg";
function setatts(el: any, vals: object) {
	for (let i of Object.keys(vals)) el.setAttribute(i, vals[i]);
}
