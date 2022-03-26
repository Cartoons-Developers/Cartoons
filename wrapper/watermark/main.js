/***
 * watermark api
 */
const fs = require("fs");
const database = require("../data/database"), DB = new database();
const folder = `${__dirname}/../${process.env.CACHÉ_FOLDER}`;
const fUtil = require("../fileUtil");

module.exports = {
	list() { // very simple thanks to the database
		let aList = DB.get().wm;
		return aList;
	},
	save(buf, ext) {
		// save asset info
		const aId = fUtil.generateId();
		const db = DB.get();
		db.wm.push({ // base info, can be modified by the user later
			id: aId,
			movies: []
		});
		DB.save(db);
		// save the file
		fs.writeFileSync(`${folder}/${aId}.${ext}`, buf);
		return aId;
	},
	assign(aId, mId) {
		// set new info and save
		const db = DB.get();
		const met = db.assets.find(i => i.id == aId);
		met.movies.unshift(mId);
		DB.save(db);
		return true;
	}
};