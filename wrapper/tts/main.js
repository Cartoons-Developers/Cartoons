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
				https.get('https://nextup.com/ivona/index.html', (r) => {
				var q = qs.encode({
					voice: voice.arg,
				    language: `${voice.language}-${voice.country}`,
					text: text
				});
				var buffers = [];
                var req = https.get(`https://nextup.com/ivona/php/nextup-polly/CreateSpeech/CreateSpeechGet3.php?${q}`, (r) => {
                    r.on("data", (d) => buffers.push(d));
                    r.on("end", () => {
                        const loc = Buffer.concat(buffers).toString();
                        get(loc).then(res).catch(rej);
                    });
                    r.on("error", rej);
                    });
				});
				break;
			}
			case 'cepstral':
			case 'voiceforge': {
				https.get('https://www.voiceforge.com/demo', r => {
					const cookie = r.headers['set-cookie'];
					var q = qs.encode({
						voice: voice.arg,
						voiceText: text,
					});
					var buffers = [];
					var req = https.get({
						host: 'www.voiceforge.com',
						path: `/demos/createAudio.php?${q}`,
						headers: { Cookie: cookie },
						method: 'GET',
					}, r => {
						r.on('data', b => buffers.push(b));
						r.on('end', () => {
							const html = Buffer.concat(buffers);
							const beg = html.indexOf('id="mp3Source" src="') + 20;
							const end = html.indexOf('"', beg);
							const loc = html.subarray(beg, end).toString();
							get(`https://www.voiceforge.com${loc}`).then(res).catch(rej);
						});
					});
				});
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
			case 'voicery': {
				var q = qs.encode({
					text: text,
					speaker: voice.arg,
					ssml: text.includes('<'),
				});
				https.get({
					host: 'www.voicery.com',
					path: `/api/generate?${q}`,
				}, r => {
					var buffers = [];
					r.on('data', d => buffers.push(d));
					r.on('end', () => res(Buffer.concat(buffers)));
					r.on('error', rej);
				});
				break;
			}
			case 'watson': {
				var q = qs.encode({
					text: text,
					voice: voice.arg,
					download: true,
					accept: "audio/mp3",
				});
				console.log(https.get({
					host: 'text-to-speech-demo.ng.bluemix.net',
					path: `/api/v1/synthesize?${q}`,
					headers: {
						Referer: 'https://www.vocalware.com/index/demo',
						Origin: 'https://www.vocalware.com',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
					},
				}, r => {
					var buffers = [];
					r.on('data', d => buffers.push(d));
					r.on('end', () => res(Buffer.concat(buffers)));
					r.on('error', rej);
				}));
				break;
			}
		}
	});
}
