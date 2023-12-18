/**
 * route
 * character redirects
 */
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
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = async function (req, res, url) {
	if (req.method != "GET") return;
	const match = req.url.match(/\/go\/character_creator\/(\w+)(\/\w+)?(\/.+)?$/);
	if (!match) return;
	let [, theme, mode, id] = match;

	let redirect;
	switch (mode) {
		case "/copy": {
			redirect = `/cc?themeId=${theme}&original_asset_id=${id.substring(1)}`;
			break;
		} default: {
			const type = url.query.type || defaultTypes[theme] || "";
			redirect = `/cc?themeId=${theme}&bs=${type}`;
			break;
		}
	}
	res.setHeader("Location", redirect);
	res.statusCode = 302;
	res.end();
	return true;
};
