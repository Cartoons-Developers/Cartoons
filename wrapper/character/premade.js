const loadPost = require("../misc/post_body");
const folder = process.env.PREMADE_FOLDER;
const fs = require("fs");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */module.exports = async function (req, res, url) {
	if (req.method != "POST" || url.pathname != "/goapi/getCCPreMadeCharacters") return;
	res.end();
	return true;
};