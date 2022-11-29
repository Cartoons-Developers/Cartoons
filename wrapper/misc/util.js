module.exports = {
	xmlFail(message = "There was a problem completing this task. Please refresh the page and try again.") {
		return `<error><code>ERR_ASSET_404</code><message>${message}</message><text></text></error>`;
	},
};
