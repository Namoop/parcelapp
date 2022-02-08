export class Sprite {
	src: any;
	x = 0;
	y = 0;
	direction = 0;
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
	async glide(x: number, y: number, speed) {
		while (Math.hypot(x - this.x, y - this.y) > 1) {
			this.x += (x - this.x) / (speed * 10);
			this.y += (y - this.y) / (speed * 10);
			await nextframe;
		}
		[this.x, this.y] = [x, y];
	}

	touching() {} //colliding with
	touchingAll() {} //colliding with type | sprite.touchingAll(Dot) -> [dot1, dot2]
	onclick() {} //
	onhover() {} //

	pointTowards(obj: Sprite) {} //set direction towards param
}

interface buttonOptions {
	width?: number;
	height?: number;
	roundedx?: number;
	roundedy?: number;
}

export class Button extends Sprite {
	constructor(op: buttonOptions = {}) {
		const w = op.width ?? 70;
		const h = op.height ?? (op.width ?? 70) / 3.5;
		const rect = document.createElementNS(svgURL, "rect");
		setatts(rect, {
			x: w / 14,
			y: h / 4,
			width: w,
			height: h,
			rx: op.roundedx ?? 10,
			ry: op.roundedy ?? 10,
			fill: "none",
			stroke: "blue",
			"stroke-width": "2",
		});

		//create svg wrapper for shape
		const svg = document.createElementNS(svgURL, "svg");
		setatts(svg, {
			xmlns: svgURL,
			width: w * (1 + 1 / 7),
			height: h * (1 + 1 / 4),
		});
		svg.appendChild(rect);
		const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const image = new Image();
		image.src = url;
		image.addEventListener("load", () => URL.revokeObjectURL(url), {
			once: true,
		});

		super(image);
		this.resize(100);
	}
}

const svgURL = "http://www.w3.org/2000/svg";
function setatts(el: any, vals: object) {
	for (let i of Object.keys(vals)) el.setAttribute(i, vals[i]);
}
