const brotli = require("brotli");
const { convertToMp3 } = require("../utils/fileUtil.js");
const https = require("https");
const voices = require("../data/voices.json").voices;

/**
 * uses tts demos to generate tts
 * @param {string} voiceName
 * @param {string} text
 * @returns {Promise<IncomingMessage>}
 */
module.exports = function processVoice(voiceName, rawText) {
	return new Promise((res, rej) => {
		const voice = voices[voiceName];
		if (!voice) {
			return rej("The voice you requested is unavailable.");
		}

		let flags = {};
		const pieces = rawText.split("#%");
		let text = pieces.pop().substring(0, 180);
		for (const rawFlag of pieces) {
			const index = rawFlag.indexOf("=");
			if (index == -1) continue;
			const name = rawFlag.substring(0, index);
			const value = rawFlag.substring(index + 1);
			flags[name] = value;
		}

		try {
			switch (voice.source) {
				case "polly": {
					const body = new URLSearchParams({
						msg: text,
						lang: voice.arg,
						source: "ttsmp3"
					}).toString();

					const req = https.request(
						{
							hostname: "ttsmp3.com",
							path: "/makemp3_new.php",
							method: "POST",
							headers: { 
								"Content-Length": body.length,
								"Content-type": "application/x-www-form-urlencoded"
							}
						},
						(r) => {
							let body = "";
							r.on("data", (c) => body += c);
							r.on("end", () => {
								const json = JSON.parse(body);
								if (json.Error == 1) {
									return rej(json.Text);
								}

								https
									.get(json.URL, res)
									.on("error", rej);
							});
							r.on("error", rej);
						}
					)
					req.on("error", rej);
					req.end(body);
					break;
				}

				case "nuance": {
					const q = new URLSearchParams({
						voice_name: voice.arg,
						speak_text: text,
					}).toString();

					https
						.get(`https://voicedemo.codefactoryglobal.com/generate_audio.asp?${q}`, res)
						.on("error", rej);
					break;
				}

				case "vocalware": {
					const [EID, LID, VID] = voice.arg;
					const q = new URLSearchParams({
						EID,
						LID,
						VID,
						TXT: text,
						EXT: "mp3",
						FNAME: "",
						ACC: 15679,
						SceneID: 2703396,
						HTTP_ERR: "",
					}).toString();

					console.log(`https://cache-a.oddcast.com/tts/genB.php?${q}`)
					https
						.get(
							{
								hostname: "cache-a.oddcast.com",
								path: `/tts/genB.php?${q}`,
								headers: {
									"Host": "cache-a.oddcast.com",
									"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.5",
									"Accept-Encoding": "gzip, deflate, br",
									"Origin": "https://www.oddcast.com",
									"DNT": 1,
									"Connection": "keep-alive",
									"Referer": "https://www.oddcast.com/",
									"Sec-Fetch-Dest": "empty",
									"Sec-Fetch-Mode": "cors",
									"Sec-Fetch-Site": "same-site"
								}
							}, res
						)
						.on("error", rej);
					break;
				}
			}
		} catch (e) {
			return rej(e);
		}
	});
};
