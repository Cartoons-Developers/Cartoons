const http = require("http");
const defaultTypes = {
	adam: "adam&ft=_sticky_filter_guy",
	eve: "eve&ft=_sticky_filter_girl",
	heavy_man: "bob&ft=_sticky_filter_fatguy",
	heavy_woman: "bob&ft=_sticky_filter_fatgirl",
	rocky: "rocky&ft=_sticky_filter_buff",
	boy: "boy&ft=_sticky_filter_littleguy",
	girl: "girl&ft=_sticky_filter_littlegirl",
};

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET" || !url.pathname.startsWith("/go/character_creator")) return;
	var match = /\/go\/character_creator\/(\w+)(\/\w+)?(\/.+)?$/.exec(url.pathname);
	if (!match) return;
	[, theme, mode, id] = match;

	var redirect;
	switch (mode) {
		case "/copy": {
			redirect = `/cc?themeId=${theme}&original_asset_id=${id.substr(1)}`;
			break;
		}
		default: {
			var type = "family" ?
					defaultTypes[url.query.type || ""] || "":url.query.type || defaultTypes[theme] || "";
			redirect = `/cc?themeId=${theme}&bs=${type}`;
			break;
		}
	}
	res.setHeader("Location", redirect);
	res.statusCode = 302;
	res.end();
	return true;
};
