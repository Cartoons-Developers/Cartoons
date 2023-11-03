# httpz
HTTPz (http-**easy**) is a lightweight HTTP framework for Node.js.


# Quick Start
To use HTTPz, install it as a dependency in your project, then add some code.

npm:
```
npm install @octanuary/httpz
```

## Example
```js
import httpz from "@octanuary/httpz";

const server = new httpz.Server();

server
	.route("GET", "/", async (req, res) => {
		res.end("Hello World!");
	})
	.listen(5000);
```


# Features

## Routing
HTTPz already comes with a router built-in, which is `httpz.Group`, so you can do this:

```js
import httpz from "@octanuary/httpz";

const server = new httpz.Server();
const group = new httpz.Group();

group.route("GET", "/", (req, res) => {
	res.end("Hello World!");
});

server
	.add(group)
	.listen(5000);
```
