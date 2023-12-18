const importer = $("#importer");
const previewer = $("#previewer");
const studio = $("#obj");
const body = $("body");

/**
 * studio functions
 */
const tutorialReload = (new URLSearchParams(window.location.search)).get("tutorial");
interactiveTutorial = {
	neverDisplay: function() {
		return tutorialReload ? false : true;
	}
};
function studioLoaded(arg) { console.log(arg) }

/**
 * show and hide widgets
 */
let importerVisible = false;
function showImporter() {
	switch(importerVisible) {
		case true: {
			hideImporter();
			break;
		}
		case false:
		default: {
			importerVisible = true;
			importer.show();
			if (!importer.data("importer"))
				importer.data("importer", new AssetImporter(importer));
		}
	}
	return true;
}
function hideImporter() {
	importerVisible = false;
	importer.hide();
}
function initPreviewPlayer(dataXmlStr, startFrame, containsChapter, themeList) {
	movieDataXmlStr = dataXmlStr;
	filmXmlStr = dataXmlStr.split("<filmxml>")[1].split("</filmxml>")[0];
	hideImporter(); // hide importer before previewing
	// update flashvars
	const flashvars = new URLSearchParams({
		apiserver: "/",
		isEmbed: 1,
		tlang: "en_US",
		isInitFromExternal: 1,
		startFrame: startFrame,
		autostart: 1,
		storePath: STORE_URL + "/<store>",
		clientThemePath: CLIENT_URL + "/<client_theme>",
		isPreview: 1
	}).toString();
	previewer.find("object param[name='flashvars']").attr("value", flashvars);
	previewer.css("display", "block");
	studio.css("height", "1px");
	body.css("background-color", "#262d3f");
}
function retrievePreviewPlayerData() { return movieDataXmlStr }
function hidePreviewer() {
	previewer.css("display", "none");
	studio.css("height", "");
	body.css("background-color", "");
}
function publishStudio() {
	try {
	  ($("#previewer #preview_player").get(0) || {pause:function(){}}).pause();
	} catch (err) {};

	$("#previewer").hide();
	hidePreviewer();
	document.getElementById("obj").onExternalPreviewPlayerPublish();
}

/**
 * importer
 */
class AssetImporter {
	constructor(importer) {
		this.importer = importer;
		this.queue = importer.find("#importer-queue");
		this.config = { maxsize: false };
		this.initialize();
	}
	initialize() {
		this.importer.find("#importer-files").on("input", event => {
			//uploads every file
			var fileUpload = document.getElementById("importer-files");
			for (var i = 0; i < fileUpload.files.length; i++) {
				this.addFiles(fileUpload.files[i]);
			}
		});
		this.importer.on("dragover", event => {
			event.preventDefault();
			event.stopPropagation();
		});
		this.importer.on("dragenter", event => {
			event.preventDefault();
			event.stopPropagation();
		})
		this.importer.on("drop", event => {
			event.preventDefault();
			event.stopPropagation();
			const files = event.originalEvent.dataTransfer.files;
			for (var i = 0; i < files.length; i++) {
				this.addFiles(files[i]);
			}
		})
	}
	addFiles(file) { //adds a file to the queue
		const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
		const maxsize = this.config.maxsize;
		if (maxsize && file.size > maxsize) return; // check if file is too large
		let validFileType = false;
		let el;
		switch (ext) {
			case "mp3":
			case "wav": {
				validFileType = true;
				el = $(`
					<div class="importer_asset">
						<div class="asset_metadata">
							<img class="asset_preview" src="/pages/img/importer/sound.png" />
							<div>
								<h4 contenteditable="true" class="asset_name">${file.name}</h4>
								<p class="asset_subtype">${filesize(file.size)} | Import as...</p>
							</div>
						</div>
						<div class="import_as">
							<a href="#" type="bgmusic">Music</a>
							<a href="#" type="soundeffect">Sound effect</a>
							<a href="#" type="voiceover">Voiceover</a>
							<a href="#" action="cancel">Cancel</a>
						</div>
					</div>
				`.trim()).appendTo(this.queue);
				break;
			}
			case "swf":
			case "gif":
			case "jpg":
			case "png": {
				validFileType = true;
				el = $(`
					<div class="importer_asset">
						<div class="asset_metadata">
							<img class="asset_preview" src="/pages/img/importer/image.png" />
							<div>
								<h4 contenteditable="true" class="asset_name">${file.name}</h4>
								<p class="asset_subtype">${filesize(file.size)} | Import as...</p>
							</div>
						</div>
						<div class="import_as">
							<a href="#" type="bg">Background</a>
							<a href="#" type="prop">Prop</a>
							<a href="#" action="cancel">Cancel</a>
						</div>
					</div>
				`.trim()).appendTo(this.queue);
				break;
			}
			case "mp4": {
				validFileType = true;
				el = $(`
					<div class="importer_asset">
						<div class="asset_metadata">
							<img class="asset_preview" src="/pages/img/importer/video.png" />
							<div>
								<h4 contenteditable="true" class="asset_name">${file.name}</h4>
								<p class="asset_subtype">${filesize(file.size)} | Video</p>
							</div>
						</div>
						<div class="import_as">
							<a href="#" type="video">Import</a>
							<a href="#" action="cancel">Cancel</a>
						</div>
					</div>
				`.trim()).appendTo(this.queue);
				break;
			}
		}
		if (!validFileType) {
			console.error("Invalid file type!");
			return;
		}
		const request = new ImporterFile(file, el, ext);
	}
}
class ImporterFile {
	constructor(file, element, ext) {
		this.file = file;
		this.el = element;
		this.ext = ext;
		this.initialize();
	}
	initialize() {
		this.el.find("[type]").on("click", async event => {
			const el = $(event.target);
			const type = el.attr("type");
			Object.assign(this, this.typeFickser(type));

			if (this.type == "prop" && this.subtype != "video") {
				// wait for the prop type to be selected
				await new Promise((resolve, reject) => {
					this.el.find(".import_as").html(`
						<a href='#' ptype='holdable'>Handheld</a>
						<a href='#' ptype='wearable'>Headgear</a>
						<a href='#' ptype='placeable'>Other Prop</a>
						<a href="#" action="cancel">Close</a>
					`.trim());
					this.el.on("click", "[ptype]", event => {
						const el = $(event.target);
						this.ptype = el.attr("ptype");
						resolve();
					});
				});
			}

			// get the title
			let name = this.el.find(".asset_name").text();
			this.upload(name);
		});
		this.el.on("click", "[action]", event => {
			const el = $(event.target);
			const action = el.attr("action");

			switch (action) {
				case "add-to-scene": {
					studio[0].importerAddAsset(this.type, this.id);
					break;
				} case "cancel": {
					this.el.fadeOut(() => this.el.remove());
					break;
				}
			}
		});
	}
	typeFickser(type) {
		switch (type) {
			case "bgmusic":
			case "soundeffect":
			case "voiceover": {
				return { type: "sound", subtype: type };
			} case "video": {
				return { type: "prop", subtype: type };
			} default: {
				return { type: type, subtype: 0 };
			}
		}
	}
	upload(passedname) {
		let name = passedname;
		if (name == "")
			name = "unnamed" + Math.random().toString().substring(2, 8);

		// set the importer icon
		studio[0].importerStatus("processing");

		let b = new FormData();
		b.append("import", this.file);
		b.append("name", name)
		b.append("type", this.type);
		b.append("subtype", this.subtype);
		b.append("ptype", this.ptype || "");
		$.ajax({
			url: "/api/asset/upload",
			method: "POST",
			data: b,
			processData: false,
			contentType: false,
			dataType: "json"
		})
			.done(d => {
				if (d.status == "ok") {
					this.id = d.data.file;

					// why
					const importType = this.subtype == "video" ? "video" : this.type;
					const thumbUrl = `${window.location.origin}/assets/${d.data.file.slice(0, -3) + "png"}`;
					d.data.thumbnail = thumbUrl;

					// alert the studio
					studio[0].importerStatus("done");
					studio[0].importerUploadComplete(importType, d.data.file, d.data);

					// update html for images
					if (this.subtype == 0) {
						if (this.ext != "swf") 
							this.el.find("img").attr("src", `/assets/${d.data.file}`);
						// change the subtypes to an add to scene button
						this.el.find(".import_as").html(`
							<a href='#' action='add-to-scene'>Add to scene</a>
							<a href="#" action="cancel">Close</a>
						`.trim());
						return;
					}
				} else alert("Error importing asset.");
				// remove element
				this.el.fadeOut(() => this.el.remove());
			})
			.catch(e => console.error("Import failed. Error:", e))
	}
}
