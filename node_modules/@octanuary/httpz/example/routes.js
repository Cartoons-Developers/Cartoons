/*
example server routes
*/
const httpz = require("../lib/index");

const group = new httpz.Group();

group
	.route(["YOU", "GET", "NO", "BITCHES"], "/OK", async (req, res) => {
		let ok = false;
		if (req.query.ok) ok = true;

		res.end(ok ? "everything's gonna be fine" : "THIS IS HORRIBLE! YOU'RE HORRIBLE! EVERYTHING'S HORRIBLE!");
		return;
	})
	.route("*", "/user", async (req, res) => {
		res.json(req.user);
	})
	.route("*", /survey([\d]+)/, async (req, res) => {
		console.log("phone number", req.matches[1]);
		res.end("thanks for completing our survey");
	})
	.route("GET", "/", async (req, res) => {
		res.json({
			status: "ok",
			data: `Hello, ${req.user?.name}!`
		});
	});

module.exports = group;