import config from "./assets/config/system.toml";

export const cnv = document.createElement("canvas");
cnv.oncontextmenu = function () {
	//return false;
};
cnv.style.border = "3px solid #000000";
export const ctx = cnv.getContext("2d");

let hover: Sprite;
export function draw(): void {
	let spriteArr = Object.values(sprites).sort((a, b) =>
		Number(a.zIndex - b.zIndex)
	);
	let pixel = "0,0,0,0";
	for (let i of spriteArr) {
		ctx.save();
		ctx.globalAlpha = i.alpha / 100;
		ctx.translate(i.x, i.y);
		ctx.rotate((i.direction * Math.PI) / 180);
		ctx.drawImage(
			i.src,
			0 - ((i.src.width / 2) * i.width) / 100,
			0 - ((i.src.height / 2) * i.height) / 100,
			(i.src.width * i.width) / 100,
			(i.src.height * i.height) / 100
		);
		ctx.restore();
		if (frame % 30 != 0) continue;

		if (hover == i || !hover) {
			let newpixel: string;
			newpixel = ctx
				.getImageData(Mouse.raw.x, Mouse.raw.y, 1, 1)
				.data.join();
			if (hover == i) {
				if (pixel == newpixel) hover = null;
			} else if (pixel != newpixel) {
				hover = i;
				i.onhover();
			}

			pixel = newpixel;
		}

		globals[0] = hover;
	}
}

export const Time = {
	sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
	in: async function (time: number, unit: string, callback: Function) {
		switch (unit) {
			case "m":
			case "minutes":
				time *= 60;
			//break;
			case "ms":
			case "milliseconds":
				break;
			case "s":
			case "seconds":
			default:
				time *= 1000;
		}
		await this.sleep(time);
		callback();
	},
};

const kp: any = {};
window.onkeydown = window.onkeyup = function (e) {
	if (e.key.length == 1)
		kp[
			e.key.toLowerCase() == e.key
				? e.key.toUpperCase()
				: e.key.toLowerCase()
		] = 0;
	kp[e.key] = e.type == "keydown" ? kp[e.key] || Date.now() : 0;
	const event = `key ${e.key} ${e.type.slice(3)}`;
	//me.onEvent?.[event]?.(event, Date.now() - kp[e.key]);
	//if (me.logEvents) console.log(event);
};

let windowMouseX: number, windowMouseY: number;
cnv.onmousemove = (e) =>
	([windowMouseX, windowMouseY] = [e.clientX, e.clientY]);
cnv.ontouchmove = (e) =>
	([windowMouseX, windowMouseY] = [
		e.touches[0].clientX,
		e.touches[0].clientY,
	]); //tap and place?

/** Returns user mouse input including position and buttons pressed */
export const Mouse = {
	/** The position of the mouse, before scale transformations. Used internally. */
	raw: {
		get x() {
			let data = windowMouseX - cnv.getBoundingClientRect().x
			if (isNaN(data)) data = 0;
			return data
		},
		get y() {
			let data = windowMouseY - cnv.getBoundingClientRect().y
			if (isNaN(data)) data = 0;
			return data
		}
	},
	/** X Position of mouse pointer, relative to canvas (0-800) */
	get x() {
		let relative = this.raw.x / scale;
		let rounded = Math.round(relative * 100) / 100;
		return rounded;
	},
	/** Y Position of mouse pointer, relative to canvas (0-400) */
	get y() {
		let relative = this.raw.y / scale;
		let rounded = Math.round(relative * 100) / 100;
		return rounded;
	},
	/** Returns true if currently pressed */
	get left() {
		return windowMouseDownArray[0];
	},
	/** Returns true if currently pressed */
	get middle() {
		return windowMouseDownArray[1];
	},
	/** Returns true if currently pressed */
	get right() {
		return windowMouseDownArray[2];
	},
};
const windowMouseDownArray = [false, false, false];
cnv.onmouseup = function (e) {
	windowMouseDownArray[e.button] = false;
};
cnv.ontouchend = function (e) {
	windowMouseDownArray[0] = false;
};
cnv.onmousedown = function (e) {
	windowMouseDownArray[e.button] = true;
	//for (let i of me.onclicks) if (e.button == i[1]) i[0](e);
};
cnv.ontouchstart = function (e) {
	[windowMouseX, windowMouseY] = [e.touches[0].clientX, e.touches[0].clientY];
	windowMouseDownArray[0] = true;
	//for (let i of me.onclicks) if (e.button == i[1]) i[0](e);
};
//}

let resolveframe: Function, run: Function, scale: number;
window["nextframe"] = new Promise((r) => (resolveframe = r));
export function loop(func?: Function | number): void {
	if (typeof func == "function") run = func;
	frame++;
	fps.push(Date.now());
	document.getElementById("dg").innerText = `fps: ${fps.length}`;
	let mDOM = document.getElementById("mouse");
	mDOM.innerHTML = Mouse.x + " &#9; " + Mouse.y;
	while (Date.now() - fps[0] > 980) fps.shift();
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	scale = ((window.innerWidth - 20) / 800) * (config.runOptions.scale / 100);
	cnv.width = 800 * scale;
	cnv.height = 400 * scale;
	run();
	draw();
	resolveframe();
	nextframe = new Promise((r) => (resolveframe = r));
	if (!config.runOptions.stop) {
		if (config.runOptions.gamespeed == 0)
			window.requestAnimationFrame(loop);
		else
			setTimeout(
				window.requestAnimationFrame,
				config.runOptions.gamespeed,
				loop
			);
	}
}
let frame = 0;
let fps: number[] = [];
