const header = process.env.XML_HEADER;
const wm = require("./main");

module.exports = function (req, res, url) {
	const match = url.path.match(/\/goapi\/assignwatermark\/movie\/([^/]+)\/([^/]+)$/);
	if (!match) return;

	const mId = match[1], aId = match[2]; // get asset id
	wm.assign(aId, mId);
	res.end("0")
	return true;
}