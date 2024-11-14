const storage = require('electron-json-storage');
const { ipcRenderer } = require('electron');
const os = require('os');

const searchParams = new URLSearchParams(document.location.search);

let map = [
    "win",
]

let total = searchParams.get("total") >> 0
let found = searchParams.get("found") >> 0
let left = total - found
let index = left
let endName = map[index] || "lose"

console.log(left, total, endName)

let result = document.getElementById("result")
result.classList.add(endName)

let videoButton = document.getElementById("end.video")

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

    console.log("test")

    if(video == null) {
        videoButton.style.display = "none"
    } else {
        videoButton.style.display = "block"
    }
}

loadConfig()