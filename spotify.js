// spotify.js

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// We assume `process.env.SPOTIFY_CLIENT_ID` and `process.env.SPOTIFY_CLIENT_SECRET`
// are set as GitHub Secrets.  GitHub Actions will inject them.

let accessToken = null;

async function getAccessToken() {
  if (accessToken) return accessToken;
  const resp = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  accessToken = resp.data.access_token;
  return accessToken;
}

// This function will be called by update.js
// It ensures a new snapshot is only saved if description or image changed.
async function fetchAndSaveSnapshot(playlistId) {
  if (!accessToken) {
    await getAccessToken();
  }

  const resp = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const { description: newDescription, images, name } = resp.data;
  const imageUrl = images[0]?.url || null;

  // Ensure data/<playlistId> exists
  const folder = path.join(__dirname, 'data', playlistId);
  await fs.ensureDir(folder);

  // Check existing description files
  const existing = await fs.readdir(folder);
  const descFiles = existing.filter((f) => f.endsWith('-description.txt')).sort();
  let lastDescription = '';
  let lastImageFile = null;

  if (descFiles.length) {
    const lastDesc = descFiles[descFiles.length - 1];
    lastDescription = await fs.readFile(path.join(folder, lastDesc), 'utf8');
  }

  const imageFiles = existing.filter((f) => f.endsWith('-image.jpg')).sort();
  if (imageFiles.length) {
    lastImageFile = imageFiles[imageFiles.length - 1];
  }

  // If nothing changed, do nothing
  const imageUnchanged =
    lastImageFile &&
    imageUrl &&
    imageUrl === images[0]?.url; // simple URL‐compare heuristic

  if (newDescription === lastDescription && imageUnchanged) {
    // No change → skip writing
    return false;
  }

  // Something changed, so write a new snapshot
  // Filename timestamp: "YYYY‐MM‐DDTHH‐mm‐ss‐SSSZ"
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  // e.g. "2025-06-02T15-10-45.123Z".replace(/[:.]/g,'-')
  // → "2025-06-02T15-10-45-123Z"

  // 1) Write description text
  const descFilename = `${timestamp}-description.txt`;
  await fs.writeFile(path.join(folder, descFilename), newDescription || '');

  // 2) Download & write image
  if (imageUrl) {
    const imgResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imgFilename = `${timestamp}-image.jpg`;
    await fs.writeFile(path.join(folder, imgFilename), imgResp.data);
  }

  return true;
}

module.exports = { fetchAndSaveSnapshot };
