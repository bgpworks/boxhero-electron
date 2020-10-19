import path from 'path';
import { app, BrowserWindow } from 'electron';
import { persistWindowState, getWindowState } from './utils/persistWindowState';
import { createMainWindow } from './window';

let mainWindow: BrowserWindow;

app.on('ready', () => {
  const prevWindowState = getWindowState({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 1024,
      height: 768,
    },
  });

  mainWindow = createMainWindow({
    ...prevWindowState.position,
    ...prevWindowState.size,
    minWidth: 500,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webviewTag: true,
      preload: path.resolve(app.getAppPath(), './out/preload.js'),
    },
    titleBarStyle: 'hiddenInset', // 이후 윈도일 경우 분기해야됨.
  });

  persistWindowState(mainWindow);
});
