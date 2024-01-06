const {contextBridge, ipcRenderer} = require("electron");
const sound = require("sound-play");
const fs = require("fs");
const {dialog} = require('electron').remote;

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
contextBridge.exposeInMainWorld("sound", sound);
contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("dialog", dialog);
