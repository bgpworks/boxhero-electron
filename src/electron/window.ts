import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron';
import { isDev, isWindow } from './envs';
import { getWindowState, persistWindowState } from './utils/persistWindowState';
import { getViewState } from './utils/manageViewState';

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

const setManage = (targetWindow: BrowserWindow) => {
  windows.push(targetWindow);

  targetWindow.once('close', () => {
    const findedIndex = windows.findIndex((window) => window === targetWindow);
    windows.splice(findedIndex, 1);
  });
};

export const openBoxHero = () => {
  const prevWindowState = getWindowState({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 1200,
      height: 800,
    },
  });

  const newWindow = createMainWindow({
    ...prevWindowState.size,
    ...(windows.length > 0 ? getNextPosition() : prevWindowState.position),
    minWidth: 1000,
    minHeight: 562,
    title: 'BoxHero',
    webPreferences: {
      devTools: isDev,
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
    persistWindowState(newWindow);
  });

  setManage(newWindow);
};

export const openAboutPage = () => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow) return;

  const {
    x: parentX,
    y: parentY,
    width: parentWidth,
    height: parentHeight,
  } = focusedWindow.getBounds();

  const aboutWindow = new BrowserWindow({
    x: (parentX + parentWidth * 0.5 - 145) >> 0,
    y: (parentY + parentHeight * 0.3 - 75) >> 0,
    width: 290,
    height: 150,
    alwaysOnTop: true,
    parent: focusedWindow,
  });

  aboutWindow.loadFile(path.resolve(app.getAppPath(), './static/about.html'));
  aboutWindow.once('ready-to-show', () => aboutWindow.show());

  setManage(aboutWindow);
};

const getNextPosition = () => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow) return {};
  const { x, y } = focusedWindow.getBounds();

  return { x: x + 50, y: y + 50 };
};
