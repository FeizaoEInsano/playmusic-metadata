const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const MOUNT_ID = "9y6f68ssq0hvv";

let currentTitle = "Cargando...";

async function connectToZeno() {
  const url = `https://api.zeno.fm/mounts/metadata/subscribe/${MOUNT_ID}`;
  const response = await fetch(url);

  response.body.on('data', chunk => {
    const text = chunk.toString();
    const match = text.match(/streamTitle":"([^"]+)"/);

    if (match && match[1]) {
      currentTitle = match[1];
      console.log("Now Playing:", currentTitle);
    }
  });
}

connectToZeno();

app.get('/nowplaying', (req, res) => {
  res.json({ title: currentTitle });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
