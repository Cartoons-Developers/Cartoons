const http = require("http");
const errors = require("../util/errors.json");

module.exports = class Group {
	constructor(options = {}) {
		this.middlewares = [];
		this.options = options;
	}

	add(param1) {
		if (param1 instanceof Group) {
			this.middlewares.push(...param1.middlewares);
		} else if (typeof param1 == "function") {
			this.middlewares.push(param1);
		} else {
			throw new Error("Expected type 'httpz.Group | function' for param1. Got " + typeof param1);
		}
		return this;
	}

	route(method, url, ...callbacks) {
		// convert request methods to uppercase
		if (typeof method == "string") {
			method = [method.toUpperCase()];
		} else if (Array.isArray(method)) {
			method = method.map((m) => m.toUpperCase());
		} else {
			throw new Error("Expected type 'string | string[]' for method. Got " + typeof method);
		}
		const validMethods = method.some((m) => http.METHODS.includes(m));
		if (!validMethods) {
			throw new Error(errors.invalidMethod);
		}

		if (url instanceof RegExp || typeof url == "string") {
			url = [url];
		} else if (!Array.isArray(url)) {
			throw new TypeError(errors.invalidUrlType);
		}

		this.middlewares.push({
			method,
			url,
			callbacks
		});
		return this;
	}
};
