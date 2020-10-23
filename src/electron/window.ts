import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron';
import { isWindow } from './envs';
import { initLocale } from './initLocale';
import { getWindowState, persistWindowState } from './utils/persistWindowState';

export const createMainWindow = (extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  currentWindow.loadFile(path.resolve(app.getAppPath(), './out/index.html'));

  currentWindow.once('ready-to-show', () => {
    currentWindow.show();
  });

  return currentWindow;
};

const windows: BrowserWindow[] = [];

export const openBoxHero = () => {
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

  const {
    position: { x: prevX, y: prevY },
  } = prevWindowState;

  const newWindow = createMainWindow({
    ...prevWindowState.size,
    ...(windows.length > 0
      ? { x: prevX + 50, y: prevY + 50 }
      : prevWindowState.position),
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

  newWindow.webContents.once('did-finish-load', () => {
    initLocale();
    persistWindowState(newWindow);
  });

  windows.push(newWindow);

  newWindow.once('close', () => {
    const findedIndex = windows.findIndex((window) => window === newWindow);
    windows.splice(findedIndex, 1);
  });
};
