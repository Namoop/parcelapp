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

export class Button extends Sprite {
	constructor() {
		let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		let circ = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle"
		);
		setatts(circ, {
			cx: 25,
			cy: 35,
			r: 20,
		});
		setatts(svg, {
			xmlns: "http://www.w3.org/2000/svg",
			width: 50,
			height: 50,
		});
		svg.appendChild(circ);

		const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const image = new Image();
		image.src = url;
		image.addEventListener("load", () => URL.revokeObjectURL(url), {
			once: true,
		});

		super(image);
	}
}

function setatts(el: any, vals: object) {
	for (let i of Object.keys(vals)) el.setAttribute(i, vals[i]);
}
