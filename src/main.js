const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url')
const storage = require('electron-json-storage');
const os = require('os');

let mainWindow;
let settingsWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "game", 'index.html'),
        protocol: 'file:',
        slashes: true
        
    }))

    mainWindow.webContents.on('did-finish-load', () => {
        //loadConfing()
    });

    // mainWindow.webContents.openDevTools()
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 400,
        height: 300,
        parent: mainWindow,
        modal: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, "settings", 'settings.html'),
        protocol: 'file:',
        slashes: true
    }))

    settingsWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        settingsWindow = null
    })
    
    // settingsWindow.webContents.openDevTools()

}

app.whenReady().then(() => {
    setupStorage()
    createMainWindow()
})

function setupStorage() {
    storage.setDataPath(os.tmpdir());
}

ipcMain.on('open-settings', () => {
    if (!settingsWindow) {
        createSettingsWindow();
    }
});

ipcMain.on('save-media', (event, media) => {
    storage.set('config', media, function (error) {
        if (error) throw error;
    });

    //fs.writeFileSync('media.json', JSON.stringify(media));
    mainWindow.webContents.send('update-media', media);
    settingsWindow.close();
    settingsWindow = null;
});
