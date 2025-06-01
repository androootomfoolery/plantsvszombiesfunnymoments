// server.js

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { fetchPlaylist } = require('./spotify'); // your change-detecting helper

const app = express();
const PORT = 4000; // or change to 3000 if you free that port

// ─── 1. PLAYLISTS TO POLL ───────────────────────────────────────────────────────
const trackedPlaylists = [
  '7bGfzjckDQDDvAIMVe95jF',
  // add more playlist IDs here as needed
];

// ─── 2. AUTO‐POLLING FUNCTION ───────────────────────────────────────────────────
async function autoUpdateAllPlaylists() {
  console.log(`[${new Date().toLocaleTimeString()}] Polling for changes…`);
  for (const playlistId of trackedPlaylists) {
    try {
      await fetchPlaylist(playlistId);
      console.log(`   🎯 Fetched ${playlistId} → saved only if changed.`);
    } catch (err) {
      console.error(`   ⚠️ Error polling ${playlistId}:`, err.message);
    }
  }
}

// ─── 3. STATIC FILE SERVING ─────────────────────────────────────────────────────
// Serve index.html (and any other static files) from project root
app.use(express.static(path.join(__dirname)));

// Serve images from data/<playlistId> at /images/<playlistId>
app.use('/images', express.static(path.join(__dirname, 'data')));

// ─── 4. OPTIONAL MANUAL SNAPSHOT ENDPOINT ───────────────────────────────────────
app.get('/track/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId;
  console.log(`▶️  Manual /track request for: ${playlistId}`);
  try {
    const result = await fetchPlaylist(playlistId);
    console.log('✅ Manual snapshot done');
    res.json({ message: 'Snapshot saved (if changed)', data: result });
  } catch (err) {
    console.error('❌ Manual snapshot failed:', err);
    res.status(500).json({ error: 'Failed to fetch playlist', details: err.message });
  }
});

// ─── 5. “/api/history” ENDPOINT ─────────────────────────────────────────────────
app.get('/api/history', async (req, res) => {
  const dataDir = path.join(__dirname, 'data');

  try {
    // 5a) List subfolders under /data (each named by a playlist ID)
    const playlistDirsRaw = await fs.readdir(dataDir).catch(() => []);
    const playlistDirs = [];
    for (const name of playlistDirsRaw) {
      const fullPath = path.join(dataDir, name);
      if ((await fs.stat(fullPath)).isDirectory()) {
        playlistDirs.push(name);
      }
    }

    // 5b) For each playlist folder, read its snapshot files
    const allPlaylists = await Promise.all(
      playlistDirs.map(async (playlistId) => {
        const playlistPath = path.join(dataDir, playlistId);
        const files = await fs.readdir(playlistPath);

        const snapshots = {};

        for (const file of files) {
          const match =
            file.match(/^(.+)-description\.txt$/) ||
            file.match(/^(.+)-image\.jpg$/);
          if (!match) continue;

          const raw = match[1]; // e.g. "2025-06-01T15-31-45-571Z"

          // Convert "YYYY-MM-DDTHH-mm-ss-SSSZ" → "YYYY-MM-DDTHH:mm:ss.SSSZ"
          const fixedTimestamp = raw.replace(
            /T(\d{2})-(\d{2})-(\d{2})-(\d+)Z$/,
            'T$1:$2:$3.$4Z'
          );
          const parsedDate = new Date(fixedTimestamp);
          if (isNaN(parsedDate.getTime())) continue;

          const timestamp = parsedDate.toISOString(); // "2025-06-01T15:31:45.571Z"
          const dateOnly = timestamp.split('T')[0];   // "2025-06-01"

          if (!snapshots[timestamp]) {
            snapshots[timestamp] = {
              timestamp,
              date: dateOnly,
              playlistId,
            };
          }

          if (file.endsWith('-description.txt')) {
            snapshots[timestamp].description = await fs.readFile(
              path.join(playlistPath, file),
              'utf8'
            );
          } else if (file.endsWith('-image.jpg')) {
            snapshots[timestamp].imageUrl = `/images/${playlistId}/${file}`;
          }
        }

        const sortedSnapshots = Object.values(snapshots).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        return {
          name: `Playlist ${playlistId}`,
          snapshots: sortedSnapshots,
        };
      })
    );

    res.json(allPlaylists);
  } catch (err) {
    console.error('Error reading snapshot history:', err);
    res.status(500).json({ error: 'Failed to read snapshot history' });
  }
});

// ─── 6. SERVE index.html ON “/” ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── 7. START SERVER & BEGIN POLLING ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  autoUpdateAllPlaylists();                  // initial fetch at startup
  setInterval(autoUpdateAllPlaylists, 5 * 60 * 1000); // every 5 minutes
});