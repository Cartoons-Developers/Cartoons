/*
start wrapper: offline's server
*/
const fs = require("fs");
const httpz = require("@octanuary/httpz")
const path = require("path");
const static = require("node-static");
const routes = require("./controllers");
const reqBody = require("./middlewares/req.body");
const resRender = require("./middlewares/res.render");
const resTime = require("./middlewares/res.time");
const fakeRoutes = require("./data/routes.json");

/**
 * Starts the GoAPI server.
 * @returns {import("@octanuary/httpz").Server}
 */
module.exports = function () {
	const server = new httpz.Server();
	const file = new static.Server(path.join(__dirname, "../server"), { cache: 2 });

	server.add(reqBody);
	server.add(resRender);
	server.add(resTime);
	server.add(routes);
	// handle 404s
	server.route("*", "*", (req, res) => {
		const methodLinks = fakeRoutes[req.method];
		const combLinks = Object.assign(fakeRoutes["*"], methodLinks);
		for (let linkIndex in combLinks) {
			// find a match
			const regex = new RegExp(linkIndex);
			if (regex.test(req.parsedUrl.pathname)) {
				const route = combLinks[linkIndex];
				const link = req.parsedUrl.pathname;
				const headers = route.headers;
				const path = `./${link}`;
	
				try {
					for (var headerName in headers || {}) {
						res.setHeader(headerName, headers[headerName]);
					}
					res.statusCode = route.statusCode || 200;
					if (route.content !== undefined)
						res.end(route.content);
					else if (fs.existsSync(path))
						fs.createReadStream(path).pipe(res);
					else throw null;
				} catch (e) {
					break;
				}
				return;
			}
		}
		// still no match, try serving a static file
		if (!res.writableEnded) {
			if (req.method != "GET" && req.method != "HEAD") {
				file.serveFile("/404.html", 404, {}, req, res);
			} else {
				req.addListener("end", () =>
					file.serve(req, res, (e) => {
						if (e && (e.status === 404)) {
							file.serveFile("/404.html", 404, {}, req, res);
						}
					})
				).resume();
			}
		}
	});
	server.listen(process.env.SERVER_PORT, console.log("Listening on port " + process.env.SERVER_PORT));
	
	return server;
};
