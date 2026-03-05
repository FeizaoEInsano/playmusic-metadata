const express = require('express');
const express = require('express');
const icy = require('icy');

const app = express();
const PORT = process.env.PORT || 3000;
const STREAM_URL = "https://stream.zeno.fm/9y6f68ssq0hvv";

let currentTitle = "Cargando...";

function connectToStream() {
    icy.get(STREAM_URL, function (response) {

        response.on('metadata', function (metadata) {
            const parsed = icy.parse(metadata);
            const title = parsed.StreamTitle;

            if (title && title !== currentTitle) {
                console.log("Now Playing:", title);
                currentTitle = title;
            }
        });

        response.on('error', function () {
            console.log("Stream error. Reconnecting in 10s...");
            setTimeout(connectToStream, 10000);
        });
    }).on('error', function () {
        console.log("Connection failed. Reconnecting in 10s...");
        setTimeout(connectToStream, 10000);
    });
}

// Conectarse una sola vez al iniciar
connectToStream();

app.get('/nowplaying', (req, res) => {
    res.json({ title: currentTitle });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
