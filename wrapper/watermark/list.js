const header = process.env.XML_HEADER;
const asset = require("./main");

function listWm() {
	files = asset.list("sound");
	return `${header}<watermarks><current/><preview/>${files
		.map(v => `<watermark id="${v.id}" thumbnail="/assets/${v.id}"/>`)
		.join("")}</watermarks>`
}

module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getUserWatermarks/") return;
	const watermarks = listWm();
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	res.end(watermarks);
	return true;
}