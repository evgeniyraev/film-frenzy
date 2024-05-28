const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const path = require('path');
const storage = require('electron-json-storage');
const os = require('os');

let selectImage = document.getElementById('select-image');
let selectVideo = document.getElementById('select-video');
let selectSeconds = document.getElementById('seconds');

selectImage.addEventListener('change', function(e) {
  if (e.target.files[0]) {
    let files = e.target.files

    for (let i = 0; i < files.length; i++) {
      let file = files[i].path;
      if (images.includes(file) == false) {
        images.push(file)
      } 
    }

    displayMedia()
  }
});
document.getElementById('remove-all-images').addEventListener("click", () => {
  images = []
  displayMedia()
})

selectVideo.addEventListener('change', function(e) {
  if (e.target.files[0]) {
    let files = e.target.files

    for (let i = 0; i < files.length; i++) {
      video = files[i].path;
    }

    displayMedia()
  }
});
selectSeconds.addEventListener('change', function (e) {
  seconds = e.target.value || 30
});

let images = [];
let video = null;
let seconds = 30;
selectSeconds.value = seconds;

document.getElementById('save').addEventListener('click', () => {
  const media = {
    images,
    video,
    seconds,
  };

  ipcRenderer.send('save-media', media);
});

function loadMedia() {
  storage.setDataPath(os.tmpdir());
  let media = storage.getSync('config');

  images = media.images || [];
  video = media.video
  seconds = media.seconds
  displayMedia(media);
}

function displayMedia() {
  const imageDisplay = document.getElementById('image-display');
  imageDisplay.innerHTML = '';
  const videoDisplay = document.getElementById('video-display');
  videoDisplay.innerHTML = '';


  images.forEach(element => {
    const div = document.createElement("div")
    div.classList.add('item');

    const img = document.createElement("img")
    img.src = element

    const remove = document.createElement("button")
    remove.innerHTML = "remove"
    remove.addEventListener("click", () => {
      images = images.filter((image) => {
        return image != element
      })
      imageDisplay.removeChild(div);
    })
    div.appendChild(img)
    div.appendChild(remove)

    imageDisplay.appendChild(div);
  });

  if (video) {
    const div = document.createElement("div")
    div.classList.add('item');

    const v = document.createElement("video")
    v.src = video
    v.controls = true;

    const remove = document.createElement("button")
    remove.innerHTML = "remove"
    remove.addEventListener("click", () => {
      video = null
      videoDisplay.removeChild(div);
    })
    div.appendChild(v)
    div.appendChild(remove)

    videoDisplay.appendChild(div);
  }
  
  selectSeconds.value = seconds
}

loadMedia();