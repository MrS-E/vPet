const {contextBridge, ipcRenderer} = require("electron");
//const robot = require("robotjs"); does not work

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
//contextBridge.exposeInMainWorld("robot", robot);

