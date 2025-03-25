const express = require('express');  // Add express for serving the HTML file
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Create an express app
const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'wrapper/views')));

// Route to serve the exporter HTML page
app.get('/exporter', (req, res) => {
    res.sendFile(path.join(__dirname, 'wrapper/views/exporter.eta'));
});

// Route to handle MP4 conversion and download
app.get('/exporter/download', (req, res) => {
    const movieId = req.query.movieId;
    const inputPath = `_SAVED/${movieId}.xml`; // Source extension set to XML
    const outputPath = `_SAVED/${movieId}.mp4`;

    ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => {
            res.download(outputPath, `${movieId}.mp4`, (err) => {
                if (err) {
                    console.error('Error downloading the file:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    // Optionally, delete the file after download
                    fs.unlink(outputPath, (err) => {
                        if (err) {
                            console.error('Error deleting the file:', err);
                        }
                    });
                }
            });
        })
        .on('error', (err) => {
            console.error('Error converting the video:', err);
            res.status(500).send('Internal Server Error');
        })
        .run();
});

// Existing server logic
const http = require("http");
const static = require("node-static");
const formidable = require("formidable");

const functions = [
    // Existing route functions
    require("./asset/delete"),
    require("./asset/save"),
    require("./asset/load"),
    require("./asset/list"),
    require("./asset/meta"),
    require("./asset/thmb"),
    require("./character/redirect"),
    require("./character/premade"),
    require("./character/load"),
    require("./character/save"),
    require("./character/upload"),
    require("./starter/save"),
    require("./static/load"),
    require("./static/page"),
    require("./movie/delete"),
    require("./movie/load"),
    require("./movie/list"),
    require("./movie/meta"),
    require("./movie/redirect"),
    require("./movie/repair"),
    require("./movie/save"),
    require("./movie/thmb"),
    require("./theme/load"),
    require("./theme/list"),
    require("./tts/voices"),
    require("./tts/load"),
    require("./waveform/load"),
    require("./waveform/save")
];

module.exports = function () {
    const file = new static.Server("../server", { cache: 2 });
    http.createServer(async (req, res) => {
        try {
            const parsedUrl = require("url").parse(req.url, true);
            // parse post requests
            if (req.method == "POST") {
                await new Promise((resolve, reject) =>
                    new formidable.IncomingForm().parse(req, async (e, f, files) => {
                        req.body = f;
                        req.files = files;
                        resolve();
                    })
                );
            }
            // run each route function until the correct one is found
            let found = false;
            for (let i = 0; i < functions.length; i++) {
                const result = await functions[i](req, res, parsedUrl);
                if (result) {
                    found = true;
                    break;
                }
            }
            if (!found) { // page not found
                req.addListener("end", () =>
                    file.serve(req, res)
                ).resume();
                // don't log static files
                return;
            }
            // log every request
            console.log(req.method, parsedUrl.path);
        } catch (x) {
            console.error(x);
            res.statusCode = 404;
            res.end();
        }
    }).listen(process.env.SERVER_PORT, console.log("Cartoons has started."));
};