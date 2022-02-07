const app: HTMLElement = document.getElementById("app");
let resolveframe: Function;
window["sprites"] = {}; //global variable
window["nextframe"] = new Promise((r) => (resolveframe = r));

import toml from "./assets/config/maps.toml";
import { cnv, draw, pen, Time } from "./setup";
import { Button, Sprite } from "./assets/classes/sprite.class";
import Bob from "./assets/images/bob.png";

app.appendChild(cnv);
let img = new Image()
img.src = Bob
let bob = new Sprite(img).move(100, 100).resize(200);

bob.glide(600, 100, 10);
Time.in(5, "seconds", () => {
	bob.move(100, 100).glide(350, 100, 10);
	console.log(toml);
});

let steve = new Button()

/**
 * Options that can change how the game runs
 * - Gamespeed: Time between ticks (milliseconds)
 * - Stop: Set to True to kill the loop
 * - Scale: How large the canvas will be
 */
export const runOptions = {
	gamespeed: 0,
	stop: false,
	scale: (window.innerWidth - 20) / 800,
};

function init() {}
function run() {}

function loop(): void {
	frame++;
	fps.push(Date.now());
	document.getElementById("dg").innerText = `fps: ${fps.length}`;
	while (Date.now() - fps[0] > 980) fps.shift();
	pen.clearRect(0, 0, cnv.width, cnv.height);
	cnv.width = 800 * runOptions.scale;
	cnv.height = 400 * runOptions.scale;
	run();
	draw();
	resolveframe();
	nextframe = new Promise((r) => (resolveframe = r));
	if (!runOptions.stop) {
		if (runOptions.gamespeed == 0) window.requestAnimationFrame(loop);
		else
			setTimeout(
				window.requestAnimationFrame,
				runOptions.gamespeed,
				loop
			);
	}
}
let frame = 0;
let fps: number[] = [];
//reminder: set config as global
console.clear();
async function load() {
	init();
	loop();
}
load();
