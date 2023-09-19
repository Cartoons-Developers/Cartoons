const fs = require("fs");
const httpz = require("@octanuary/httpz");
const tempfile = require("tempfile");
const Asset = require("../models/asset");
const { mp3Duration } = require("../utils/fileUtil");
const processVoice = require("../models/tts");
const info = require("../data/voices");
const group = new httpz.Group();

/*
generate the list
*/
const voices = info.voices, langs = {};
Object.keys(voices).forEach((i) => {
	const v = voices[i], l = v.language;
	langs[l] = langs[l] || [];
	langs[l].push(`<voice id="${i}" desc="${v.desc}" sex="${v.gender}" demo-url="" country="${v.country}" plus="N"/>`);
});
const xml = `${process.env.XML_HEADER}<voices>${
	Object.keys(langs).sort().map(i => {
		const v = langs[i], l = info.languages[i];
		return `<language id="${i}" desc="${l}">${v.join("")}</language>`;
	}).join("")}</voices>`;

/*
list
*/
group.route("POST", "/goapi/getTextToSpeechVoices/", (req, res) => {
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	res.end(xml);
});

/*
load
*/
group.route("POST", "/goapi/convertTextToSoundAsset/", async (req, res) => {
	const { voice, text } = req.body;
	res.assert(voice, text, 400, "");

	const filepath = tempfile(".mp3");
	const writeStream = fs.createWriteStream(filepath);
	processVoice(voice, text).then((data) => {
		if (typeof data.on == "function") {
			data.pipe(writeStream);
		} else {
			writeStream.end(data);
		}

		writeStream.on("close", async () => {
			const duration = await mp3Duration(filepath);
			const meta = {
				duration,
				type: "sound",
				subtype: "tts",
				title: `[${voices[voice].desc}] ${text}`
			};
			const id = await Asset.save(filepath, "mp3", meta);
			res.end(`0<response><asset><id>${id}</id><enc_asset_id>${id}</enc_asset_id><type>sound</type><subtype>tts</subtype><title>${meta.title}</title><published>0</published><tags></tags><duration>${meta.duration}</duration><downloadtype>progressive</downloadtype><file>${id}</file></asset></response>`);
		});
	}).catch((err) => {
		console.error("Error generating TTS:", err);
		res.end(`1<error><code>ERR_ASSET_404</code><message>${err}</message><text></text></error>`);
	});
});

module.exports = group;
