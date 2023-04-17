require("./server");


// Loads env.json for Wrapper version and build number
const env = Object.assign(process.env,
	require('./env'));
// env.json variables
let version = env.WRAPPER_VER;
let build = env.WRAPPER_BLD;