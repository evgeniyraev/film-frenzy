const { ipcRenderer } = require('electron');

document.getElementById('open-settings').addEventListener('mousedown', onSettingsStart);
document.getElementById('open-settings').addEventListener('mouseup', onSettingsEnd);

document.getElementById('kios-mode').addEventListener('mousedown', onKiosStart);
document.getElementById('kios-mode').addEventListener('mouseup', onKiosEnd);

let settingsTimer = null
let kioskTimer = null

function onSettingsStart() {
    if(settingsTimer == null) {
        settingsTimer = setTimeout(() => {
            openSettings()
            settingsTimer = null
        }, 5000)
    }
}

function onSettingsEnd() {
    clearTimeout(settingsTimer)
    settingsTimer = null
}

function openSettings() {
    ipcRenderer.send('open-settings');
}

function onKiosStart() {
    if(kioskTimer == null) {
        kioskTimer = setTimeout(() => {
            toggleKios()
            kioskTimer = null
        }, 5000)
    }
}

function onKiosEnd() {
    clearTimeout(kioskTimer)
    kioskTimer = null
}

function toggleKios() {
    ipcRenderer.send('toggle-kiosk');
}