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

  mainWindow = createMainWindow('https://web.boxhero-app.com', {
    ...prevWindowState.position,
    ...prevWindowState.size,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      devTools: true,
      preload: path.resolve(app.getAppPath(), './out/preload.js'),
    },
    // frame: false,
    titleBarStyle: 'hiddenInset', // 이후 윈도일 경우 분기해야됨.
  });

  mainWindow.webContents.openDevTools();

  persistWindowState(mainWindow);
});
