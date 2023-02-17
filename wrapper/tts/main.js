const voices = require('./info').voices;
const get = require('../request/get');
const qs = require('querystring');
const https = require('https');
const md5 = require("js-md5");
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0";

module.exports = function (voiceName, text) {
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
			case 'azure': {
				var body = new URLSearchParams({
					text: text,
					voices: voice.arg,
					download: true,
					accept: "audio/mp3",
				});
				var req = https.get({
					host: 'play.ht',
					port: "443",
					path: `/api/transcribe?${q}`,
					method: 'GET',
					headers: {
						Referer: "https://play.ht/simple-editor/",
						Origin: "https://play.ht/",
						"User-Agent":  userAgent,
				    },
				}, r => {
					var buffers = [];
					r.on('data', d => buffers.push(d));
					r.on('end', () => res(Buffer.concat(buffers)));
					r.on('error', rej);
				});
				break;
			}
		}
	});
}
