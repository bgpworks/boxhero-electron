import path from 'path';
import { app, BrowserWindow } from 'electron';
import { persistWindowState, getWindowState } from './utils/persistWindowState';
import { createMainWindow } from './window';
import { initWindowIPC } from './ipc/initWindowIPC';
import { isMac, isWindow } from './envs';
import { initViewIPC } from './ipc/initViewIPC';
import { initLocale } from './initLocale';

let mainWindow: BrowserWindow;

const initMainWindow = () => {
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
    minHeight: 281,
    title: 'BoxHero',
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webviewTag: true,
      preload: path.resolve(
        app.getAppPath(),
        './out/electron/preloads/wrapper-preload.js'
      ),
    },
    backgroundColor: '#282c42',
    ...(isWindow ? { frame: false } : { titleBarStyle: 'hiddenInset' }),
  });

  initWindowIPC(mainWindow);
  initViewIPC(mainWindow);
  persistWindowState(mainWindow);

  mainWindow.webContents.once('did-finish-load', () => {
    initLocale(mainWindow);
  });
};

app.on('ready', () => {
  initMainWindow();
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) initMainWindow();
});
