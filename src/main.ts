const app: HTMLElement = document.getElementById("app");

window["sprites"] = {}; //global variable

import toml from "./assets/config/maps.toml";
import { cnv, Time, loop } from "./setup";
import { Button, Sprite } from "./assets/classes/sprite.class";
import Bob from "./assets/images/bob.png";

let bob: Sprite, steve: Sprite;
function init() {
	app.appendChild(cnv);
	let img = new Image();
	img.src = Bob;
	bob = new Sprite(img)
		.move(100, 100)
		.resize(200);

	bob.glide(600, 100, 10);
	Time.in(5, "seconds", () => {
		bob.move(100, 100).glide(350, 100, 10);
		console.log(toml);
		console.log("you're welcome");
	});

	steve = new Button({width: 100})
}
function myloop() {
	bob.direction += 0.1;
	steve.move(Math.sin(Date.now()/3000)*100+200, 200)
}

init();
loop(myloop);
