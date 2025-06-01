// spotify.js

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

let accessToken = null;

async function getAccessToken() {
  if (accessToken) return accessToken;
  const res = await axios.post(
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
  accessToken = res.data.access_token;
  return accessToken;
}

async function fetchAndSaveSnapshot(playlistId) {
  if (!accessToken) await getAccessToken();

  // 1) Fetch the playlist from Spotify
  const resp = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Extract the real name from the API response:
  const realName = resp.data.name;              
  const newDescription = resp.data.description || '';
  const imageUrl = resp.data.images[0]?.url || null;

  // 2) Ensure the folder data/<playlistId> exists
  const folder = path.join(__dirname, 'data', playlistId);
  await fs.ensureDir(folder);

  // 3) Find the most recent description file (to compare)
  const existing = await fs.readdir(folder);
  const descFiles = existing.filter(f => f.endsWith('-description.txt')).sort();

  let lastDescription = '';
  if (descFiles.length) {
    lastDescription = await fs.readFile(path.join(folder, descFiles.pop()), 'utf8');
  }

  // 4) Compare description and image
  const imageFiles = existing.filter(f => f.endsWith('-image.jpg')).sort();
  let lastImageFile = imageFiles.length ? imageFiles.pop() : null;
  const imageUnchanged =
    lastImageFile && imageUrl && imageUrl === resp.data.images[0].url;

  if (newDescription === lastDescription && imageUnchanged) {
    // Nothing changed → return { changed: false, name: realName }
    return { changed: false, name: realName };
  }

  // 5) Something changed → write new snapshot files
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await fs.writeFile(path.join(folder, `${timestamp}-description.txt`), newDescription);

  if (imageUrl) {
    const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(path.join(folder, `${timestamp}-image.jpg`), imgRes.data);
  }

  return { changed: true, name: realName };
}

module.exports = { fetchAndSaveSnapshot };