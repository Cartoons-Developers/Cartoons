import Group from "./models/group";
import Request from "./models/request";
import Response from "./models/response";
import Server from "./models/server";

declare module "@octanuary/httpz";
declare const exported: {
	Group: Group,
	Request: Request,
	Response: Response,
	Server: Server
};
export = exported;
