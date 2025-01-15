// modules
const fs = require("fs");
// stuff
const Cartoon = require("./main");

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/upload_movie') return;

	const path = req.files.import.filepath, buffer = fs.readFileSync(path);

	try {
		// save the char
		Cartoon.save(buffer);
		const url = `/go_full?movieId=${mId}`;
		fs.unlinkSync(path);
		// redirect the user
		res.statusCode = 302;
		res.setHeader("Location", url);
		res.end();
	} catch (err) {
		console.error("Error uploading template:", err);
		res.statusCode = 500;
		res.end("00");
	}
	return true;
}