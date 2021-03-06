import "../types";
import { Sprite } from "./classes/Sprite.class";
import config from "./config/system.toml";

export const cnv = document.createElement("canvas");
export const ctx = cnv.getContext("2d");
cnv.oncontextmenu = function () {
	return false;
};
cnv.style.border = "3px solid #000000";

let hover: Sprite, spriteArr: Sprite[];
function spriteToCanvas(
	context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
	sprite: Sprite
) {
	context.save();
	//context.filter = sprite.filterString()
	//context.globalAlpha = sprite.effects.opacity / 100;
	context.translate(sprite.x, sprite.y);
	context.rotate((sprite.direction * Math.PI) / 180);
	context.drawImage(
		sprite.src,
		0 - ((sprite.src.width / 2) * sprite.width) / 100,
		0 - ((sprite.src.height / 2) * sprite.height) / 100,
		(sprite.src.width * sprite.width) / 100,
		(sprite.src.height * sprite.height) / 100
	);
	context.restore();
}
export function draw(): void {
	spriteArr = Object.values(sprites).sort((a, b) =>
		Number(a.zIndex - b.zIndex)
	);
	for (let i of spriteArr) {
		spriteToCanvas(ctx, i);
	}
}

const offscreencanvas = new OffscreenCanvas(cnv.width, cnv.height);
const offctx = offscreencanvas.getContext("2d");
function checkHover(): void {
	//  use if laggy
	if (frame % config.mouse.onHoverDelay != 0) return;
	let hoverHold = hover,
		prev = false;
	for (let i of spriteArr) {
		offctx.clearRect(0, 0, offscreencanvas.width, offscreencanvas.height);
		spriteToCanvas(offctx, i);
		let newpixel: string;
		newpixel = offctx
			.getImageData(Mouse.raw.x, Mouse.raw.y, 1, 1)
			.data.join();
		let touching = newpixel != "0,0,0,0";

		if (hover == i) {
			if (!touching) hoverHold = null;
			prev = true;
		}
		if (!hover || prev) if (touching) hoverHold = i;
	}

	if (hoverHold != hover) {
		hover?.onblur();
		hoverHold?.onhover();
	}
	hover = hoverHold;
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
cnv.ontouchmove = (
	e //probably broken
) =>
	([windowMouseX, windowMouseY] = [
		e.touches[0].clientX,
		e.touches[0].clientY,
	]); //consider tap and place?

/** Returns user mouse input including position and buttons pressed */
export const Mouse = {
	/** The position of the mouse, before scale transformations. Used internally. */
	raw: {
		get x() {
			let data = windowMouseX - cnv.getBoundingClientRect().x;
			if (isNaN(data)) data = 0;
			return data;
		},
		get y() {
			let data = windowMouseY - cnv.getBoundingClientRect().y;
			if (isNaN(data)) data = 0;
			return data;
		},
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
let onClickStartSprite: Sprite;
cnv.onmouseup = function (e) {
	windowMouseDownArray[e.button] = false;
	if (hover == onClickStartSprite) onClickStartSprite?.onclick();
	else hover.onmouseup();
};
cnv.ontouchend = function (e) {
	//might be broken
	windowMouseDownArray[0] = false;
};
cnv.onmousedown = function (e) {
	windowMouseDownArray[e.button] = true;
	onClickStartSprite = hover;
	hover.onmousedown();
};
cnv.ontouchstart = function (e) {
	//might be broken
	[windowMouseX, windowMouseY] = [e.touches[0].clientX, e.touches[0].clientY];
	windowMouseDownArray[0] = true;
};

let resolveframe: Function, run: Function, scale: number;
let fps: number[] = [],
	frame = 0;
window["nextframe"] = new Promise((r) => (resolveframe = r));

export function loop(func?: Function | number): void {
	//manage internals
	if (typeof func == "function") run = func;
	frame++;
	fps.push(Date.now());
	document.getElementById("dg").innerText = `fps: ${fps.length}`;
	let mDOM = document.getElementById("mouse");
	mDOM.innerHTML = Mouse.x + " &#9; " + Mouse.y;
	while (Date.now() - fps[0] > 980) fps.shift();

	//clear and resize canvas
	scale = ((window.innerWidth - 20) / 800) * (config.runOptions.scale / 100);
	offscreencanvas.width = cnv.width = 800 * scale;
	offscreencanvas.height = cnv.height = 400 * scale;

	//run code!
	run();
	draw(); //includes hover detection
	resolveframe();
	checkHover();

	//prepare for next frame
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
