import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron';
import { isWindow, isDev } from './envs';
import { getWindowState, persistWindowState } from './utils/persistWindowState';
import { getViewState, setUpdateWindow } from './utils/manageViewState';
import logger from 'electron-log';

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

  const { mainWindows } = getViewState();

  const newWindow = createMainWindow({
    ...prevWindowState.size,
    ...(mainWindows.length > 0 ? getNextPosition() : prevWindowState.position),
    minWidth: 1000,
    minHeight: 562,
    title: 'BoxHero',
    webPreferences: {
      contextIsolation: false,
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

  logger.debug(
    `new boxhero window opened [currently ${mainWindows.length} windows opened]`
  );
};

export const openUpdateWindow = () => {
  const { updateWindow } = getViewState();
  if (updateWindow) return;

  const newUpdateWindow = new BrowserWindow({
    width: 320,
    height: 240,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(
        app.getAppPath(),
        './out/electron/preloads/wrapper-preload.js'
      ),
    },
  });

  newUpdateWindow.setMenuBarVisibility(false);
  newUpdateWindow.loadFile(path.resolve(app.getAppPath(), './out/update.html'));

  newUpdateWindow.webContents.once('did-finish-load', () => {
    newUpdateWindow.show();
  });

  newUpdateWindow
    .once('show', () => {
      logger.debug('update window opened');
    })
    .once('close', () => {
      setUpdateWindow();
      logger.debug('update window closed');
    });

  setUpdateWindow(newUpdateWindow);

  return newUpdateWindow;
};

const getNextPosition = () => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow || !isMainWindow(focusedWindow)) return {};

  const { x, y } = focusedWindow.getBounds();

  return { x: x + 50, y: y + 50 };
};

export const createMainWindow = (extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  currentWindow.loadFile(path.resolve(app.getAppPath(), './out/index.html'));

  currentWindow.once('ready-to-show', () => {
    currentWindow.show();
  });

  addToMainWindowGroup(currentWindow);
  return currentWindow;
};

const addToMainWindowGroup = (targetWindow: BrowserWindow) => {
  const { mainWindows } = getViewState();

  mainWindows.push(targetWindow);

  targetWindow.once('close', () => {
    const findedIndex = mainWindows.findIndex(
      (window) => window === targetWindow
    );

    mainWindows.splice(findedIndex, 1);

    logger.debug(
      `boxhero window closed [currently ${mainWindows.length} windows opened]`
    );
  });
};

export const isMainWindow = (target: BrowserWindow) => {
  const { mainWindows } = getViewState();

  return mainWindows.includes(target);
};
