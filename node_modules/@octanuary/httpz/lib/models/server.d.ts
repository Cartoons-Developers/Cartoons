import { Server as httpServer } from "http";
import Group from "./group.js";

declare type httpzOptions = {
	strictUrl?: boolean
};

declare class Server extends Group {
	constructor(options: httpzOptions);

	/**
	 * Alias of http.Server.listen().
	 */
	listen(...p): void;

	server: httpServer
}

export = Server;
