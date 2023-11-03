/**
 * @param {httpz.Request} req 
 * @param {httpz.Response} res 
 * @param {Function} next 
 */
module.exports = async function (req, res, next) {
	req.user = {
		id: 1,
		name: 'John Doe',
		email: 'johndoe@ma.il'
	};
	await next();
	return;
};
