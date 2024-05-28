const storage = require('electron-json-storage');
const os = require('os');

let video = null;

function loadMedia() {
  storage.setDataPath(os.tmpdir());
  let media = storage.getSync('config');

  video = media.video
  displayMedia();
}

function displayMedia() {
  let videoElement = document.getElementsByTagName("video")[0]
  
  videoElement.src = video

  videoElement.addEventListener("click",  (event) => {
    event.preventDefault()

    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
    
  });
}

loadMedia()