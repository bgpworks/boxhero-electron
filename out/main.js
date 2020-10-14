"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const persistWindowState_1 = require("./utils/persistWindowState");
let mainWindow;
const createMainWindow = (url) => {
    const prevWindowState = persistWindowState_1.getWindowState({
        position: {
            x: 0,
            y: 0,
        },
        size: {
            width: 1024,
            height: 768,
        },
    });
    const currentWindow = new electron_1.BrowserWindow({
        ...prevWindowState.position,
        ...prevWindowState.size,
    });
    currentWindow.loadURL(url);
    persistWindowState_1.persistWindowState(currentWindow);
    currentWindow.once('ready-to-show', currentWindow.show);
    return currentWindow;
};
electron_1.app.on('ready', () => {
    mainWindow = createMainWindow('https://boxhero.io');
});
