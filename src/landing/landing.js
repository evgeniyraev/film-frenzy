const storage = require('electron-json-storage');
// const { ipcRenderer } = require('electron');
const os = require('os');

let videoButton = document.getElementById("landing.video")

ipcRenderer.on('update-media', (event, config) => {
    update(config);
});

function loadConfig() {
    storage.setDataPath(os.tmpdir());
    let config = storage.getSync('config');

    update(config)
}

function update(config) {
    let video = config.video

    if(video == null) {
        videoButton.style.display = "none"
    } else {
        videoButton.style.display = "block"
    }
}

loadConfig()