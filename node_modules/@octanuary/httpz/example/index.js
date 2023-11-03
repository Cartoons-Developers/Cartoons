/*
httpz official real not fake example server
*/
const httpz = require("../lib/index");
const routes = require("./routes");
const restime = require("./middlewares/responseTime");
const user = require("./middlewares/user");

const server = new httpz.Server();

server
	// add middlewares
	.add(restime)
	.add(user)
	// add groups of routes
	.add(routes)
	// 404
	.route("*", "*", async (req, res) => {
		if (!res.writableEnded) {
			res
				.status(404)
				.json({
					status: "error",
					data: "Not found"
				});
		}
	})
	.listen(5000);