const { app, BrowserWindow, screen, ipcMain } = require('electron');
const {moveWindowSmoothly, moveCursorSmoothly} = require("./js/movement");
const path = require("path");
const robot = require("@jitsi/robotjs");

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 200,
        height: 200,
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
    //win.webContents.openDevTools();
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

ipcMain.on('moveWindow', (event, args) => {
    const {width, height} = screen.getPrimaryDisplay().size;
    const position = win.getPosition();
    if(position[0]+args[0] < 0 || position[0]+args[0] > width-win.getSize()[0]) {
        args[0] = 0;
    }
    if(position[1]+args[1] < 0 || position[1]+args[1] > width-win.getSize()[1]){
        args[1] = 0;
    }
    const duration = args[2];
    moveWindowSmoothly(win, position[0]+args[0], position[1]+args[1],duration);
});

ipcMain.on('steelCursor', (event, args) => {
    const {width, height} = screen.getPrimaryDisplay().size;
    const position = win.getPosition();
    if(position[0]+args[0] < 0 || position[0]+args[0] > width-win.getSize()[0]) {
        args[0] = 0;
    }
    if(position[1]+args[1] < 0 || position[1]+args[1] > width-win.getSize()[1]){
        args[1] = 0;
    }
    const duration = Math.round(Math.sqrt(Math.pow(args[0], 2) + Math.pow(args[1], 2))/148*1000);
    moveWindowSmoothly(win, position[0]+args[0], position[1]+args[1],duration);
    moveCursorSmoothly(robot, position[0]+args[0], position[1]+args[1], duration);
});


