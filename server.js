// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static public folder
app.use(express.static(path.join(__dirname, "public")));

// Simple SSR route for playlist/:id
// We'll use iTunes Search API to fetch a few tracks server-side
app.get("/playlist/:term", async (req, res) => {
  try {
    const term = encodeURIComponent(req.params.term);
    const itunesUrl = `https://itunes.apple.com/search?term=${term}&entity=song&limit=6`;
    const response = await fetch(itunesUrl);
    const data = await response.json();

    // Build simple HTML (SSR)
    const tracksHtml = (data.results || [])
      .map(
        (t, i) => `
      <li class="track">
        <img src="${t.artworkUrl60}" alt="${t.trackName}" />
        <div>
          <strong>${t.trackName}</strong><br/>
          <small>${t.artistName}</small>
          <div><audio controls src="${t.previewUrl}"></audio></div>
        </div>
      </li>`
      )
      .join("");

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>Playlist ${req.params.term} - Musicfy</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <header class="cba-header">
          <img src="/images/logo.png" alt="logo" class="cba-header__logo" />
          <h1>Musicfy</h1>
        </header>
        <main class="container">
          <h2>Playlist: ${req.params.term}</h2>
          <ul class="tracks">${tracksHtml || "<li>No results</li>"}</ul>
          <p><a href="/">Volver a Home</a></p>
        </main>
        <script src="/js/main.js"></script>
      </body>
    </html>`;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching playlist");
  }
});

// fallback - serve index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
