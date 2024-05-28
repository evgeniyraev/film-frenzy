const { ipcRenderer } = require('electron');
const fs = require('fs');
const storage = require('electron-json-storage');
const os = require('os');



document.getElementById('open-settings').addEventListener('click', () => {
  ipcRenderer.send('open-settings');
});

ipcRenderer.on('update-media', (event, media) => {
  displayMedia(media);
});

function loadTranslations() {
  const media = JSON.parse(fs.readFileSync('translations.json'));
  // displayMedia(media);
}

function loadMedia() {
  storage.setDataPath(os.tmpdir());
  let media = storage.getSync('config');

  console.log(media)

  displayMedia(media);
}

function displayMedia(media) {
  const mediaDisplay = document.getElementById('media-display');
  mediaDisplay.innerHTML = '';
  
  if (media.image) {
    const img = document.createElement('img');
    img.src = media.image;
    mediaDisplay.appendChild(img);
  }
  
  if (media.video) {
    const video = document.createElement('video');
    video.src = media.video;
    video.controls = true;
    mediaDisplay.appendChild(video);
  }
}

loadMedia();