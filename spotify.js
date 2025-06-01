// spotify.js
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

let accessToken = null;

// 1) Helper: get a fresh access token (Client Credentials Flow)
async function getAccessToken() {
  if (accessToken) return accessToken;

  const res = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': 'Basic ' +
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

// 2) Main: fetchPlaylist now checks for change before saving
async function fetchPlaylist(playlistId) {
  // a) Ensure we have a token
  if (!accessToken) await getAccessToken();

  // b) Call Spotify’s “Get Playlist” endpoint
  const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { description: newDescription, images, name } = res.data;
  const imageUrl = images[0]?.url || null; // could be null if no image

  // c) Prepare a place to store snapshots
  const folder = path.join(__dirname, 'data', playlistId);
  await fs.ensureDir(folder);

  // d) Look at the most‐recent saved description (if any)
  //    Find the latest “*-description.txt” file inside that folder
  const existingFiles = await fs.readdir(folder);
  const descFiles = existingFiles
    .filter(f => f.endsWith('-description.txt'))
    .sort(); 
  // After sorting lexically, the last filename usually has the newest timestamp,
  // assuming your filenames are “YYYY-MM-DDTHH-mm-ss-description.txt”.

  let lastDescription = '';
  let lastImageFile = null;

  if (descFiles.length > 0) {
    // Read the contents of the most recent description file
    const latestDescFile = descFiles[descFiles.length - 1];
    lastDescription = await fs.readFile(path.join(folder, latestDescFile), 'utf8');
  }

  // e) Compare newDescription to lastDescription, and also check if image changed
  //    We’ll also keep track of the last saved image URL in a side‐file or by inspecting filenames:
  const imageFiles = existingFiles
    .filter(f => f.endsWith('-image.jpg'))
    .sort();
  if (imageFiles.length > 0) {
    // If a previously saved snapshot exists, just grab its filename
    lastImageFile = imageFiles[imageFiles.length - 1];
  }

  // If **both** description and image are unchanged, skip saving anything
  const imageUnchanged =
    lastImageFile &&
    imageUrl &&
    lastImageFile.startsWith(
      // The timestamp portion of lastImageFile: e.g. "2025-06-01T14-00-00-image.jpg"
      lastImageFile.split('-image.jpg')[0]
    ) &&
    // A quick but imperfect check: if the **URL** is identical to the last saved URL,
    // we assume image hasn’t changed. Alternatively, you could hash the downloaded bytes.
    imageUrl === res.data.images[0]?.url;

  // _Note_: Because we can't store the URL string directly in a file, the above check for
  // imageUnchanged is a heuristic: if the new imageUrl matches what we fetched now,
  // and the last saved image’s filename timestamp was from a previous run, we know it’s the same.
  // If you want a bulletproof check, you could store the last URL in a tiny “meta.json” and compare against that.

  if (newDescription === lastDescription && imageUnchanged) {
    // No change detected → do nothing
    return { name, description: newDescription, imageUrl };
  }

  // f) Otherwise, we need to save a new snapshot
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); 
  // e.g. "2025-06-02T15-10-45.123Z".replace(/[:.]/g,'-')
  // → "2025-06-02T15-10-45-123Z"

  // (1) Save the new description text
  const descFilename = `${timestamp}-description.txt`;
  await fs.writeFile(path.join(folder, descFilename), newDescription || '');

  // (2) Download and save the new image (if it exists)
  if (imageUrl) {
    const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imgFilename = `${timestamp}-image.jpg`;
    await fs.writeFile(path.join(folder, imgFilename), imgRes.data);
  }

  return { name, description: newDescription, imageUrl };
}

module.exports = { fetchPlaylist };
