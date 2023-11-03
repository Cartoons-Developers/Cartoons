const httpz = require("../../lib/index");

/**
 * @param {httpz.Request} req 
 * @param {httpz.Response} res 
 * @param {Function} next 
 */
module.exports = async function (req, res, next) {
	const start = Date.now();
	await next();
	const duration = Date.now() - start;
	console.log(`${req.method} ${req.url} ${duration}ms`);
	return;
};
