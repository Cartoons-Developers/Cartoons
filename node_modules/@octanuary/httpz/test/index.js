const assert = require("node:assert");
const request = require("supertest");
const httpz = require("../lib/index.js");
const server = new httpz.Server({ strictUrl: true });

describe("Server", () => {
	describe(".route", () => {
		it("should add the route to Server.middlewares", (done) => {
			server.route("GET", "/server-route-mwArrayTest", (req, res) =>
				res.end("world")
			);

			const middleware = server.middlewares.find((m) => {
				return m.method == "GET" &&
				m.url == "/server-route-mwArrayTest"
			});

			// look for the middleware
			done(assert.equal(typeof middleware, "object"));
		});
		describe("#flexible", () => {
			it("should accept an array of methods", (done) => {
				server.route(["GET", "DELETE"], "/server-route-methodArray",
					(req, res) => res.end("world")
				);
	
				request(server.server)
					.get("/server-route-methodArray")
					.end(e => {
						if (e) {
							done(e);
							return;
						};
	
						request(server.server)
							.delete("/server-route-methodArray")
							.expect("world", done);
					});
			});
			it("should accept an array of urls", (done) => {
				server.route(
					"*",
					["/server-route-urlArray1", "/server-route-urlArray2"],
					(req, res) => res.end("world")
				);
	
				request(server.server)
					.get("/server-route-urlArray1")
					.end((e, res) => {
						if (e) {
							done(e);
							return;
						};
						assert.equal(res.text, "world");
	
						request(server.server)
							.get("/server-route-urlArray2")
							.expect("world", done);
					});
			});
			it("should accept a regex url", (done) => {
				server.route(
					"*",
					/^\/server-route-regEx([\d]+)$/,
					(req, res) => res.end("world")
				);
	
				request(server.server)
					.get("/server-route-regEx1")
					.end((e, res) => {
						if (e) {
							done(e);
							return;
						};
						assert.equal(res.text, "world");
	
						request(server.server)
							.get("/server-route-regEx2")
							.expect("world", done);
					});
			});
		});
		describe("#called", () => {
			it("should return the expected response", (done) => {
				server.route("POST", "/server-route-expected", (req, res) =>
					res.status(420).end("hello-world")
				);
	
				request(server.server)
					.post("/server-route-expected")
					.expect(420, "hello-world", done);
			});
			it("should be case-sensitive", (done) => {
				server.route("*", "*", (req, res) => {
					res.status(404);
					res.end("40whore");
				});
				server.route(
					"POST",
					"/server-route-caseSensitive",
					(req, res) => res.end("EEEEEE")
				);

				request(server.server)
					.post("/server-route-casesensitive")
					.expect(404, "40whore", (err) => {
						if (err) {
							done(err);
							return;
						}
						const index = server.middlewares.findIndex((m) => {
							return m.method == "*" &&
							m.url == "*"
						});
						server.middlewares.splice(index, 1);
						done();
					});
			});
			it("should not crash when an unhandled exception occurs", (done) => {
				server.route("POST", "/server-route-exception", () => {
					throw "christine chubbuck";
				});
	
				request(server.server)
					.post("/server-route-exception")
					.expect(500, done)
			});
		});
	});
});

describe("Request", function () {
	describe(".cookies", () => {
		it("should return all the cookies", (done) => {
			server.route("*", "/req-cookies-allCookies", (req, res) =>
				res.json(req.cookies)
			);

			request(server.server)
				.get("/req-cookies-allCookies")
				.set("Cookie", "cookie1=hello; cookie2=world;cookie3=hellouser")
				.expect(200, {
					cookie1: "hello",
					cookie2: "world",
					cookie3: "hellouser"
				}, done);
		});
	});
	describe(".query", () => {
		it("should return the parsed querystring", (done) => {
			server.route("GET", "/req-query-getQuery", (req, res) =>
				res.json(req.query)
			);

			request(server.server)
				.get("/req-query-getQuery?param1=bye&param2=world")
				.expect(200, {
					param1: "bye",
					param2: "world"
				}, done);
		});
	});
});

describe("Response", function () {
	describe(".redirect", () => {
		it("should redirect to the specified url", (done) => {
			server.route("*", "/res-redirect1", (req, res) =>
				res.redirect(301, "/res-redirect2")
			);

			request(server.server)
				.get("/res-redirect1")
				.expect("Location", "/res-redirect2")
				.expect(301, done);
		});
	});
	describe(".json", () => {
		it("should stringify the json and return it", (done) => {
			server.route("GET", "/res-json", (req, res) =>
				res.json({
					success: 0,
					msg: "hi"
				})
			);

			request(server.server)
				.get("/res-json")
				.expect(200, {
					success: 0,
					msg: "hi"
				}, done);
		});
	});
	describe(".assert", () => {
		it("should throw an exception if the value doesn't exist", (done) => {
			server.route("GET", "/res-assert", (req, res) => {
				res.assert(req.query.param1, 500, "i hate you");
				// never happens
				res.status(200);
				res.end("great job!");
			});

			request(server.server)
				.get("/res-assert")
				.expect(500, "i hate you", done);
		});
	});
});
