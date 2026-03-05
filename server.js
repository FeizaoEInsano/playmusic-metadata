const express = require('express');
const EventSource = require('eventsource');

const app = express();
const PORT = process.env.PORT || 3000;

const MOUNT_ID = "9y6f68ssq0hvv";

let currentTitle = "Conectando...";

function connectToZeno() {
  const url = `https://api.zeno.fm/mounts/metadata/subscribe/${MOUNT_ID}`;
  const es = new EventSource(url);

  es.onmessage = function(event) {
    try {
      const data = JSON.parse(event.data);
      if (data.streamTitle) {
        currentTitle = data.streamTitle;
        console.log("Now Playing:", currentTitle);
      }
    } catch (err) {}
  };

  es.onerror = function(err) {
    console.log("Error en conexión SSE, reintentando...");
    es.close();
    setTimeout(connectToZeno, 5000);
  };
}

connectToZeno();

app.get('/nowplaying', (req, res) => {
  res.json({ title: currentTitle });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
