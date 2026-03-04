const express = require('express');
const icy = require('icy');
const app = express();

const STREAM_URL = "https://stream.zeno.fm/9y6f68ssq0hvv";
const PORT = process.env.PORT || 3000;

app.get('/nowplaying', (req, res) => {
    icy.get(STREAM_URL, function (response) {
        response.on('metadata', function (metadata) {
            const parsed = icy.parse(metadata);
            const title = parsed.StreamTitle || "";
            res.json({ title: title });
            response.destroy();
        });

        response.on('error', () => {
            res.json({ title: "" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
