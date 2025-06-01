// update.js

/**
 * This script is intended to run inside a GitHub Actions workflow on a schedule.
 * It will:
 *   1. Fetch the latest playlist metadata from Spotify for each playlist ID.
 *   2. Compare the description and cover image URL against the most recent snapshot on disk.
 *   3. If there’s a change, write a new timestamped description file and image JPG under data/<playlistId>/.
 *   4. Rebuild history.json (including the real Spotify playlist name and relative image URLs).
 *   5. If any new snapshots were created, commit and push data/ and history.json back to the repo.
 */

const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git');
const { fetchAndSaveSnapshot } = require('./spotify');

// List all playlist IDs you want to track here
const trackedPlaylists = [
  '7bGfzjckDQDDvAIMVe95jF',
  // Add more public playlist IDs if desired
];

(async () => {
  try {
    let wroteSomething = false;
    // Map from playlistId -> real Spotify name (resp.data.name)
    const nameMap = {};

    // 1) Iterate through each playlist, fetch from Spotify, and save a new snapshot if needed
    for (const playlistId of trackedPlaylists) {
      // fetchAndSaveSnapshot returns: { changed: boolean, name: string }
      const { changed, name } = await fetchAndSaveSnapshot(playlistId);
      // Store the real name into our map
      nameMap[playlistId] = name;

      if (changed) {
        console.log(`🔄 Snapshot updated for ${playlistId} (“${name}”)`);
        wroteSomething = true;
      } else {
        console.log(`✅ No change for ${playlistId} (“${name}”)`);
      }
    }

    // 2) Rebuild history.json by walking data/<playlistId> folders
    const dataDir = path.join(__dirname, 'data');
    // Ensure dataDir exists (it should, because fetchAndSaveSnapshot ensures each subfolder)
    await fs.ensureDir(dataDir);

    const playlistDirs = await fs.readdir(dataDir).catch(() => []);
    const allPlaylists = [];

    for (const playlistId of playlistDirs) {
      const playlistPath = path.join(dataDir, playlistId);
      if (!(await fs.stat(playlistPath)).isDirectory()) {
        continue;
      }

      const files = await fs.readdir(playlistPath);
      const snapshots = {};

      for (const file of files) {
        // Match either "<timestamp>-description.txt" or "<timestamp>-image.jpg"
        const descMatch = file.match(/^(.+)-description\.txt$/);
        const imgMatch = file.match(/^(.+)-image\.jpg$/);
        if (!descMatch && !imgMatch) {
          continue;
        }

        // descMatch[1] or imgMatch[1] is the raw timestamp string (e.g. "2025-06-01T10-31-45-571Z")
        const raw = descMatch ? descMatch[1] : imgMatch[1];

        // Convert "YYYY-MM-DDTHH-mm-ss-SSSZ" → "YYYY-MM-DDTHH:mm:ss.SSSZ"
        const fixedTimestamp = raw.replace(
          /T(\d{2})-(\d{2})-(\d{2})-(\d+)Z$/,
          'T$1:$2:$3.$4Z'
        );
        const dateObj = new Date(fixedTimestamp);
        if (isNaN(dateObj.getTime())) {
          // skip any files that don’t parse to a valid date
          continue;
        }

        const iso = dateObj.toISOString();    // e.g. "2025-06-01T10:31:45.571Z"
        const dateOnly = iso.split('T')[0];   // e.g. "2025-06-01"

        if (!snapshots[iso]) {
          snapshots[iso] = {
            timestamp: iso,
            date: dateOnly,
            playlistId: playlistId,
          };
        }

        if (descMatch && file.endsWith('-description.txt')) {
          // Read the description text
          const descText = await fs.readFile(path.join(playlistPath, file), 'utf8');
          snapshots[iso].description = descText;
        } else if (imgMatch && file.endsWith('-image.jpg')) {
          // Build a relative URL (no leading slash) so GitHub Pages can serve it under /forE/data/...
          snapshots[iso].imageUrl = `data/${playlistId}/${file}`;
        }
      }

      // Convert snapshots object → sorted array (newest first)
      const sortedSnapshots = Object.values(snapshots).sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      allPlaylists.push({
        playlistId: playlistId,
        name: nameMap[playlistId] || playlistId,
        snapshots: sortedSnapshots,
      });
    }

    // Write the array to history.json in the repo root
    const historyPath = path.join(__dirname, 'history.json');
    await fs.writeJSON(historyPath, allPlaylists, { spaces: 2 });
    console.log('📄 Rebuilt history.json');

    // 3) If any playlist changed, commit data/ and history.json
    if (wroteSomething) {
      const git = simpleGit();
      // Stage everything under data/ and the updated history.json
      await git.add(['data/**', 'history.json']);
      await git.commit('🗂️ Auto-update snapshots via GitHub Actions');
      // Push to main branch
      await git.push('origin', 'main');
      console.log('✅ Committed and pushed changes');
    } else {
      console.log('ℹ️ No new snapshots to commit');
    }
  } catch (err) {
    console.error('❌ update.js failed:', err);
    process.exit(1);
  }
})();
