"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let mainWindow;
const createMainWindow = () => {
    const currentWindow = new electron_1.BrowserWindow({
        width: 500,
        height: 500,
    });
    currentWindow.once('ready-to-show', currentWindow.show);
    mainWindow = currentWindow;
};
electron_1.app.on('ready', () => createMainWindow());
