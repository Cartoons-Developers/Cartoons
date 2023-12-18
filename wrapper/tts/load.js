/**
 * route
 * tts generation
 */
// TODO: convert all of this to the fetch api
// modules
const base64 = require("js-base64");
const brotli = require("brotli");
const https = require("https");
const http = require("http");
const Lame = require("node-lame").Lame;
const md5 = require("js-md5");
const mp3Duration = require("mp3-duration");
// vars
// firefox is good
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0";
const voices = require("./info").voices;
// stuff
const asset = require("../asset/main");
const { xmlFail } = require("../request/extend");
const get = require("../request/get");
const processVoice = (voiceName, text) => {
	return new Promise((res, rej) => {
		const voice = voices[voiceName];
		switch (voice.source) {
			case 'polly': {
				text = text.substring(0, 2999);

				const body = new URLSearchParams({
					msg: text,
					lang: voice.arg,
					source: "ttsmp3"
				}).toString();
				var req = https.request(
					{
						hostname: "ttsmp3.com",
						port: "443",
						path: "/makemp3_new.php",
						method: "POST",
						headers: {
							"Content-Length": body.length,
							"Content-type": "application/x-www-form-urlencoded"
						}
					},
					(r) => {
						let buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => {
							const json = JSON.parse(Buffer.concat(buffers).toString());
							if (json.Error != 0) rej(json.Text);

							get(json.URL)
								.then(res)
								.catch(rej);
						});
						r.on("error", rej);
					}
				);
				req.write(body);
				req.end();
				break;
			}
			case 'vocalware': {
				var [eid, lid, vid] = voice.arg;
				var cs = md5(`${eid}${lid}${vid}${text}1mp35883747uetivb9tb8108wfj`);
				var q = new URLSearchParams({
					EID: voice.arg[0],
					LID: voice.arg[1],
					VID: voice.arg[2],
					TXT: text,
					EXT: "mp3",
					IS_UTF8: 1,
					ACC: 5883747,
					cache_flag: 3,
					CS: cs,
				}).toString();
				var req = https.get(
					{
						host: "cache-a.oddcast.com",
						path: `/tts/gen.php?${q}`,
						headers: {
							Referer: "https://www.oddcast.com/",
							Origin: "https://www.oddcast.com/",
							"User-Agent": userAgent,
						},
					},
					(r) => {
						var buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => res(Buffer.concat(buffers)));
						r.on("error", rej);
					}
				);
				break;
			}
        }
	});
}


/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = async function (req, res, url) {
	if (req.method != "POST" || url.pathname != "/goapi/convertTextToSoundAsset/") return;
	else if (!req.body.voice || !req.body.text) {
		res.statusCode = 400;
		res.end();
		return true;
	}

	try {
		const buffer = await processVoice(req.body.voice, req.body.text);
		mp3Duration(buffer, (e, duration) => {
			if (e || !duration) throw new Error(e);

			const meta = {
				type: "sound",
				subtype: "tts",
				title: `[${voices[req.body.voice].desc}] ${req.body.text}`,
				duration: 1e3 * duration,
				ext: "mp3",
				tId: "ugc"
			}
			const id = asset.save(buffer, meta);
			res.end(`0<response><asset><id>${id}.mp3</id><enc_asset_id>${id}</enc_asset_id><type>sound</type><subtype>tts</subtype><title>${meta.title}</title><published>0</published><tags></tags><duration>${meta.duration}</duration><downloadtype>progressive</downloadtype><file>${id}.mp3</file></asset></response>`)
		});
	} catch (err) {
		console.error("Error generating TTS: " + err);
		res.statusCode = 500;
		res.end("1" + xmlFail("Internal server error."));
	};
	return true;
}
