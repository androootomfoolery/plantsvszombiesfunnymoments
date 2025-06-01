// update.js

const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git');
const { fetchAndSaveSnapshot } = require('./spotify');

(async () => {
  try {
    // 1) Define your list of playlist IDs to track:
    const trackedPlaylists = ['7bGfzjckDQDDvAIMVe95jF'];
    // (You can add more IDs here or load from a file.)

    let wroteSomething = false;

    for (const playlistId of trackedPlaylists) {
      const changed = await fetchAndSaveSnapshot(playlistId);
      if (changed) {
        console.log(`Snapshot updated for ${playlistId}`);
        wroteSomething = true;
      } else {
        console.log(`No change for ${playlistId}`);
      }
    }

    // 2) Rebuild history.json (front‐end data)
    //    We’ll walk every data/<playlistId> folder and gather snapshots

    const dataDir = path.join(__dirname, 'data');
    const playlistDirs = await fs.readdir(dataDir).catch(() => []);
    const allPlaylists = [];

    for (const playlistId of playlistDirs) {
      const fullPath = path.join(dataDir, playlistId);
      if (!(await fs.stat(fullPath)).isDirectory()) continue;

      const files = await fs.readdir(fullPath);
      const snapshots = {};

      for (const file of files) {
        const match =
          file.match(/^(.+)-description\.txt$/) ||
          file.match(/^(.+)-image\.jpg$/);
        if (!match) continue;

        const raw = match[1]; // e.g. "2025-06-01T15-31-45-571Z"
        const fixedTimestamp = raw.replace(
          /T(\d{2})-(\d{2})-(\d{2})-(\d+)Z$/,
          'T$1:$2:$3.$4Z'
        );
        const dateObj = new Date(fixedTimestamp);
        if (isNaN(dateObj.getTime())) continue;

        const iso = dateObj.toISOString();
        const dateOnly = iso.split('T')[0];

        if (!snapshots[iso]) {
          snapshots[iso] = { timestamp: iso, date: dateOnly, playlistId };
        }

        if (file.endsWith('-description.txt')) {
          snapshots[iso].description = await fs.readFile(
            path.join(fullPath, file),
            'utf8'
          );
        } else if (file.endsWith('-image.jpg')) {
          snapshots[iso].imageUrl = `/data/${playlistId}/${file}`;
        }
      }

      const sorted = Object.values(snapshots).sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      allPlaylists.push({ playlistId, name: `Playlist ${playlistId}`, snapshots: sorted });
    }

    // Write top‐level history.json
    await fs.writeJSON(path.join(__dirname, 'history.json'), allPlaylists, { spaces: 2 });
    console.log('Rebuilt history.json');

    // 3) If new files were written, commit & push
    if (wroteSomething) {
      const git = simpleGit();
      await git.add(['data/**', 'history.json']);
      await git.commit('🗂️ Auto‐update snapshots via GitHub Actions');
      await git.push('origin', 'main');
      console.log('Committed and pushed changes');
    } else {
      console.log('No new snapshots to commit');
    }
  } catch (err) {
    console.error('❌ update.js failed:', err);
    process.exit(1);
  }
})();
