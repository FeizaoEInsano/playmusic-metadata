const express = require('express');
const icy = require('icy');

const app = express();
const PORT = process.env.PORT || 3000;
const STREAM_URL = "https://stream.zeno.fm/9y6f68ssq0hvv";

let currentTitle = "Conectando...";

function connectToStream() {
    const req = icy.get(STREAM_URL, {
        headers: { "Icy-MetaData": "1" }
    }, function (response) {

        response.on('metadata', function (metadata) {
            const parsed = icy.parse(metadata);
            const title = parsed.StreamTitle;

            if (title) {
                console.log("Now Playing:", title);
                currentTitle = title;
            }
        });

        response.on('end', function () {
            console.log("Stream ended. Reconnecting...");
            setTimeout(connectToStream, 5000);
        });

        response.on('error', function () {
            console.log("Stream error. Reconnecting...");
            setTimeout(connectToStream, 5000);
        });
    });

    req.on('error', function () {
        console.log("Connection failed. Reconnecting...");
        setTimeout(connectToStream, 5000);
    });
}

connectToStream();

app.get('/nowplaying', (req, res) => {
    res.json({ title: currentTitle });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
