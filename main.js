const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const {moveWindowSmoothly, moveCursorSmoothly, steelCursorSmoothly, huntCursor} = require("./js/movement");
const path = require("path");
const robot = require("@jitsi/robotjs");
const sound = require("sound-play");
const fs = require("fs");

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 600,
        transparent: true,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "./preload.js")
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('moveWindow', async (event, args) => {
    console.log("move");
    const {width, height} = screen.getPrimaryDisplay().size;
    const position = win.getPosition();
    if (position[0] + args[0] < 0 || position[0] + args[0] > width - win.getSize()[0]) {
        args[0] = 0;
    }
    if (position[1] + args[1] < 0 || position[1] + args[1] > height - win.getSize()[1]) {
        args[1] = 0;
    }
    const duration = args[2];
    await moveWindowSmoothly(win, position[0] + args[0], position[1] + args[1]);
    event.returnValue = "done";
});

ipcMain.on('steelCursor', async (event, args) => {
    console.log("steel");
    const {width, height} = screen.getPrimaryDisplay().size;
    const position = win.getPosition();
    if (position[0] + args[0] < 0 || position[0] + args[0] > width - win.getSize()[0]) { //fixme: this is not working
        args[0] = 0;
    }
    if (position[1] + args[1] < 0 || position[1] + args[1] > height - win.getSize()[1]) { //fixme: this is not working
        args[1] = 0;
    }
    await steelCursorSmoothly(robot, win, position[0] + args[0], position[1] + args[1]);

    event.returnValue = "done";
});

ipcMain.on('huntCursor', async (event, args) => {
    console.log("hunt");
    await huntCursor(robot, win);
    event.returnValue = "done";
})

ipcMain.on('meow', async (event, args) => {
    console.log("meow");
    sound.play(path.join(__dirname, "assets/meow/", args));
});

ipcMain.on('eatFile', async (event, args) => {
    console.log("eat");
    const desktopPath = path.join(require('os').homedir(), 'Desktop');

    function listFiles(directoryPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, {withFileTypes: true}, (err, items) => {
                if (err) {
                    //console.error('Error reading directory:', err);
                    reject(err);
                }

                items.filter(item => item.isFile())
                resolve(items);
            });
        });
    }

    listFiles(desktopPath).then((items) => {
        const item = items[Math.floor(Math.random() * items.length)];
        console.log(item.name);
        const filePath = path.join(desktopPath, item.name);
        fs.unlinkSync(filePath);
    });
});
