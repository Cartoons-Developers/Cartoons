/*
httpz.Response
Author: octanuary
License: MIT
*/
import { IncomingMessage, ServerResponse } from "http";

/**
 * an extended version of ServerResponse
 */
declare class Response extends ServerResponse {
	constructor(req: IncomingMessage);

	/**
	 * Checks if the value is `true`. If not, it throws an error.
	 * ```
	 * req.assert(req.body.password1, 400, "Missing one or more fields.");
	 * ```
	 */
	assert(value: any[], status: number, data: any): Response;

	/**
	 * Stringifies the object and returns it.
	 * ```js
	 * res.json({
	 * 	success: 0,
	 * 	msg: "RETRACT IT FROM THE SERVER!"
	 * });
	 * ```
	 */
	json(data: object): void;

	/**
	 * Sets the "Location" header and the status code (if specified).
	 * ```js
	 * res.redirect(301, "/newapi/do/something");
	 * ```
	 */
	redirect(url: string): void;
	redirect(status: number, url: string): void;

	/**
	 * Sets the status code.
	 * ```js
	 * const toecount = req.body.toes;
	 * if (toecount > 10) {
	 *  res.status(400);
	 *  res.end(`But Mr. Dan Schneider, I don't have ${toecount} toes. I only have 10!`);
	 * }
	 * ```
	 */
	status(status: number): Response;
}

export = Response;
