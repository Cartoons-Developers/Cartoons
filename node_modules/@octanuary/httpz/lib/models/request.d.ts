import { Socket } from "net";
import { IncomingMessage } from "http";

/**
 * an extended version of IncomingMessage
 */
declare class Request extends IncomingMessage {
	constructor(socket: Socket);

	cookies: {
		[k: string]: string
	};

	parsedUrl: URL;

	query: {
		[k: string]: string
	} | undefined;
}

export = Request;
