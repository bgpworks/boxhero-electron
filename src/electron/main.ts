import path from 'path';
import { app, BrowserWindow } from 'electron';
import { persistWindowState, getWindowState } from './utils/persistWindowState';
import { createMainWindow } from './window';
import { initMainIPC } from './initMainIPC';

const isWindow = true;
const isMac = process.platform === 'darwin';

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
    title: 'BoxHero',
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webviewTag: true,
      preload: path.resolve(app.getAppPath(), './out/preload.js'),
    },
    ...(isWindow ? { frame: false } : { titleBarStyle: 'hiddenInset' }),
  });

  initMainIPC(mainWindow);
  persistWindowState(mainWindow);
};

app.on('ready', initMainWindow);

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) initMainWindow();
});
