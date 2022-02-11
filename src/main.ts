const app: HTMLElement = document.getElementById("app");

//global variables
window["sprites"] = {};
window["globals"] = [2];

import "src/types";
import toml from "config/maps.toml";
import { cnv, Time, loop } from "./setup";
import { Button, Sprite } from "./assets/classes/sprite.class";
import Bob from "images/bob.png";
import lmnop from "images/brown.png";
//https://parceljs.org/features/dependency-resolution/#glob-specifiers

let bob: Sprite, steve: Sprite;
function init() {
	app.appendChild(cnv);
	let img = new Image();
	img.src = Bob;
	bob = new Sprite(img).move(100, 100).resize(200);

	bob.glide(600, 100, 10);
	Time.in(5, "seconds", () => {
		bob.move(100, 100).glide(350, 100, 10);
		console.log(toml);
		console.log("you're welcome");
	});

	steve = new Button("balloon 12pt", { width: 100 });
	console.log(steve);
	let bruh = new Image();
	bruh.src = lmnop;
	let ballet = new Sprite(bruh);
	ballet.move(80, 165);

	//bob.onhover = () => {console.log("cheeeeese")}
	bob.onclick = () => {
		console.log("AHHH");
	};
}
function myloop() {
	bob.direction += 0.1;
	steve.move(Math.sin(Date.now() / 3000) * 100 + 200, 200);
	steve.pointTowards(bob);
}

init();
loop(myloop);
