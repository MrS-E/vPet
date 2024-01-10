const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const {moveWindowSmoothly, moveCursorSmoothly, steelCursorSmoothly, huntCursor} = require("./js/movement");
const path = require("path");
const robot = require("@jitsi/robotjs");
const sound = require("sound-play");
const fs = require("fs");

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 400,
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
ipcMain.handle("step", (event, args) =>{
    const {width, height} = screen.getPrimaryDisplay().size;
    const position = win.getPosition();
    const mouse = robot.getMousePos();
    if (position[0] + args[0] < 0 || position[0] + args[0] > width - win.getSize()[0]) {
        args[0] = 0;
    }
    if (position[1] + args[1] < 0 || position[1] + args[1] > height - win.getSize()[1]) {
        args[1] = 0;
    }
    win.setPosition(position[0] + args[0], position[1] + args[1]);
    return (win.getPosition()[0] < mouse.x && win.getPosition()[0] + win.getSize()[0] > mouse.x) && (win.getPosition()[1] < mouse.y && win.getPosition()[1] + win.getSize()[1] > mouse.y);
})

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

ipcMain.handle('eatFile', async (event, args) => {
    console.log("eat");
    let desktopPath = path.join(require('os').homedir(), 'Desktop');
    if (!fs.existsSync(desktopPath)){
        desktopPath = null;
        fs.readdirSync(require('os').homedir(), {withFileTypes: true})
            .filter(file=> file.isDirectory())
            .filter(file => {
                for(let d of ["Schreibtisch"]) if(file.name === d) desktopPath= path.join(require('os').homedir(), file.name);
            })
        //if(desktopPath===null) desktopPath = fs.readdirSync(require('os').homedir(), {withFileTypes: true}).filter(file=> file.isDirectory())[0]
        if(desktopPath===null) return "death";

    }
    console.log(desktopPath);
    function listFiles(directoryPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, {withFileTypes: true}, (err, items) => {
                if (err) {
                    //console.error('Error reading directory:', err);
                    reject(err);
                }
                resolve(items.filter(item => item.isFile()));
            });
        });
    }


    const items = await listFiles(desktopPath);
    if(items===null||items===undefined||items.length === 0) {
        console.log("-----------------------------------")
        console.log("death")
        console.log("-----------------------------------")
        return "death";
    }
    const item = items[Math.floor(Math.random() * items.length)];
    const filePath = path.join(desktopPath, item.name);
    fs.unlinkSync(filePath);
    return filePath;
});
