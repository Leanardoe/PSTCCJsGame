const fs = require('fs');
const path = require('path');

const audioDirectory = 'audio';
const sfxDirectory = path.join(audioDirectory, 'sfx');
const tracksDirectory = path.join(audioDirectory, 'tracks');
const manifest = {};
const relativePathPrefix = '../../../../../resource/audio/';

// Read SFX files
fs.readdirSync(sfxDirectory).forEach(file => {
  const key = path.basename(file, path.extname(file)); // Remove file extension
  manifest[key] = relativePathPrefix + `sfx/${file}`;
});

// Read tracks files
fs.readdirSync(tracksDirectory).forEach(file => {
  const key = path.basename(file, path.extname(file)); // Remove file extension
  manifest[key] = relativePathPrefix + `tracks/${file}`;
});

// Write the manifest to a JSON file
fs.writeFileSync('sounds.json', JSON.stringify(manifest, null, 2));