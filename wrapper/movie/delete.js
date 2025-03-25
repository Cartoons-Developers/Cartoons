/**
 * route
 * movie deleting
 */
// stuff
const Movie = require("./main");

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @returns {boolean}
 */
module.exports = async function (req, res) {
	const match = req.url.match(/\/api\/movie\/delete\/([^/]+)$/);
	if (!match) return;
	const mId = match[1];

	console.log("(Warning!) Deleting movie:", mId);
	try {
		// check if the mid is valid
		if (mId.length != 7) throw "Deleted";
		await Movie.delete(mId);
		res.setHeader("Content-Type", "application/json");
		res.end('{"status":"ok"}');
	} catch (e) {
		console.error("Sorry, I'm afraid I won't let you do that.", e);
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.end('{"status":"error"}');
	}
	return true;
}
